namespace crm.Dtos;

public class TaskDto
{
    public int TaskID { get; set; }
    public string Subject { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedDate { get; set; }
    public int RelatedRecordID { get; set; }
    public string RelatedRecordType { get; set; } = null!;
    public int? AssignedToUserID { get; set; }
    public string? AssignedToUsername { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastModified { get; set; }
}

public class CreateTaskDto
{
    public string Subject { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }
    public int RelatedRecordID { get; set; }
    public string RelatedRecordType { get; set; } = null!;
    public int? AssignedToUserID { get; set; }
}

public class UpdateTaskDto
{
    public string? Subject { get; set; }
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }
    public bool? IsCompleted { get; set; }
    public int? AssignedToUserID { get; set; }
}