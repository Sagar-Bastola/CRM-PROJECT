using System;
using System.Collections.Generic;

namespace crm.Entities;

public partial class Equipmentcategory
{
    public int CategoryId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Equipment> Equipment { get; set; } = new List<Equipment>();
}
