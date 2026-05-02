using crm.DataContext;
using crm.Dtos;
using crm.Entities;
using crm.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace crm.Services.Implementations;

public class OpportunityService : IOpportunityService
{
    private readonly CrmDbContext _db;
    public OpportunityService(CrmDbContext db) => _db = db;

    private static OpportunityDto ToDto(Opportunity o) => new()
    {
        OpportunityID = o.OpportunityID,
        CompanyID = o.CompanyID,
        CompanyName = o.Company?.Name,
        ContactID = o.ContactID,
        ContactName = o.Contact?.Name,
        Name = o.Name,
        Value = o.Value,
        Stage = o.Stage,
        CloseDate = o.CloseDate,
        Status = o.Status,
        CreatedByUserID = o.CreatedByUserID,
        CreatedByUsername = o.CreatedByUser?.Username,
        CreatedAt = o.CreatedAt,
        LastModified = o.LastModified
    };

    public async Task<IEnumerable<OpportunityDto>> GetAllAsync() =>
        await _db.Opportunities
            .Include(o => o.Company).Include(o => o.Contact).Include(o => o.CreatedByUser)
            .Where(o => !o.Deleted).Select(o => ToDto(o)).ToListAsync();

    public async Task<OpportunityDto?> GetByIdAsync(int id)
    {
        var o = await _db.Opportunities
            .Include(o => o.Company).Include(o => o.Contact).Include(o => o.CreatedByUser)
            .FirstOrDefaultAsync(o => o.OpportunityID == id && !o.Deleted);
        return o == null ? null : ToDto(o);
    }

    public async Task<OpportunityDto> CreateAsync(int userId, CreateOpportunityDto dto)
    {
        var opp = new Opportunity
        {
            CompanyID = dto.CompanyID,
            ContactID = dto.ContactID,
            Name = dto.Name,
            Value = dto.Value,
            Stage = dto.Stage,
            CloseDate = dto.CloseDate,
            Status = dto.Status,
            CreatedByUserID = userId,
            CreatedAt = DateTime.UtcNow,
            LastModified = DateTime.UtcNow
        };
        _db.Opportunities.Add(opp);
        await _db.SaveChangesAsync();
        await _db.Entry(opp).Reference(o => o.Company).LoadAsync();
        await _db.Entry(opp).Reference(o => o.Contact).LoadAsync();
        await _db.Entry(opp).Reference(o => o.CreatedByUser).LoadAsync();
        return ToDto(opp);
    }

    public async Task<OpportunityDto?> UpdateAsync(int id, UpdateOpportunityDto dto)
    {
        var opp = await _db.Opportunities
            .Include(o => o.Company).Include(o => o.Contact).Include(o => o.CreatedByUser)
            .FirstOrDefaultAsync(o => o.OpportunityID == id && !o.Deleted);
        if (opp == null) return null;

        if (dto.ContactID != null) opp.ContactID = dto.ContactID;
        if (dto.Name != null) opp.Name = dto.Name;
        if (dto.Value != null) opp.Value = dto.Value;
        if (dto.Stage != null) opp.Stage = dto.Stage;
        if (dto.CloseDate != null) opp.CloseDate = dto.CloseDate;
        if (dto.Status != null) opp.Status = dto.Status;
        opp.LastModified = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ToDto(opp);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var opp = await _db.Opportunities.FirstOrDefaultAsync(o => o.OpportunityID == id && !o.Deleted);
        if (opp == null) return false;
        opp.Deleted = true;
        opp.LastModified = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }
}