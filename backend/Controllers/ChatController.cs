using crm.Dtos;
using crm.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace crm.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IGroqService _groqService;

    public ChatController(IGroqService groqService)
    {
        _groqService = groqService;
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] ChatRequestDto request)
    {
        if (request.Messages == null || request.Messages.Count == 0)
            return BadRequest(new { message = "Messages cannot be empty." });

        var response = await _groqService.SendMessageAsync(request);
        return Ok(response);
    }
}