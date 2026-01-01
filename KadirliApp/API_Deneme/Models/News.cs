using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_Deneme.Models
{
    public class News
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        public string? Summary { get; set; }
        
        [Column(TypeName = "TEXT")]
        public string? ImageUrls { get; set; } // JSON array olarak saklanacak
        
        [MaxLength(200)]
        public string? Source { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;
        
        [Column("is_published")]
        public bool IsPublished { get; set; }
        
        [Column("view_count")]
        public int ViewCount { get; set; }
        
        [Column("published_at")]
        public DateTime? PublishedAt { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}

