using System;
using System.Collections.Generic;

namespace crm.Entities;

public partial class Equipment
{
    public int EquipmentId { get; set; }

    public int? CompanyId { get; set; }

    public int? CategoryId { get; set; }

    public string Name { get; set; } = null!;

    public string? Model { get; set; }

    public string? SerialNumber { get; set; }

    public int? Year { get; set; }

    public DateTime? LastServiceDate { get; set; }

    public double? Longitude { get; set; }

    public double? Latitude { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? LastModified { get; set; }

    public bool? Deleted { get; set; }

    public virtual Equipmentcategory? Category { get; set; }

    public virtual Company? Company { get; set; }
}
