using crm.Dtos;

namespace crm.Services.Interfaces;

public interface IEquipmentCategoryService
{
    Task<IEnumerable<EquipmentCategoryDto>> GetAllAsync();
    Task<EquipmentCategoryDto?> GetByIdAsync(int id);
    Task<EquipmentCategoryDto> CreateAsync(CreateEquipmentCategoryDto dto);
    Task<EquipmentCategoryDto?> UpdateAsync(int id, UpdateEquipmentCategoryDto dto);
    Task<bool> DeleteAsync(int id);
}