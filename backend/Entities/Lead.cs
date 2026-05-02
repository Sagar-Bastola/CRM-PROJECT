namespace crm.Entities;

public class Lead
{
    public int LeadID { get; set; }
    public int CompanyID { get; set; }
    public int? ContactID { get; set; }
    public string? Source { get; set; }
    public string Status { get; set; } = "New";
    public int CreatedByUserID { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastModified { get; set; } = DateTime.UtcNow;
    public bool Deleted { get; set; } = false;

    public Company Company { get; set; } = null!;
    public Contact? Contact { get; set; }
    public User CreatedByUser { get; set; } = null!;
}