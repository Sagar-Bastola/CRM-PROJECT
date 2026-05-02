using crm.Dtos;
using crm.Entities;

namespace crm.Extensions.MappingExtensions;

public static class CompanyMappingExtensions
{
    public static CompanyDto ToDto(this Company c) => new()
    {
        CompanyID = c.CompanyID,
        BranchID = c.BranchID,
        BranchName = c.Branch?.Name,
        Name = c.Name,
        Address1 = c.Address1,
        Address2 = c.Address2,
        City = c.City,
        State = c.State,
        Zip = c.Zip,
        County = c.County,
        Country = c.Country,
        Longitude = c.Longitude,
        Latitude = c.Latitude,
        Phone = c.Phone,
        Website = c.Website,
        CreatedAt = c.CreatedAt,
        LastModified = c.LastModified
    };

    public static Company ToEntity(this CreateCompanyDto dto) => new()
    {
        BranchID = dto.BranchID,
        Name = dto.Name,
        Address1 = dto.Address1,
        Address2 = dto.Address2,
        City = dto.City,
        State = dto.State,
        Zip = dto.Zip,
        County = dto.County,
        Country = dto.Country,
        Longitude = dto.Longitude,
        Latitude = dto.Latitude,
        Phone = dto.Phone,
        Website = dto.Website,
        CreatedAt = DateTime.UtcNow,
        LastModified = DateTime.UtcNow
    };

    public static void UpdateEntity(this UpdateCompanyDto dto, Company company)
    {
        if (dto.BranchID != null) company.BranchID = dto.BranchID;
        if (dto.Name != null) company.Name = dto.Name;
        if (dto.Address1 != null) company.Address1 = dto.Address1;
        if (dto.Address2 != null) company.Address2 = dto.Address2;
        if (dto.City != null) company.City = dto.City;
        if (dto.State != null) company.State = dto.State;
        if (dto.Zip != null) company.Zip = dto.Zip;
        if (dto.County != null) company.County = dto.County;
        if (dto.Country != null) company.Country = dto.Country;
        if (dto.Longitude != null) company.Longitude = dto.Longitude;
        if (dto.Latitude != null) company.Latitude = dto.Latitude;
        if (dto.Phone != null) company.Phone = dto.Phone;
        if (dto.Website != null) company.Website = dto.Website;
        company.LastModified = DateTime.UtcNow;
    }
}