using crm.Dtos;

namespace crm.Services.Interfaces;

public interface ITaskService
{
    Task<IEnumerable<TaskDto>> GetAllAsync();
    Task<IEnumerable<TaskDto>> GetByRecordAsync(int recordId, string recordType);
    Task<IEnumerable<TaskDto>> GetByUserAsync(int userId);
    Task<TaskDto?> GetByIdAsync(int id);
    Task<TaskDto> CreateAsync(CreateTaskDto dto);
    Task<TaskDto?> UpdateAsync(int id, UpdateTaskDto dto);
    Task<bool> DeleteAsync(int id);
}