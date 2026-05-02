using crm.Dtos;

namespace crm.Services.Interfaces;

public interface ILeadService
{
    Task<IEnumerable<LeadDto>> GetAllAsync();
    Task<LeadDto?> GetByIdAsync(int id);
    Task<LeadDto> CreateAsync(int userId, CreateLeadDto dto);
    Task<LeadDto?> UpdateAsync(int id, UpdateLeadDto dto);
    Task<bool> DeleteAsync(int id);
}