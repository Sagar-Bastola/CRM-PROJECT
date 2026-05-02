using crm.Dtos;
using crm.Entities;

namespace crm.Extensions.MappingExtensions;

public static class EquipmentMappingExtension
{
    public static EquipmentDto ToDto(this Equipment e) => new()
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

    public static Equipment ToEntity(this CreateEquipmentDto dto) => new()
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

    public static void UpdateEntity(this UpdateEquipmentDto dto, Equipment eq)
    {
        if (dto.CategoryID != null) eq.CategoryID = dto.CategoryID;
        if (dto.Name != null) eq.Name = dto.Name;
        if (dto.Model != null) eq.Model = dto.Model;
        if (dto.SerialNumber != null) eq.SerialNumber = dto.SerialNumber;
        if (dto.Year != null) eq.Year = dto.Year;
        if (dto.LastServiceDate != null) eq.LastServiceDate = dto.LastServiceDate;
        if (dto.Longitude != null) eq.Longitude = dto.Longitude;
        if (dto.Latitude != null) eq.Latitude = dto.Latitude;
        eq.LastModified = DateTime.UtcNow;
    }
}