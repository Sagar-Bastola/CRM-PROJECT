namespace crm.Entities;

public class Equipment
{
    public int EquipmentID { get; set; }
    public int CompanyID { get; set; }
    public int? CategoryID { get; set; }
    public string Name { get; set; } = null!;
    public string? Model { get; set; }
    public string? SerialNumber { get; set; }
    public int? Year { get; set; }
    public DateTime? LastServiceDate { get; set; }
    public float? Longitude { get; set; }
    public float? Latitude { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastModified { get; set; } = DateTime.UtcNow;
    public bool Deleted { get; set; } = false;

    public Company Company { get; set; } = null!;
    public Equipmentcategory? Category { get; set; }
}