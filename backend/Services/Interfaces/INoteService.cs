using crm.Dtos;

namespace crm.Services.Interfaces;

public interface INoteService
{
    Task<IEnumerable<NoteDto>> GetByRecordAsync(int recordId, string recordType);
    Task<NoteDto?> GetByIdAsync(int id);
    Task<NoteDto> CreateAsync(int userId, CreateNoteDto dto);
    Task<NoteDto?> UpdateAsync(int id, UpdateNoteDto dto);
    Task<bool> DeleteAsync(int id);
}