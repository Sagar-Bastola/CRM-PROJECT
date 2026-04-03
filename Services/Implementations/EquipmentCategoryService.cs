using crm.DataContext;
using crm.Dtos;
using crm.Entities;
using crm.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace crm.Services.Implementations;

public class EquipmentCategoryService : IEquipmentCategoryService
{
    private readonly CrmDbContext _db;
    public EquipmentCategoryService(CrmDbContext db) => _db = db;

    public async Task<IEnumerable<EquipmentCategoryDto>> GetAllAsync() =>
        await _db.EquipmentCategories
            .Select(e => new EquipmentCategoryDto { CategoryID = e.CategoryID, Name = e.Name })
            .ToListAsync();

    public async Task<EquipmentCategoryDto?> GetByIdAsync(int id)
    {
        var e = await _db.EquipmentCategories.FindAsync(id);
        return e == null ? null : new EquipmentCategoryDto { CategoryID = e.CategoryID, Name = e.Name };
    }

    public async Task<EquipmentCategoryDto> CreateAsync(CreateEquipmentCategoryDto dto)
    {
        var cat = new Equipmentcategory { Name = dto.Name };
        _db.EquipmentCategories.Add(cat);
        await _db.SaveChangesAsync();
        return new EquipmentCategoryDto { CategoryID = cat.CategoryID, Name = cat.Name };
    }

    public async Task<EquipmentCategoryDto?> UpdateAsync(int id, UpdateEquipmentCategoryDto dto)
    {
        var cat = await _db.EquipmentCategories.FindAsync(id);
        if (cat == null) return null;
        cat.Name = dto.Name;
        await _db.SaveChangesAsync();
        return new EquipmentCategoryDto { CategoryID = cat.CategoryID, Name = cat.Name };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var cat = await _db.EquipmentCategories.FindAsync(id);
        if (cat == null) return false;
        _db.EquipmentCategories.Remove(cat);
        await _db.SaveChangesAsync();
        return true;
    }
}