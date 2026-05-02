namespace crm.Entities;

public class User
{
    public int UserID { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string Role { get; set; } = "User";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastModified { get; set; } = DateTime.UtcNow;
    public bool Deleted { get; set; } = false;

    public ICollection<Note> Notes { get; set; } = new List<Note>();
    public ICollection<Task> AssignedTasks { get; set; } = new List<Task>();
    public ICollection<Lead> CreatedLeads { get; set; } = new List<Lead>();
    public ICollection<Opportunity> CreatedOpportunities { get; set; } = new List<Opportunity>();
}