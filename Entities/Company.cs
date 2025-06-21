using System;
using System.Collections.Generic;

namespace crm.Entities;

public partial class Company
{
    public int CompanyId { get; set; }

    public string Name { get; set; } = null!;

    public int? BranchId { get; set; }

    public string? Address1 { get; set; }

    public string? Address2 { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public string? Zip { get; set; }

    public string? County { get; set; }

    public string? Country { get; set; }

    public double? Longitude { get; set; }

    public double? Latitude { get; set; }

    public string? Phone { get; set; }

    public string? Website { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? LastModified { get; set; }

    public bool? Deleted { get; set; }

    public virtual Branch? Branch { get; set; }

    public virtual ICollection<Contact> Contacts { get; set; } = new List<Contact>();

    public virtual ICollection<Equipment> Equipment { get; set; } = new List<Equipment>();

    public virtual ICollection<Lead> Leads { get; set; } = new List<Lead>();

    public virtual ICollection<Opportunity> Opportunities { get; set; } = new List<Opportunity>();
}
