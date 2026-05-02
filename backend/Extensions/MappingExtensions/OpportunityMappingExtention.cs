using crm.Dtos;
using crm.Entities;

namespace crm.Extensions.MappingExtensions;

public static class OpportunityMappingExtension
{
    public static OpportunityDto ToDto(this Opportunity o) => new()
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

    public static Opportunity ToEntity(this CreateOpportunityDto dto, int userId) => new()
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

    public static void UpdateEntity(this UpdateOpportunityDto dto, Opportunity opp)
    {
        if (dto.ContactID != null) opp.ContactID = dto.ContactID;
        if (dto.Name != null) opp.Name = dto.Name;
        if (dto.Value != null) opp.Value = dto.Value;
        if (dto.Stage != null) opp.Stage = dto.Stage;
        if (dto.CloseDate != null) opp.CloseDate = dto.CloseDate;
        if (dto.Status != null) opp.Status = dto.Status;
        opp.LastModified = DateTime.UtcNow;
    }
}