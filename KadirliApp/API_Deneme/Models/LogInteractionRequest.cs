namespace API_Deneme.Models
{
    public class LogInteractionRequest
    {
        public string ModuleName { get; set; } = string.Empty;
        public ActionType ActionType { get; set; }
        public Guid? TargetId { get; set; }
    }
}

