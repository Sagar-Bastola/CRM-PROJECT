using crm.DataContext;
using crm.Dtos;
using crm.Entities;
using crm.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace crm.Services.Implementations;

public class LeadsService : ILeadService
{
    private readonly CrmDbContext _db;
    public LeadsService(CrmDbContext db) => _db = db;

    private static LeadDto ToDto(Lead l) => new()
    {
        LeadID = l.LeadID,
        CompanyID = l.CompanyID,
        CompanyName = l.Company?.Name,
        ContactID = l.ContactID,
        ContactName = l.Contact?.Name,
        Source = l.Source,
        Status = l.Status,
        CreatedByUserID = l.CreatedByUserID,
        CreatedByUsername = l.CreatedByUser?.Username,
        CreatedAt = l.CreatedAt,
        LastModified = l.LastModified
    };

    public async Task<IEnumerable<LeadDto>> GetAllAsync() =>
        await _db.Leads.Include(l => l.Company).Include(l => l.Contact).Include(l => l.CreatedByUser)
            .Where(l => !l.Deleted).Select(l => ToDto(l)).ToListAsync();

    public async Task<LeadDto?> GetByIdAsync(int id)
    {
        var l = await _db.Leads.Include(l => l.Company).Include(l => l.Contact).Include(l => l.CreatedByUser)
            .FirstOrDefaultAsync(l => l.LeadID == id && !l.Deleted);
        return l == null ? null : ToDto(l);
    }

    public async Task<LeadDto> CreateAsync(int userId, CreateLeadDto dto)
    {
        var lead = new Lead
        {
            CompanyID = dto.CompanyID,
            ContactID = dto.ContactID,
            Source = dto.Source,
            Status = dto.Status,
            CreatedByUserID = userId,
            CreatedAt = DateTime.UtcNow,
            LastModified = DateTime.UtcNow
        };
        _db.Leads.Add(lead);
        await _db.SaveChangesAsync();
        await _db.Entry(lead).Reference(l => l.Company).LoadAsync();
        await _db.Entry(lead).Reference(l => l.Contact).LoadAsync();
        await _db.Entry(lead).Reference(l => l.CreatedByUser).LoadAsync();
        return ToDto(lead);
    }

    public async Task<LeadDto?> UpdateAsync(int id, UpdateLeadDto dto)
    {
        var lead = await _db.Leads.Include(l => l.Company).Include(l => l.Contact).Include(l => l.CreatedByUser)
            .FirstOrDefaultAsync(l => l.LeadID == id && !l.Deleted);
        if (lead == null) return null;

        if (dto.ContactID != null) lead.ContactID = dto.ContactID;
        if (dto.Source != null) lead.Source = dto.Source;
        if (dto.Status != null) lead.Status = dto.Status;
        lead.LastModified = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ToDto(lead);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var lead = await _db.Leads.FirstOrDefaultAsync(l => l.LeadID == id && !l.Deleted);
        if (lead == null) return false;
        lead.Deleted = true;
        lead.LastModified = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }
}