using crm.DataContext;
using crm.Dtos;
using crm.Entities;
using crm.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace crm.Services.Implementations;

public class CompanyService : ICompanyService
{
    private readonly CrmDbContext _db;
    public CompanyService(CrmDbContext db) => _db = db;

    private static CompanyDto ToDto(Company c) => new()
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

    public async Task<IEnumerable<CompanyDto>> GetAllAsync() =>
        await _db.Companies.Include(c => c.Branch)
            .Where(c => !c.Deleted).Select(c => ToDto(c)).ToListAsync();

    public async Task<CompanyDto?> GetByIdAsync(int id)
    {
        var c = await _db.Companies.Include(c => c.Branch)
            .FirstOrDefaultAsync(c => c.CompanyID == id && !c.Deleted);
        return c == null ? null : ToDto(c);
    }

    public async Task<CompanyDto> CreateAsync(CreateCompanyDto dto)
    {
        var company = new Company
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
        _db.Companies.Add(company);
        await _db.SaveChangesAsync();
        await _db.Entry(company).Reference(c => c.Branch).LoadAsync();
        return ToDto(company);
    }

    public async Task<CompanyDto?> UpdateAsync(int id, UpdateCompanyDto dto)
    {
        var company = await _db.Companies.Include(c => c.Branch)
            .FirstOrDefaultAsync(c => c.CompanyID == id && !c.Deleted);
        if (company == null) return null;

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

        await _db.SaveChangesAsync();
        return ToDto(company);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var company = await _db.Companies.FirstOrDefaultAsync(c => c.CompanyID == id && !c.Deleted);
        if (company == null) return false;
        company.Deleted = true;
        company.LastModified = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }
}