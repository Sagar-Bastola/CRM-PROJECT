namespace crm.Dtos;

public class ChatMessageDto
{
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}

public class ChatRequestDto
{
    public List<ChatMessageDto> Messages { get; set; } = new();
}

public class ChatResponseDto
{
    public string Reply { get; set; } = string.Empty;
}