namespace crm.Dtos;

public class ServiceRecordDto
{
    public int ServiceRecordID { get; set; }
    public int EquipmentID { get; set; }
    public string ServiceType { get; set; } = null!;
    public DateTime ServiceDate { get; set; }
    public string? Description { get; set; }
    public decimal? Cost { get; set; }
    public string? TechnicianName { get; set; }
    public DateTime? NextServiceDate { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateServiceRecordDto
{
    public string ServiceType { get; set; } = null!;
    public DateTime ServiceDate { get; set; }
    public string? Description { get; set; }
    public decimal? Cost { get; set; }
    public string? TechnicianName { get; set; }
    public DateTime? NextServiceDate { get; set; }
}