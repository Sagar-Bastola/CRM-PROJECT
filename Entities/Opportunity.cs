using System;
using System.Collections.Generic;

namespace crm.Entities;

public partial class Opportunity
{
    public int OpportunityId { get; set; }

    public int? CompanyId { get; set; }

    public int? ContactId { get; set; }

    public string Name { get; set; } = null!;

    public decimal? Value { get; set; }

    public string Stage { get; set; } = null!;

    public DateTime? CloseDate { get; set; }

    public string Status { get; set; } = null!;

    public int? CreatedByUserId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? LastModified { get; set; }

    public bool? Deleted { get; set; }

    public virtual Company? Company { get; set; }

    public virtual Contact? Contact { get; set; }

    public virtual User? CreatedByUser { get; set; }
}
