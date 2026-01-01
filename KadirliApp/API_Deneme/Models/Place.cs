using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_Deneme.Models
{
    public class Place
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Column("distance_text")]
        [MaxLength(100)]
        public string? DistanceText { get; set; }
        
        [Column("distance_km")]
        public double? DistanceKm { get; set; }
        
        public double? Latitude { get; set; }
        
        public double? Longitude { get; set; }
        
        [Column("image_urls", TypeName = "TEXT")]
        public string? ImageUrls { get; set; } // JSON array olarak saklanacak
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}

