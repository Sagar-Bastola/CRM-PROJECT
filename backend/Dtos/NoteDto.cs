namespace crm.Dtos;

public class NoteDto
{
    public int NoteID { get; set; }
    public int RelatedRecordID { get; set; }
    public string RelatedRecordType { get; set; } = null!;
    public int UserID { get; set; }
    public string? AuthorUsername { get; set; }
    public string NoteText { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime LastModified { get; set; }
}

public class CreateNoteDto
{
    public int RelatedRecordID { get; set; }
    public string RelatedRecordType { get; set; } = null!;
    public string NoteText { get; set; } = null!;
}

public class UpdateNoteDto
{
    public string NoteText { get; set; } = null!;
}