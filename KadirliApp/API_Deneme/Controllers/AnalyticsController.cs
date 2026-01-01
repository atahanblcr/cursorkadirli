using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API_Deneme.Data;
using API_Deneme.Models;

namespace API_Deneme.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AnalyticsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Analytics/log
        [HttpPost("log")]
        public async Task<IActionResult> LogInteraction(LogInteractionRequest request)
        {
            var interaction = new UserInteraction
            {
                Id = Guid.NewGuid(),
                ModuleName = request.ModuleName,
                ActionType = request.ActionType,
                TargetId = request.TargetId,
                CreatedAt = DateTime.UtcNow
            };

            _context.UserInteractions.Add(interaction);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Interaction logged successfully" });
        }

        // GET: api/Analytics/dashboard-stats
        [HttpGet("dashboard-stats")]
        public async Task<ActionResult<DashboardStatsResponse>> GetDashboardStats()
        {
            var now = DateTime.UtcNow;
            var today = now.Date;
            var last7Days = today.AddDays(-7);

            // Toplam etkileşim
            var totalInteractions = await _context.UserInteractions.CountAsync();

            // Bugünkü etkileşimler
            var todayInteractions = await _context.UserInteractions
                .CountAsync(i => i.CreatedAt >= today);

            // Son 7 gündeki etkileşimler
            var last7DaysInteractions = await _context.UserInteractions
                .CountAsync(i => i.CreatedAt >= last7Days);

            // Modül kullanım istatistikleri
            var moduleUsage = await _context.UserInteractions
                .Where(i => i.CreatedAt >= last7Days)
                .GroupBy(i => i.ModuleName)
                .Select(g => new ModuleUsageStats
                {
                    ModuleName = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(m => m.Count)
                .ToListAsync();

            var totalModuleInteractions = moduleUsage.Sum(m => m.Count);
            foreach (var module in moduleUsage)
            {
                module.Percentage = totalModuleInteractions > 0 
                    ? Math.Round((double)module.Count / totalModuleInteractions * 100, 2) 
                    : 0;
            }

            // En popüler kampanyalar (Son 7 gün, sadece ClickDetail ve Like action'ları)
            var topCampaigns = await _context.UserInteractions
                .Where(i => i.ModuleName == "Campaigns" 
                    && i.CreatedAt >= last7Days
                    && i.TargetId.HasValue
                    && (i.ActionType == ActionType.ClickDetail || i.ActionType == ActionType.Like))
                .GroupBy(i => i.TargetId)
                .Select(g => new
                {
                    CampaignId = g.Key!.Value,
                    Count = g.Count()
                })
                .OrderByDescending(x => x.Count)
                .Take(5)
                .ToListAsync();

            var campaignIds = topCampaigns.Select(tc => tc.CampaignId).ToList();
            var campaigns = await _context.Campaigns
                .Where(c => campaignIds.Contains(c.Id))
                .ToListAsync();

            var topCampaignsStats = topCampaigns.Select(tc =>
            {
                var campaign = campaigns.FirstOrDefault(c => c.Id == tc.CampaignId);
                return new TopCampaignStats
                {
                    CampaignId = tc.CampaignId,
                    CampaignTitle = campaign?.Title ?? "Bilinmeyen Kampanya",
                    InteractionCount = tc.Count
                };
            }).OrderByDescending(tc => tc.InteractionCount).ToList();

            // Son 7 günlük günlük istatistikler
            var dailyStats = new List<DailyInteractionStats>();
            for (int i = 6; i >= 0; i--)
            {
                var date = today.AddDays(-i);
                var nextDate = date.AddDays(1);
                var count = await _context.UserInteractions
                    .CountAsync(ui => ui.CreatedAt >= date && ui.CreatedAt < nextDate);
                
                dailyStats.Add(new DailyInteractionStats
                {
                    Date = date.ToString("yyyy-MM-dd"),
                    Count = count
                });
            }

            var response = new DashboardStatsResponse
            {
                TotalInteractions = totalInteractions,
                TodayInteractions = todayInteractions,
                Last7DaysInteractions = last7DaysInteractions,
                ModuleUsage = moduleUsage,
                TopCampaigns = topCampaignsStats,
                Last7DaysStats = dailyStats
            };

            return Ok(response);
        }
    }
}

