using crm.Entities;
using Microsoft.EntityFrameworkCore;
using Task = crm.Entities.Task;

namespace crm.DataContext;

public class CrmDbContext : DbContext
{
    public CrmDbContext(DbContextOptions<CrmDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Branch> Branches { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<Contact> Contacts { get; set; }
    public DbSet<Equipmentcategory> EquipmentCategories { get; set; }
    public DbSet<Equipment> Equipment { get; set; }
    public DbSet<Note> Notes { get; set; }
    public DbSet<Task> Tasks { get; set; }
    public DbSet<Lead> Leads { get; set; }
    public DbSet<Opportunity> Opportunities { get; set; }
    public DbSet<ServiceRecord> ServiceRecords { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.UserID);
            e.Property(u => u.Username).IsRequired().HasMaxLength(100);
            e.Property(u => u.Email).IsRequired().HasMaxLength(150);
            e.Property(u => u.PasswordHash).IsRequired();
            e.Property(u => u.Role).IsRequired().HasMaxLength(50).HasDefaultValue("User");
            e.HasIndex(u => u.Username).IsUnique();
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Branch>(e =>
        {
            e.HasKey(b => b.BranchID);
            e.Property(b => b.Name).IsRequired().HasMaxLength(150);
        });

        modelBuilder.Entity<Company>(e =>
        {
            e.HasKey(c => c.CompanyID);
            e.Property(c => c.Name).IsRequired().HasMaxLength(150);
            e.HasOne(c => c.Branch)
             .WithMany(b => b.Companies)
             .HasForeignKey(c => c.BranchID)
             .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Contact>(e =>
        {
            e.HasKey(c => c.ContactID);
            e.Property(c => c.Name).IsRequired().HasMaxLength(150);
            e.HasOne(c => c.Company)
             .WithMany(co => co.Contacts)
             .HasForeignKey(c => c.CompanyID)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Equipmentcategory>(e =>
        {
            e.HasKey(ec => ec.CategoryID);
            e.Property(ec => ec.Name).IsRequired().HasMaxLength(150);
        });

        modelBuilder.Entity<Equipment>(e =>
        {
            e.HasKey(eq => eq.EquipmentID);
            e.Property(eq => eq.Name).IsRequired().HasMaxLength(150);
            e.HasOne(eq => eq.Company)
             .WithMany(c => c.Equipment)
             .HasForeignKey(eq => eq.CompanyID)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(eq => eq.Category)
             .WithMany(ec => ec.Equipment)
             .HasForeignKey(eq => eq.CategoryID)
             .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Note>(e =>
        {
            e.HasKey(n => n.NoteID);
            e.Property(n => n.NoteText).IsRequired();
            e.Property(n => n.RelatedRecordType).IsRequired().HasMaxLength(50);
            e.HasOne(n => n.User)
             .WithMany(u => u.Notes)
             .HasForeignKey(n => n.UserID)
             .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Task>(e =>
        {
            e.HasKey(t => t.TaskID);
            e.Property(t => t.Subject).IsRequired().HasMaxLength(150);
            e.Property(t => t.RelatedRecordType).IsRequired().HasMaxLength(50);
            e.HasOne(t => t.AssignedToUser)
             .WithMany(u => u.AssignedTasks)
             .HasForeignKey(t => t.AssignedToUserID)
             .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Lead>(e =>
        {
            e.HasKey(l => l.LeadID);
            e.Property(l => l.Status).IsRequired().HasMaxLength(50).HasDefaultValue("New");
            e.HasOne(l => l.Company)
             .WithMany(c => c.Leads)
             .HasForeignKey(l => l.CompanyID)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(l => l.Contact)
             .WithMany(c => c.Leads)
             .HasForeignKey(l => l.ContactID)
             .OnDelete(DeleteBehavior.SetNull);
            e.HasOne(l => l.CreatedByUser)
             .WithMany(u => u.CreatedLeads)
             .HasForeignKey(l => l.CreatedByUserID)
             .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Opportunity>(e =>
        {
            e.HasKey(o => o.OpportunityID);
            e.Property(o => o.Name).IsRequired().HasMaxLength(150);
            e.Property(o => o.Stage).IsRequired().HasMaxLength(50).HasDefaultValue("Discovery");
            e.Property(o => o.Status).IsRequired().HasMaxLength(50).HasDefaultValue("Open");
            e.Property(o => o.Value).HasColumnType("TEXT");
            e.HasOne(o => o.Company)
             .WithMany(c => c.Opportunities)
             .HasForeignKey(o => o.CompanyID)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(o => o.Contact)
             .WithMany(c => c.Opportunities)
             .HasForeignKey(o => o.ContactID)
             .OnDelete(DeleteBehavior.SetNull);
            e.HasOne(o => o.CreatedByUser)
             .WithMany(u => u.CreatedOpportunities)
             .HasForeignKey(o => o.CreatedByUserID)
             .OnDelete(DeleteBehavior.Restrict);
        });
    }
}