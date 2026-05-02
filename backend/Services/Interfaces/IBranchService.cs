using crm.Dtos;

namespace crm.Services.Interfaces;

public interface IBranchService
{
    Task<IEnumerable<BranchDto>> GetAllAsync();
    Task<BranchDto?> GetByIdAsync(int id);
    Task<BranchDto> CreateAsync(CreateBranchDto dto);
    Task<BranchDto?> UpdateAsync(int id, UpdateBranchDto dto);
    Task<bool> DeleteAsync(int id);
}