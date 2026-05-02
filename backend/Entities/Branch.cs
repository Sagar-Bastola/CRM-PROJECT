namespace crm.Entities;

public class Branch
{
    public int BranchID { get; set; }
    public string Name { get; set; } = null!;

    public ICollection<Company> Companies { get; set; } = new List<Company>();
}