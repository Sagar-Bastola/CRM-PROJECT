using crm.Dtos;
using crm.Entities;

namespace crm.Extensions.MappingExtensions;

public static class UserMappingExtensions
{
    public static UserDto ToDto(this User u) => new()
    {
        UserID = u.UserID,
        Username = u.Username,
        Email = u.Email,
        Role = u.Role,
        CreatedAt = u.CreatedAt
    };

    public static User ToEntity(this CreateUserDto dto) => new()
    {
        Username = dto.Username,
        Email = dto.Email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        Role = dto.Role,
        CreatedAt = DateTime.UtcNow,
        LastModified = DateTime.UtcNow
    };

    public static void UpdateEntity(this UpdateUserDto dto, User user)
    {
        if (!string.IsNullOrEmpty(dto.Username)) user.Username = dto.Username;
        if (!string.IsNullOrEmpty(dto.Email)) user.Email = dto.Email;
        if (!string.IsNullOrEmpty(dto.Role)) user.Role = dto.Role;
        if (!string.IsNullOrEmpty(dto.Password)) user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        user.LastModified = DateTime.UtcNow;
    }
}