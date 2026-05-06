namespace crm.Entities;

public class ServiceRecord
{
    public int ServiceRecordID { get; set; }
    public int EquipmentID { get; set; }
    public string ServiceType { get; set; } = null!;
    public DateTime ServiceDate { get; set; }
    public string? Description { get; set; }
    public decimal? Cost { get; set; }
    public string? TechnicianName { get; set; }
    public DateTime? NextServiceDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool Deleted { get; set; } = false;

    public Equipment Equipment { get; set; } = null!;
}