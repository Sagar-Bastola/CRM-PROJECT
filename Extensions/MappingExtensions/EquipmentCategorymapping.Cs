using crm.Dtos;
using crm.Entities;

namespace crm.Extensions.MappingExtensions;

public static class EquipmentCategoryMapping
{
    public static EquipmentCategoryDto ToDto(this Equipmentcategory cat) => new()
    {
        CategoryID = cat.CategoryID,
        Name = cat.Name
    };

    public static Equipmentcategory ToEntity(this CreateEquipmentCategoryDto dto) => new()
    {
        Name = dto.Name
    };

    public static void UpdateEntity(this UpdateEquipmentCategoryDto dto, Equipmentcategory cat)
    {
        cat.Name = dto.Name;
    }
}