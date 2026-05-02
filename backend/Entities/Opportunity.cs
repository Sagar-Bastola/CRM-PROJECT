namespace crm.Entities;

public class Opportunity
{
    public int OpportunityID { get; set; }
    public int CompanyID { get; set; }
    public int? ContactID { get; set; }
    public string Name { get; set; } = null!;
    public decimal? Value { get; set; }
    public string Stage { get; set; } = "Discovery";
    public DateTime? CloseDate { get; set; }
    public string Status { get; set; } = "Open";
    public int CreatedByUserID { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastModified { get; set; } = DateTime.UtcNow;
    public bool Deleted { get; set; } = false;

    public Company Company { get; set; } = null!;
    public Contact? Contact { get; set; }
    public User CreatedByUser { get; set; } = null!;
}