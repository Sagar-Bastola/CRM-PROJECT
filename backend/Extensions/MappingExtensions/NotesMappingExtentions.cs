using crm.Dtos;
using crm.Entities;

namespace crm.Extensions.MappingExtensions;

public static class NotesMappingExtensions
{
    public static NoteDto ToDto(this Note n) => new()
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

    public static Note ToEntity(this CreateNoteDto dto, int userId) => new()
    {
        RelatedRecordID = dto.RelatedRecordID,
        RelatedRecordType = dto.RelatedRecordType,
        UserID = userId,
        NoteText = dto.NoteText,
        CreatedAt = DateTime.UtcNow,
        LastModified = DateTime.UtcNow
    };

    public static void UpdateEntity(this UpdateNoteDto dto, Note note)
    {
        note.NoteText = dto.NoteText;
        note.LastModified = DateTime.UtcNow;
    }
}