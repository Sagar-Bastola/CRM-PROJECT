namespace crm.Entities;

public class Note
{
    public int NoteID { get; set; }
    public int RelatedRecordID { get; set; }
    public string RelatedRecordType { get; set; } = null!;
    public int UserID { get; set; }
    public string NoteText { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastModified { get; set; } = DateTime.UtcNow;
    public bool Deleted { get; set; } = false;

    public User User { get; set; } = null!;
}