using crm.DataContext;
using crm.Dtos;
using crm.Entities;
using crm.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace crm.Services.Implementations;

public class ContactService : IContactService
{
    private readonly CrmDbContext _db;
    public ContactService(CrmDbContext db) => _db = db;

    private static ContactDto ToDto(Contact c) => new()
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

    public async Task<IEnumerable<ContactDto>> GetAllAsync() =>
        await _db.Contacts.Include(c => c.Company)
            .Where(c => !c.Deleted).Select(c => ToDto(c)).ToListAsync();

    public async Task<IEnumerable<ContactDto>> GetByCompanyAsync(int companyId) =>
        await _db.Contacts.Include(c => c.Company)
            .Where(c => c.CompanyID == companyId && !c.Deleted)
            .Select(c => ToDto(c)).ToListAsync();

    public async Task<ContactDto?> GetByIdAsync(int id)
    {
        var c = await _db.Contacts.Include(c => c.Company)
            .FirstOrDefaultAsync(c => c.ContactID == id && !c.Deleted);
        return c == null ? null : ToDto(c);
    }

    public async Task<ContactDto> CreateAsync(CreateContactDto dto)
    {
        var contact = new Contact
        {
            CompanyID = dto.CompanyID,
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Position = dto.Position,
            CreatedAt = DateTime.UtcNow,
            LastModified = DateTime.UtcNow
        };
        _db.Contacts.Add(contact);
        await _db.SaveChangesAsync();
        await _db.Entry(contact).Reference(c => c.Company).LoadAsync();
        return ToDto(contact);
    }

    public async Task<ContactDto?> UpdateAsync(int id, UpdateContactDto dto)
    {
        var contact = await _db.Contacts.Include(c => c.Company)
            .FirstOrDefaultAsync(c => c.ContactID == id && !c.Deleted);
        if (contact == null) return null;

        if (dto.CompanyID != null) contact.CompanyID = dto.CompanyID.Value;
        if (dto.Name != null) contact.Name = dto.Name;
        if (dto.Email != null) contact.Email = dto.Email;
        if (dto.Phone != null) contact.Phone = dto.Phone;
        if (dto.Position != null) contact.Position = dto.Position;
        contact.LastModified = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ToDto(contact);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var contact = await _db.Contacts.FirstOrDefaultAsync(c => c.ContactID == id && !c.Deleted);
        if (contact == null) return false;
        contact.Deleted = true;
        contact.LastModified = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }
}