namespace crm.Dtos;

public class EquipmentDto
{
    public int EquipmentID { get; set; }
    public int CompanyID { get; set; }
    public string? CompanyName { get; set; }
    public int? CategoryID { get; set; }
    public string? CategoryName { get; set; }
    public string Name { get; set; } = null!;
    public string? Model { get; set; }
    public string? SerialNumber { get; set; }
    public int? Year { get; set; }
    public DateTime? LastServiceDate { get; set; }
    public float? Longitude { get; set; }
    public float? Latitude { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastModified { get; set; }
}

public class CreateEquipmentDto
{
    public int CompanyID { get; set; }
    public int? CategoryID { get; set; }
    public string Name { get; set; } = null!;
    public string? Model { get; set; }
    public string? SerialNumber { get; set; }
    public int? Year { get; set; }
    public DateTime? LastServiceDate { get; set; }
    public float? Longitude { get; set; }
    public float? Latitude { get; set; }
}

public class UpdateEquipmentDto
{
    public int? CategoryID { get; set; }
    public string? Name { get; set; }
    public string? Model { get; set; }
    public string? SerialNumber { get; set; }
    public int? Year { get; set; }
    public DateTime? LastServiceDate { get; set; }
    public float? Longitude { get; set; }
    public float? Latitude { get; set; }
}