using System;
using System.Collections.Generic;

namespace crm.Entities;

public partial class Task
{
    public int TaskId { get; set; }

    public string Subject { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? DueDate { get; set; }

    public bool? IsCompleted { get; set; }

    public DateTime? CompletedDate { get; set; }

    public int RelatedRecordId { get; set; }

    public string RelatedRecordType { get; set; } = null!;

    public int? AssignedToUserId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? LastModified { get; set; }

    public bool? Deleted { get; set; }

    public virtual User? AssignedToUser { get; set; }
}
