namespace API_Deneme.Models
{
    public class DashboardStatsResponse
    {
        public int TotalInteractions { get; set; }
        public int TodayInteractions { get; set; }
        public int Last7DaysInteractions { get; set; }
        public List<ModuleUsageStats> ModuleUsage { get; set; } = new();
        public List<TopCampaignStats> TopCampaigns { get; set; } = new();
        public List<DailyInteractionStats> Last7DaysStats { get; set; } = new();
    }

    public class ModuleUsageStats
    {
        public string ModuleName { get; set; } = string.Empty;
        public int Count { get; set; }
        public double Percentage { get; set; }
    }

    public class TopCampaignStats
    {
        public Guid CampaignId { get; set; }
        public string CampaignTitle { get; set; } = string.Empty;
        public int InteractionCount { get; set; }
    }

    public class DailyInteractionStats
    {
        public string Date { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}

