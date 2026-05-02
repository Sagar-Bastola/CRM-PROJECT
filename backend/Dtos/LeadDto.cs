namespace crm.Dtos;

public class LeadDto
{
    public int LeadID { get; set; }
    public int CompanyID { get; set; }
    public string? CompanyName { get; set; }
    public int? ContactID { get; set; }
    public string? ContactName { get; set; }
    public string? Source { get; set; }
    public string Status { get; set; } = null!;
    public int CreatedByUserID { get; set; }
    public string? CreatedByUsername { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastModified { get; set; }
}

public class CreateLeadDto
{
    public int CompanyID { get; set; }
    public int? ContactID { get; set; }
    public string? Source { get; set; }
    public string Status { get; set; } = "New";
}

public class UpdateLeadDto
{
    public int? ContactID { get; set; }
    public string? Source { get; set; }
    public string? Status { get; set; }
}