using crm.DataContext;
using crm.Dtos;
using crm.Entities;
using crm.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace crm.Services.Implementations;

public class NoteService : INoteService
{
    private readonly CrmDbContext _db;
    public NoteService(CrmDbContext db) => _db = db;

    private static NoteDto ToDto(Note n) => new()
    {
        NoteID = n.NoteID,
        RelatedRecordID = n.RelatedRecordID,
        RelatedRecordType = n.RelatedRecordType,
        UserID = n.UserID,
        AuthorUsername = n.User?.Username,
        NoteText = n.NoteText,
        CreatedAt = n.CreatedAt,
        LastModified = n.LastModified
    };

    public async Task<IEnumerable<NoteDto>> GetByRecordAsync(int recordId, string recordType) =>
        await _db.Notes.Include(n => n.User)
            .Where(n => n.RelatedRecordID == recordId &&
                        n.RelatedRecordType == recordType && !n.Deleted)
            .Select(n => ToDto(n)).ToListAsync();

    public async Task<NoteDto?> GetByIdAsync(int id)
    {
        var n = await _db.Notes.Include(n => n.User)
            .FirstOrDefaultAsync(n => n.NoteID == id && !n.Deleted);
        return n == null ? null : ToDto(n);
    }

    public async Task<NoteDto> CreateAsync(int userId, CreateNoteDto dto)
    {
        var note = new Note
        {
            RelatedRecordID = dto.RelatedRecordID,
            RelatedRecordType = dto.RelatedRecordType,
            UserID = userId,
            NoteText = dto.NoteText,
            CreatedAt = DateTime.UtcNow,
            LastModified = DateTime.UtcNow
        };
        _db.Notes.Add(note);
        await _db.SaveChangesAsync();
        await _db.Entry(note).Reference(n => n.User).LoadAsync();
        return ToDto(note);
    }

    public async Task<NoteDto?> UpdateAsync(int id, UpdateNoteDto dto)
    {
        var note = await _db.Notes.Include(n => n.User)
            .FirstOrDefaultAsync(n => n.NoteID == id && !n.Deleted);
        if (note == null) return null;
        note.NoteText = dto.NoteText;
        note.LastModified = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return ToDto(note);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var note = await _db.Notes.FirstOrDefaultAsync(n => n.NoteID == id && !n.Deleted);
        if (note == null) return false;
        note.Deleted = true;
        note.LastModified = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }
}