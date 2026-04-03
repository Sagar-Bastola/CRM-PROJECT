namespace crm.Entities;

public class Task
{
    public int TaskID { get; set; }
    public string Subject { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; } = false;
    public DateTime? CompletedDate { get; set; }
    public int RelatedRecordID { get; set; }
    public string RelatedRecordType { get; set; } = null!;
    public int? AssignedToUserID { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastModified { get; set; } = DateTime.UtcNow;
    public bool Deleted { get; set; } = false;

    public User? AssignedToUser { get; set; }
}