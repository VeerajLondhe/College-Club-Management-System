using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Student_Service_.Models;

public partial class CcmsContext : DbContext
{
    public CcmsContext(DbContextOptions<CcmsContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Club> Clubs { get; set; }

    public virtual DbSet<ClubMember> ClubMembers { get; set; }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<EventTask> EventTasks { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Task> Tasks { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<EventRegistration> EventRegistrations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Club>(entity =>
        {
            entity.HasKey(e => e.CId).HasName("PRIMARY");

            entity.ToTable("club");

            entity.HasIndex(e => e.UId, "u_id");

            entity.Property(e => e.CId).HasColumnName("c_id");
            entity.Property(e => e.Clubname)
                .HasMaxLength(200)
                .HasColumnName("clubname");
            entity.Property(e => e.Creationdate).HasColumnName("creationdate");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .HasColumnName("description");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.UId).HasColumnName("u_id");

            entity.HasOne(d => d.UIdNavigation).WithMany(p => p.Clubs)
                .HasForeignKey(d => d.UId)
                .HasConstraintName("club_ibfk_1");
        });

        modelBuilder.Entity<ClubMember>(entity =>
        {
            entity.HasKey(e => e.CmId).HasName("PRIMARY");

            entity.ToTable("club_member");

            entity.HasIndex(e => e.CId, "c_id");

            entity.HasIndex(e => e.UId, "u_id");

            entity.Property(e => e.CmId).HasColumnName("cm_id");
            entity.Property(e => e.CId).HasColumnName("c_id");
            entity.Property(e => e.Position)
                .HasMaxLength(15)
                .HasColumnName("position");
            entity.Property(e => e.ReqStatus).HasColumnName("req_status");
            entity.Property(e => e.UId).HasColumnName("u_id");

            entity.HasOne(d => d.CIdNavigation).WithMany(p => p.ClubMembers)
                .HasForeignKey(d => d.CId)
                .HasConstraintName("club_member_ibfk_2");

            entity.HasOne(d => d.UIdNavigation).WithMany(p => p.ClubMembers)
                .HasForeignKey(d => d.UId)
                .HasConstraintName("club_member_ibfk_1");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.EId).HasName("PRIMARY");

            entity.ToTable("events");

            entity.HasIndex(e => e.CId, "c_id");

            entity.Property(e => e.EId).HasColumnName("e_id");
            entity.Property(e => e.Banner).HasColumnName("banner");
            entity.Property(e => e.CId).HasColumnName("c_id");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .HasColumnName("description");
            entity.Property(e => e.Status).HasColumnName("status");

            entity.HasOne(d => d.CIdNavigation).WithMany(p => p.Events)
                .HasForeignKey(d => d.CId)
                .HasConstraintName("events_ibfk_1");
        });

        modelBuilder.Entity<EventTask>(entity =>
        {
            entity.HasKey(e => e.EtId).HasName("PRIMARY");

            entity.ToTable("event_task");

            entity.HasIndex(e => e.EId, "e_id");

            entity.HasIndex(e => e.TId, "t_id");

            entity.HasIndex(e => e.UId, "u_id");

            entity.Property(e => e.EtId).HasColumnName("et_id");
            entity.Property(e => e.EId).HasColumnName("e_id");
            entity.Property(e => e.TId).HasColumnName("t_id");
            entity.Property(e => e.UId).HasColumnName("u_id");

            entity.HasOne(d => d.EIdNavigation).WithMany(p => p.EventTasks)
                .HasForeignKey(d => d.EId)
                .HasConstraintName("event_task_ibfk_2");

            entity.HasOne(d => d.TIdNavigation).WithMany(p => p.EventTasks)
                .HasForeignKey(d => d.TId)
                .HasConstraintName("event_task_ibfk_1");

            entity.HasOne(d => d.UIdNavigation).WithMany(p => p.EventTasks)
                .HasForeignKey(d => d.UId)
                .HasConstraintName("event_task_ibfk_3");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RId).HasName("PRIMARY");

            entity.ToTable("role");

            entity.Property(e => e.RId)
                .ValueGeneratedNever()
                .HasColumnName("r_id");
            entity.Property(e => e.RName)
                .HasMaxLength(255)
                .HasColumnName("r_name");
        });

        modelBuilder.Entity<Task>(entity =>
        {
            entity.HasKey(e => e.TId).HasName("PRIMARY");

            entity.ToTable("task");

            entity.Property(e => e.TId).HasColumnName("t_id");
            entity.Property(e => e.Description)
                .HasMaxLength(200)
                .HasColumnName("description");
            entity.Property(e => e.TaskName)
                .HasMaxLength(100)
                .HasColumnName("task_name");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UId).HasName("PRIMARY");

            entity.ToTable("user");

            entity.HasIndex(e => e.RId, "FK8lwi4plrarkg8sbkrphacf8it");

            entity.HasIndex(e => e.Email, "email_UNIQUE").IsUnique();

            entity.Property(e => e.UId).HasColumnName("u_id");
            entity.Property(e => e.DName)
                .HasMaxLength(255)
                .HasColumnName("d_name");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasColumnName("password");
            entity.Property(e => e.Phoneno)
                .HasMaxLength(255)
                .HasColumnName("phoneno");
            entity.Property(e => e.RId).HasColumnName("r_id");
            entity.Property(e => e.Uname)
                .HasMaxLength(255)
                .HasColumnName("uname");

            entity.HasOne(d => d.RIdNavigation).WithMany(p => p.Users)
                .HasForeignKey(d => d.RId)
                .HasConstraintName("FK8lwi4plrarkg8sbkrphacf8it");
        });

        modelBuilder.Entity<EventRegistration>(entity =>
        {
            entity.HasKey(e => e.ErId).HasName("PRIMARY");

            entity.ToTable("event_registration");

            entity.HasIndex(e => e.UId, "u_id");
            entity.HasIndex(e => e.EId, "e_id");
            entity.HasIndex(e => new { e.UId, e.EId }, "unique_user_event").IsUnique();

            entity.Property(e => e.ErId).HasColumnName("er_id");
            entity.Property(e => e.UId).HasColumnName("u_id");
            entity.Property(e => e.EId).HasColumnName("e_id");
            entity.Property(e => e.RegistrationDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("registration_date");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");

            entity.HasOne(d => d.UIdNavigation).WithMany()
                .HasForeignKey(d => d.UId)
                .HasConstraintName("event_registration_ibfk_1");

            entity.HasOne(d => d.EIdNavigation).WithMany()
                .HasForeignKey(d => d.EId)
                .HasConstraintName("event_registration_ibfk_2");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
