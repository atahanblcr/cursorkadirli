using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API_Deneme.Models
{
    public class UserInteraction
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [Column("module_name")]
        [MaxLength(50)]
        public string ModuleName { get; set; } = string.Empty;
        
        [Required]
        [Column("action_type")]
        public ActionType ActionType { get; set; }
        
        [Column("target_id")]
        public Guid? TargetId { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}

