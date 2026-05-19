using crm.Dtos;

namespace crm.Services.Interfaces;

public interface IGroqService
{
    Task<ChatResponseDto> SendMessageAsync(ChatRequestDto request);
}