using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_Deneme.Models
{
    public class Ad
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        public AdType Type { get; set; }
        
        [Column("contact_info")]
        [MaxLength(200)]
        public string? ContactInfo { get; set; }
        
        [MaxLength(50)]
        public string? Price { get; set; }
        
        [Column("image_urls", TypeName = "TEXT")]
        public string? ImageUrls { get; set; } // JSON array olarak saklanacak
        
        [Column("expires_at")]
        public DateTime? ExpiresAt { get; set; }
        
        [Column("is_active")]
        public bool IsActive { get; set; }
    }
}

