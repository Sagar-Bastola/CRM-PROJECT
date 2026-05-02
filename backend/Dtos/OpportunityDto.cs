namespace crm.Dtos;

public class OpportunityDto
{
    public int OpportunityID { get; set; }
    public int CompanyID { get; set; }
    public string? CompanyName { get; set; }
    public int? ContactID { get; set; }
    public string? ContactName { get; set; }
    public string Name { get; set; } = null!;
    public decimal? Value { get; set; }
    public string Stage { get; set; } = null!;
    public DateTime? CloseDate { get; set; }
    public string Status { get; set; } = null!;
    public int CreatedByUserID { get; set; }
    public string? CreatedByUsername { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastModified { get; set; }
}

public class CreateOpportunityDto
{
    public int CompanyID { get; set; }
    public int? ContactID { get; set; }
    public string Name { get; set; } = null!;
    public decimal? Value { get; set; }
    public string Stage { get; set; } = "Discovery";
    public DateTime? CloseDate { get; set; }
    public string Status { get; set; } = "Open";
}

public class UpdateOpportunityDto
{
    public int? ContactID { get; set; }
    public string? Name { get; set; }
    public decimal? Value { get; set; }
    public string? Stage { get; set; }
    public DateTime? CloseDate { get; set; }
    public string? Status { get; set; }
}