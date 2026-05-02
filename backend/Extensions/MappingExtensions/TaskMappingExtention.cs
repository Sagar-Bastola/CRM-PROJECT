using crm.Dtos;
using TaskEntity = crm.Entities.Task;

namespace crm.Extensions.MappingExtensions;

public static class TaskMappingExtension
{
    public static TaskDto ToDto(this TaskEntity t) => new()
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

    public static TaskEntity ToEntity(this CreateTaskDto dto) => new()
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

    public static void UpdateEntity(this UpdateTaskDto dto, TaskEntity task)
    {
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
    }
}