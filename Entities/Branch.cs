using System;
using System.Collections.Generic;

namespace crm.Entities;

public partial class Branch
{
    public int BranchId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Company> Companies { get; set; } = new List<Company>();
}
