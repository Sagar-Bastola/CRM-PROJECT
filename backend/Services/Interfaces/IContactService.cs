using crm.Dtos;

namespace crm.Services.Interfaces;

public interface IContactService
{
    Task<IEnumerable<ContactDto>> GetAllAsync();
    Task<IEnumerable<ContactDto>> GetByCompanyAsync(int companyId);
    Task<ContactDto?> GetByIdAsync(int id);
    Task<ContactDto> CreateAsync(CreateContactDto dto);
    Task<ContactDto?> UpdateAsync(int id, UpdateContactDto dto);
    Task<bool> DeleteAsync(int id);
}