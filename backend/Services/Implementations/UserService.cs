using crm.DataContext;
using crm.Dtos;
using crm.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace crm.Services.Implementations;

public class UserService : IUserService
{
    private readonly CrmDbContext _db;
    public UserService(CrmDbContext db) => _db = db;

    public async Task<IEnumerable<UserDto>> GetAllAsync() =>
        await _db.Users.Where(u => !u.Deleted)
            .Select(u => new UserDto
            {
                UserID = u.UserID,
                Username = u.Username,
                Email = u.Email,
                Role = u.Role,
                CreatedAt = u.CreatedAt
            }).ToListAsync();

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var u = await _db.Users.FirstOrDefaultAsync(u => u.UserID == id && !u.Deleted);
        if (u == null) return null;
        return new UserDto { UserID = u.UserID, Username = u.Username, Email = u.Email, Role = u.Role, CreatedAt = u.CreatedAt };
    }

    public async Task<UserDto?> UpdateAsync(int id, UpdateUserDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserID == id && !u.Deleted);
        if (user == null) return null;

        if (!string.IsNullOrEmpty(dto.Username)) user.Username = dto.Username;
        if (!string.IsNullOrEmpty(dto.Email)) user.Email = dto.Email;
        if (!string.IsNullOrEmpty(dto.Role)) user.Role = dto.Role;
        if (!string.IsNullOrEmpty(dto.Password)) user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        user.LastModified = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return new UserDto { UserID = user.UserID, Username = user.Username, Email = user.Email, Role = user.Role, CreatedAt = user.CreatedAt };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserID == id && !u.Deleted);
        if (user == null) return false;
        user.Deleted = true;
        user.LastModified = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }
}