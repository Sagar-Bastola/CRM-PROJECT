using crm.Dtos;
using crm.Entities;

namespace crm.Extensions.MappingExtensions;

public static class ContactsMappingExtensions
{
    public static ContactDto ToDto(this Contact c) => new()
    {
        ContactID = c.ContactID,
        CompanyID = c.CompanyID,
        CompanyName = c.Company?.Name,
        Name = c.Name,
        Email = c.Email,
        Phone = c.Phone,
        Position = c.Position,
        CreatedAt = c.CreatedAt,
        LastModified = c.LastModified
    };

    public static Contact ToEntity(this CreateContactDto dto) => new()
    {
        CompanyID = dto.CompanyID,
        Name = dto.Name,
        Email = dto.Email,
        Phone = dto.Phone,
        Position = dto.Position,
        CreatedAt = DateTime.UtcNow,
        LastModified = DateTime.UtcNow
    };

    public static void UpdateEntity(this UpdateContactDto dto, Contact contact)
    {
        if (dto.CompanyID != null) contact.CompanyID = dto.CompanyID.Value;
        if (dto.Name != null) contact.Name = dto.Name;
        if (dto.Email != null) contact.Email = dto.Email;
        if (dto.Phone != null) contact.Phone = dto.Phone;
        if (dto.Position != null) contact.Position = dto.Position;
        contact.LastModified = DateTime.UtcNow;
    }
}