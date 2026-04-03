using crm.Dtos;

namespace crm.Services.Interfaces;

public interface IOpportunityService
{
    Task<IEnumerable<OpportunityDto>> GetAllAsync();
    Task<OpportunityDto?> GetByIdAsync(int id);
    Task<OpportunityDto> CreateAsync(int userId, CreateOpportunityDto dto);
    Task<OpportunityDto?> UpdateAsync(int id, UpdateOpportunityDto dto);
    Task<bool> DeleteAsync(int id);
}