using crm.Dtos;
using crm.Entities;

namespace crm.Extensions.MappingExtensions;

public static class LeadMappingExtensions
{
    public static LeadDto ToDto(this Lead l) => new()
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

    public static Lead ToEntity(this CreateLeadDto dto, int userId) => new()
    {
        CompanyID = dto.CompanyID,
        ContactID = dto.ContactID,
        Source = dto.Source,
        Status = dto.Status,
        CreatedByUserID = userId,
        CreatedAt = DateTime.UtcNow,
        LastModified = DateTime.UtcNow
    };

    public static void UpdateEntity(this UpdateLeadDto dto, Lead lead)
    {
        if (dto.ContactID != null) lead.ContactID = dto.ContactID;
        if (dto.Source != null) lead.Source = dto.Source;
        if (dto.Status != null) lead.Status = dto.Status;
        lead.LastModified = DateTime.UtcNow;
    }
}