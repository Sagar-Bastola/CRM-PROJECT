namespace crm.Dtos;

public class CompanyDto
{
    public int CompanyID { get; set; }
    public int? BranchID { get; set; }
    public string? BranchName { get; set; }
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
    public DateTime CreatedAt { get; set; }
    public DateTime LastModified { get; set; }
}

public class CreateCompanyDto
{
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
}

public class UpdateCompanyDto
{
    public int? BranchID { get; set; }
    public string? Name { get; set; }
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
}