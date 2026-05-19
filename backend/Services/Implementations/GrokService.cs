using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using crm.Dtos;
using crm.Services.Interfaces;

namespace crm.Services.Implementations;

public class GroqService : IGroqService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public GroqService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<ChatResponseDto> SendMessageAsync(ChatRequestDto request)
    {
        var apiKey = _configuration["Groq:ApiKey"];
        var model = _configuration["Groq:Model"] ?? "llama-3.1-8b-instant";

        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", apiKey);

        var systemMessage = new
        {
            role = "system",
            content = @"You are HeavyTrack CRM's virtual assistant. 
                        HeavyTrack is a CRM built specifically for heavy equipment dealers — 
                        it helps them track customer fleets, manage leads, log service records, 
                        and close more equipment deals. 
                        Answer questions about features, pricing tiers, and demo requests. 
                        Keep responses concise and professional."
        };

        var messages = new List<object> { systemMessage };
        messages.AddRange(request.Messages.Select(m => new { role = m.Role, content = m.Content }));

        var payload = new
        {
            model,
            messages,
            max_tokens = 500,
            temperature = 0.7
        };

        var content = new StringContent(
            JsonSerializer.Serialize(payload),
            Encoding.UTF8,
            "application/json"
        );

        var response = await _httpClient.PostAsync(
            "https://api.groq.com/openai/v1/chat/completions",
            content
        );

        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);

        var reply = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? "Sorry, I couldn't process your request.";

        return new ChatResponseDto { Reply = reply };
    }
}