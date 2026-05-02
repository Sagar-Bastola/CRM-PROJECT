namespace crm.Dtos;

public class ContactDto
{
    public int ContactID { get; set; }
    public int CompanyID { get; set; }
    public string? CompanyName { get; set; }
    public string Name { get; set; } = null!;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Position { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastModified { get; set; }
}

public class CreateContactDto
{
    public int CompanyID { get; set; }
    public string Name { get; set; } = null!;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Position { get; set; }
}

public class UpdateContactDto
{
    public int? CompanyID { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Position { get; set; }
}