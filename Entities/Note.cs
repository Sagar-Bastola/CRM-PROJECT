using System;
using System.Collections.Generic;

namespace crm.Entities;

public partial class Note
{
    public int NoteId { get; set; }

    public int RelatedRecordId { get; set; }

    public string RelatedRecordType { get; set; } = null!;

    public int? UserId { get; set; }

    public string NoteText { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public DateTime? LastModified { get; set; }

    public bool? Deleted { get; set; }

    public virtual User? User { get; set; }
}
