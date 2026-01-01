using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_Deneme.Models
{
    public class Campaign
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [Column("business_name")]
        [MaxLength(200)]
        public string BusinessName { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Column("discount_code")]
        [MaxLength(50)]
        public string? DiscountCode { get; set; }
        
        [Column("image_urls", TypeName = "TEXT")]
        public string? ImageUrls { get; set; } // JSON array olarak saklanacak
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}

