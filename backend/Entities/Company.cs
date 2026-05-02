namespace crm.Entities;

public class Company
{
    public int CompanyID { get; set; }
    public int? BranchID { get; set; }
    public string Name { get; set; } = null!;
    public string? Address1 { get; set; }
    public string? Address2 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Zip { get; set; }
    public string? County { get; set; }
    public string? Country { get; set; }
    public float? Longitude { get; set; }
    public float? Latitude { get; set; }
    public string? Phone { get; set; }
    public string? Website { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastModified { get; set; } = DateTime.UtcNow;
    public bool Deleted { get; set; } = false;

    public Branch? Branch { get; set; }
    public ICollection<Contact> Contacts { get; set; } = new List<Contact>();
    public ICollection<Equipment> Equipment { get; set; } = new List<Equipment>();
    public ICollection<Lead> Leads { get; set; } = new List<Lead>();
    public ICollection<Opportunity> Opportunities { get; set; } = new List<Opportunity>();
}