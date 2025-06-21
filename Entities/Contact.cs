using System;
using System.Collections.Generic;

namespace crm.Entities;

public partial class Contact
{
    public int ContactId { get; set; }

    public int? CompanyId { get; set; }

    public string Name { get; set; } = null!;

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? Position { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? LastModified { get; set; }

    public bool? Deleted { get; set; }

    public virtual Company? Company { get; set; }

    public virtual ICollection<Lead> Leads { get; set; } = new List<Lead>();

    public virtual ICollection<Opportunity> Opportunities { get; set; } = new List<Opportunity>();
}
