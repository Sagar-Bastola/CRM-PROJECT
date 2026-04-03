using crm.DataContext;
using crm.Dtos;
using crm.Entities;
using crm.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace crm.Services.Implementations;

public class EquipmentService : IEquipmentService
{
    private readonly CrmDbContext _db;
    public EquipmentService(CrmDbContext db) => _db = db;

    private static EquipmentDto ToDto(Equipment e) => new()
    {
        EquipmentID = e.EquipmentID,
        CompanyID = e.CompanyID,
        CompanyName = e.Company?.Name,
        CategoryID = e.CategoryID,
        CategoryName = e.Category?.Name,
        Name = e.Name,
        Model = e.Model,
        SerialNumber = e.SerialNumber,
        Year = e.Year,
        LastServiceDate = e.LastServiceDate,
        Longitude = e.Longitude,
        Latitude = e.Latitude,
        CreatedAt = e.CreatedAt,
        LastModified = e.LastModified
    };

    public async Task<IEnumerable<EquipmentDto>> GetAllAsync() =>
        await _db.Equipment.Include(e => e.Company).Include(e => e.Category)
            .Where(e => !e.Deleted).Select(e => ToDto(e)).ToListAsync();

    public async Task<IEnumerable<EquipmentDto>> GetByCompanyAsync(int companyId) =>
        await _db.Equipment.Include(e => e.Company).Include(e => e.Category)
            .Where(e => e.CompanyID == companyId && !e.Deleted)
            .Select(e => ToDto(e)).ToListAsync();

    public async Task<EquipmentDto?> GetByIdAsync(int id)
    {
        var e = await _db.Equipment.Include(e => e.Company).Include(e => e.Category)
            .FirstOrDefaultAsync(e => e.EquipmentID == id && !e.Deleted);
        return e == null ? null : ToDto(e);
    }

    public async Task<EquipmentDto> CreateAsync(CreateEquipmentDto dto)
    {
        var eq = new Equipment
        {
            CompanyID = dto.CompanyID,
            CategoryID = dto.CategoryID,
            Name = dto.Name,
            Model = dto.Model,
            SerialNumber = dto.SerialNumber,
            Year = dto.Year,
            LastServiceDate = dto.LastServiceDate,
            Longitude = dto.Longitude,
            Latitude = dto.Latitude,
            CreatedAt = DateTime.UtcNow,
            LastModified = DateTime.UtcNow
        };
        _db.Equipment.Add(eq);
        await _db.SaveChangesAsync();
        await _db.Entry(eq).Reference(e => e.Company).LoadAsync();
        await _db.Entry(eq).Reference(e => e.Category).LoadAsync();
        return ToDto(eq);
    }

    public async Task<EquipmentDto?> UpdateAsync(int id, UpdateEquipmentDto dto)
    {
        var eq = await _db.Equipment.Include(e => e.Company).Include(e => e.Category)
            .FirstOrDefaultAsync(e => e.EquipmentID == id && !e.Deleted);
        if (eq == null) return null;

        if (dto.CategoryID != null) eq.CategoryID = dto.CategoryID;
        if (dto.Name != null) eq.Name = dto.Name;
        if (dto.Model != null) eq.Model = dto.Model;
        if (dto.SerialNumber != null) eq.SerialNumber = dto.SerialNumber;
        if (dto.Year != null) eq.Year = dto.Year;
        if (dto.LastServiceDate != null) eq.LastServiceDate = dto.LastServiceDate;
        if (dto.Longitude != null) eq.Longitude = dto.Longitude;
        if (dto.Latitude != null) eq.Latitude = dto.Latitude;
        eq.LastModified = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ToDto(eq);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var eq = await _db.Equipment.FirstOrDefaultAsync(e => e.EquipmentID == id && !e.Deleted);
        if (eq == null) return false;
        eq.Deleted = true;
        eq.LastModified = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }
}