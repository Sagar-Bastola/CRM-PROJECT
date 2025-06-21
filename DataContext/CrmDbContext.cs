using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using crm.Entities;

namespace crm.DataContext;

public partial class CrmDbContext : DbContext
{
    public CrmDbContext()
    {
    }

    public CrmDbContext(DbContextOptions<CrmDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Branch> Branches { get; set; }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<Contact> Contacts { get; set; }

    public virtual DbSet<Equipment> Equipment { get; set; }

    public virtual DbSet<Equipmentcategory> Equipmentcategories { get; set; }

    public virtual DbSet<Lead> Leads { get; set; }

    public virtual DbSet<Note> Notes { get; set; }

    public virtual DbSet<Opportunity> Opportunities { get; set; }

    public virtual DbSet<Entities.Task> Tasks { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Branch>(entity =>
        {
            entity.HasKey(e => e.BranchId).HasName("PK__branches__A1682FA5ACD3D032");

            entity.ToTable("branches");

            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.Name).HasMaxLength(150);
        });

        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasKey(e => e.CompanyId).HasName("PK__companie__2D971C4C11240EAA");

            entity.ToTable("companies");

            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.Address1).HasMaxLength(150);
            entity.Property(e => e.Address2).HasMaxLength(150);
            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.Country).HasMaxLength(100);
            entity.Property(e => e.County).HasMaxLength(100);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Deleted).HasDefaultValue(false);
            entity.Property(e => e.LastModified).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.State).HasMaxLength(100);
            entity.Property(e => e.Website).HasMaxLength(150);
            entity.Property(e => e.Zip).HasMaxLength(20);

            entity.HasOne(d => d.Branch).WithMany(p => p.Companies)
                .HasForeignKey(d => d.BranchId)
                .HasConstraintName("FK_Companies_Branch");
        });

        modelBuilder.Entity<Contact>(entity =>
        {
            entity.HasKey(e => e.ContactId).HasName("PK__contacts__5C6625BB9F81EFEC");

            entity.ToTable("contacts");

            entity.Property(e => e.ContactId).HasColumnName("ContactID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Deleted).HasDefaultValue(false);
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.LastModified).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.Position).HasMaxLength(100);

            entity.HasOne(d => d.Company).WithMany(p => p.Contacts)
                .HasForeignKey(d => d.CompanyId)
                .HasConstraintName("FK_Contacts_Company");
        });

        modelBuilder.Entity<Equipment>(entity =>
        {
            entity.HasKey(e => e.EquipmentId).HasName("PK__equipmen__344745996AEC6B21");

            entity.ToTable("equipment");

            entity.Property(e => e.EquipmentId).HasColumnName("EquipmentID");
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Deleted).HasDefaultValue(false);
            entity.Property(e => e.LastModified).HasColumnType("datetime");
            entity.Property(e => e.LastServiceDate).HasColumnType("datetime");
            entity.Property(e => e.Model).HasMaxLength(100);
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.SerialNumber).HasMaxLength(100);

            entity.HasOne(d => d.Category).WithMany(p => p.Equipment)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("FK_Equipment_Category");

            entity.HasOne(d => d.Company).WithMany(p => p.Equipment)
                .HasForeignKey(d => d.CompanyId)
                .HasConstraintName("FK_Equipment_Company");
        });

        modelBuilder.Entity<Equipmentcategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__equipmen__19093A2BEDE0A23F");

            entity.ToTable("equipmentcategories");

            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.Name).HasMaxLength(150);
        });

        modelBuilder.Entity<Lead>(entity =>
        {
            entity.HasKey(e => e.LeadId).HasName("PK__leads__73EF791AA7850A7D");

            entity.ToTable("leads");

            entity.Property(e => e.LeadId).HasColumnName("LeadID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.ContactId).HasColumnName("ContactID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedByUserId).HasColumnName("CreatedByUserID");
            entity.Property(e => e.Deleted).HasDefaultValue(false);
            entity.Property(e => e.LastModified).HasColumnType("datetime");
            entity.Property(e => e.Source).HasMaxLength(100);
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.Company).WithMany(p => p.Leads)
                .HasForeignKey(d => d.CompanyId)
                .HasConstraintName("FK_Leads_Company");

            entity.HasOne(d => d.Contact).WithMany(p => p.Leads)
                .HasForeignKey(d => d.ContactId)
                .HasConstraintName("FK_Leads_Contact");

            entity.HasOne(d => d.CreatedByUser).WithMany(p => p.Leads)
                .HasForeignKey(d => d.CreatedByUserId)
                .HasConstraintName("FK_Leads_User");
        });

        modelBuilder.Entity<Note>(entity =>
        {
            entity.HasKey(e => e.NoteId).HasName("PK__notes__EACE357F2A073F48");

            entity.ToTable("notes");

            entity.Property(e => e.NoteId).HasColumnName("NoteID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Deleted).HasDefaultValue(false);
            entity.Property(e => e.LastModified).HasColumnType("datetime");
            entity.Property(e => e.RelatedRecordId).HasColumnName("RelatedRecordID");
            entity.Property(e => e.RelatedRecordType).HasMaxLength(50);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Notes)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Notes_User");
        });

        modelBuilder.Entity<Opportunity>(entity =>
        {
            entity.HasKey(e => e.OpportunityId).HasName("PK__opportun__0034EDB182530869");

            entity.ToTable("opportunities");

            entity.Property(e => e.OpportunityId).HasColumnName("OpportunityID");
            entity.Property(e => e.CloseDate).HasColumnType("datetime");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.ContactId).HasColumnName("ContactID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedByUserId).HasColumnName("CreatedByUserID");
            entity.Property(e => e.Deleted).HasDefaultValue(false);
            entity.Property(e => e.LastModified).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Stage).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.Value).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Company).WithMany(p => p.Opportunities)
                .HasForeignKey(d => d.CompanyId)
                .HasConstraintName("FK_Opportunities_Company");

            entity.HasOne(d => d.Contact).WithMany(p => p.Opportunities)
                .HasForeignKey(d => d.ContactId)
                .HasConstraintName("FK_Opportunities_Contact");

            entity.HasOne(d => d.CreatedByUser).WithMany(p => p.Opportunities)
                .HasForeignKey(d => d.CreatedByUserId)
                .HasConstraintName("FK_Opportunities_User");
        });

        modelBuilder.Entity<Entities.Task>(entity =>
        {
            entity.HasKey(e => e.TaskId).HasName("PK__tasks__7C6949D13D9CBF4A");

            entity.ToTable("tasks");

            entity.Property(e => e.TaskId).HasColumnName("TaskID");
            entity.Property(e => e.AssignedToUserId).HasColumnName("AssignedToUserID");
            entity.Property(e => e.CompletedDate).HasColumnType("datetime");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Deleted).HasDefaultValue(false);
            entity.Property(e => e.DueDate).HasColumnType("datetime");
            entity.Property(e => e.IsCompleted).HasDefaultValue(false);
            entity.Property(e => e.LastModified).HasColumnType("datetime");
            entity.Property(e => e.RelatedRecordId).HasColumnName("RelatedRecordID");
            entity.Property(e => e.RelatedRecordType).HasMaxLength(50);
            entity.Property(e => e.Subject).HasMaxLength(150);

            entity.HasOne(d => d.AssignedToUser).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.AssignedToUserId)
                .HasConstraintName("FK_Tasks_AssignedTo");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__users__1788CCAC1B8A25F3");

            entity.ToTable("users");

            entity.HasIndex(e => e.Username, "UQ__users__536C85E4C0316AE4").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__users__A9D105341ADFC214").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Deleted).HasDefaultValue(false);
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.LastModified).HasColumnType("datetime");
            entity.Property(e => e.Role).HasMaxLength(50);
            entity.Property(e => e.Username).HasMaxLength(100);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
