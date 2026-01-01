using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_Deneme.Models
{
    public class DeathNotice
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [Column("first_name")]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [Column("last_name")]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [Column("death_date")]
        [MaxLength(10)]
        public string DeathDate { get; set; } = string.Empty; // YYYY-MM-DD formatında
        
        [Column("burial_place")]
        [MaxLength(200)]
        public string? BurialPlace { get; set; }
        
        [Column("burial_time")]
        [MaxLength(8)]
        public string? BurialTime { get; set; } // HH:mm:ss formatında
        
        [Column("condolence_address")]
        [MaxLength(500)]
        public string? CondolenceAddress { get; set; }
        
        public double? Latitude { get; set; }
        
        public double? Longitude { get; set; }
        
        [Column("image_url")]
        [MaxLength(500)]
        public string? ImageUrl { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
        
        [NotMapped]
        public string FullName => $"{FirstName} {LastName}";
    }
}

