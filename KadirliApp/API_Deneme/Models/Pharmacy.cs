using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_Deneme.Models
{
    public class Pharmacy
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string? Phone { get; set; }
        
        [MaxLength(500)]
        public string? Address { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Region { get; set; } = string.Empty;
        
        public double? Latitude { get; set; }
        
        public double? Longitude { get; set; }
        
        [Required]
        [Column("duty_date")]
        [MaxLength(10)]
        public string DutyDate { get; set; } = string.Empty; // YYYY-MM-DD formatında
    }
}

