using Microsoft.EntityFrameworkCore;
using API_Deneme.Models;

namespace API_Deneme.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<News> News { get; set; }
        public DbSet<Pharmacy> Pharmacies { get; set; }
        public DbSet<DeathNotice> DeathNotices { get; set; }
        public DbSet<Ad> Ads { get; set; }
        public DbSet<Campaign> Campaigns { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Place> Places { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserInteraction> UserInteractions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // News configuration
            modelBuilder.Entity<News>(entity =>
            {
                entity.ToTable("news");
                entity.Property(e => e.Id).HasDefaultValueSql("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
            });

            // Pharmacy configuration
            modelBuilder.Entity<Pharmacy>(entity =>
            {
                entity.ToTable("pharmacies");
                entity.Property(e => e.Id).HasDefaultValueSql("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))");
            });

            // DeathNotice configuration
            modelBuilder.Entity<DeathNotice>(entity =>
            {
                entity.ToTable("death_notices");
                entity.Property(e => e.Id).HasDefaultValueSql("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
            });

            // Ad configuration
            modelBuilder.Entity<Ad>(entity =>
            {
                entity.ToTable("ads");
                entity.Property(e => e.Id).HasDefaultValueSql("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))");
            });

            // Campaign configuration
            modelBuilder.Entity<Campaign>(entity =>
            {
                entity.ToTable("campaigns");
                entity.Property(e => e.Id).HasDefaultValueSql("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
            });

            // Event configuration
            modelBuilder.Entity<Event>(entity =>
            {
                entity.ToTable("events");
                entity.Property(e => e.Id).HasDefaultValueSql("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))");
            });

            // Place configuration
            modelBuilder.Entity<Place>(entity =>
            {
                entity.ToTable("places");
                entity.Property(e => e.Id).HasDefaultValueSql("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
            });

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.Property(e => e.Id).HasDefaultValueSql("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
                entity.HasIndex(e => e.Username).IsUnique();
            });

            // UserInteraction configuration
            modelBuilder.Entity<UserInteraction>(entity =>
            {
                entity.ToTable("user_interactions");
                entity.Property(e => e.Id).HasDefaultValueSql("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
            });
        }
    }
}

