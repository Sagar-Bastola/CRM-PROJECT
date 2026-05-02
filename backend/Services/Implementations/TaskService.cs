using crm.DataContext;
using crm.Dtos;
using crm.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using TaskEntity = crm.Entities.Task;

namespace crm.Services.Implementations;

public class TaskService : ITaskService
{
    private readonly CrmDbContext _db;
    public TaskService(CrmDbContext db) => _db = db;

    private static TaskDto ToDto(TaskEntity t) => new()
    {
        TaskID = t.TaskID,
        Subject = t.Subject,
        Description = t.Description,
        DueDate = t.DueDate,
        IsCompleted = t.IsCompleted,
        CompletedDate = t.CompletedDate,
        RelatedRecordID = t.RelatedRecordID,
        RelatedRecordType = t.RelatedRecordType,
        AssignedToUserID = t.AssignedToUserID,
        AssignedToUsername = t.AssignedToUser?.Username,
        CreatedAt = t.CreatedAt,
        LastModified = t.LastModified
    };

    public async Task<IEnumerable<TaskDto>> GetAllAsync() =>
        await _db.Tasks.Include(t => t.AssignedToUser)
            .Where(t => !t.Deleted).Select(t => ToDto(t)).ToListAsync();

    public async Task<IEnumerable<TaskDto>> GetByRecordAsync(int recordId, string recordType) =>
        await _db.Tasks.Include(t => t.AssignedToUser)
            .Where(t => t.RelatedRecordID == recordId &&
                        t.RelatedRecordType == recordType && !t.Deleted)
            .Select(t => ToDto(t)).ToListAsync();

    public async Task<IEnumerable<TaskDto>> GetByUserAsync(int userId) =>
        await _db.Tasks.Include(t => t.AssignedToUser)
            .Where(t => t.AssignedToUserID == userId && !t.Deleted)
            .Select(t => ToDto(t)).ToListAsync();

    public async Task<TaskDto?> GetByIdAsync(int id)
    {
        var t = await _db.Tasks.Include(t => t.AssignedToUser)
            .FirstOrDefaultAsync(t => t.TaskID == id && !t.Deleted);
        return t == null ? null : ToDto(t);
    }

    public async Task<TaskDto> CreateAsync(CreateTaskDto dto)
    {
        var task = new TaskEntity
        {
            Subject = dto.Subject,
            Description = dto.Description,
            DueDate = dto.DueDate,
            RelatedRecordID = dto.RelatedRecordID,
            RelatedRecordType = dto.RelatedRecordType,
            AssignedToUserID = dto.AssignedToUserID,
            CreatedAt = DateTime.UtcNow,
            LastModified = DateTime.UtcNow
        };
        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();
        await _db.Entry(task).Reference(t => t.AssignedToUser).LoadAsync();
        return ToDto(task);
    }

    public async Task<TaskDto?> UpdateAsync(int id, UpdateTaskDto dto)
    {
        var task = await _db.Tasks.Include(t => t.AssignedToUser)
            .FirstOrDefaultAsync(t => t.TaskID == id && !t.Deleted);
        if (task == null) return null;

        if (dto.Subject != null) task.Subject = dto.Subject;
        if (dto.Description != null) task.Description = dto.Description;
        if (dto.DueDate != null) task.DueDate = dto.DueDate;
        if (dto.AssignedToUserID != null) task.AssignedToUserID = dto.AssignedToUserID;
        if (dto.IsCompleted != null)
        {
            task.IsCompleted = dto.IsCompleted.Value;
            task.CompletedDate = dto.IsCompleted.Value ? DateTime.UtcNow : null;
        }
        task.LastModified = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ToDto(task);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var task = await _db.Tasks.FirstOrDefaultAsync(t => t.TaskID == id && !t.Deleted);
        if (task == null) return false;
        task.Deleted = true;
        task.LastModified = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }
}