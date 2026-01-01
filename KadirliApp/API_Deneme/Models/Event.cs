using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_Deneme.Models
{
    public class Event
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        [Column("event_date")]
        public DateTime EventDate { get; set; }
        
        [Column("location_name")]
        [MaxLength(200)]
        public string? LocationName { get; set; }
        
        public double? Latitude { get; set; }
        
        public double? Longitude { get; set; }
        
        [Column("image_url")]
        [MaxLength(500)]
        public string? ImageUrl { get; set; }
        
        [Column("is_active")]
        public bool IsActive { get; set; }
    }
}

