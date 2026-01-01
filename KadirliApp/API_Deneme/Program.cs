using Microsoft.EntityFrameworkCore;
using API_Deneme.Data;
using API_Deneme.Models;
using Microsoft.EntityFrameworkCore.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// SQLite Configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Data Source=kadirli.db";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));

// CORS Configuration (iOS app için gerekli)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

// Database Migration (Development için otomatik)
// Her başlangıçta veritabanını silip yeniden oluştur
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        
        // Mevcut veritabanını sil
        await context.Database.EnsureDeletedAsync();
        
        // Veritabanını yeniden oluştur
        await context.Database.EnsureCreatedAsync();
        
        // İlk admin kullanıcısını oluştur
        var adminId = Guid.NewGuid();
        var adminPassword = "admin123"; // Varsayılan şifre - production'da değiştirilmeli
        
        using (var sha256 = System.Security.Cryptography.SHA256.Create())
        {
            var hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(adminPassword));
            var passwordHash = Convert.ToBase64String(hashedBytes);
            
            var adminUser = new API_Deneme.Models.User
            {
                Id = adminId,
                Username = "admin",
                PasswordHash = passwordHash,
                Role = API_Deneme.Models.UserRole.Admin,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = null
            };
            
            context.Users.Add(adminUser);
            await context.SaveChangesAsync();
        }

        // Örnek kampanyalar oluştur (TopCampaigns grafiği için)
        var sampleCampaigns = new List<Campaign>();
        for (int i = 1; i <= 5; i++)
        {
            sampleCampaigns.Add(new Campaign
            {
                Id = Guid.NewGuid(),
                Title = $"Örnek Kampanya {i}",
                BusinessName = $"İşletme {i}",
                Description = $"Bu örnek kampanya {i} açıklamasıdır.",
                DiscountCode = i % 2 == 0 ? $"INDIRIM{i}" : null,
                CreatedAt = DateTime.UtcNow.AddDays(-i * 2)
            });
        }
        context.Campaigns.AddRange(sampleCampaigns);
        await context.SaveChangesAsync();

        // Seed örnek etkileşim verileri
        var random = new Random();
        var modules = new[] { "News", "Pharmacy", "Campaigns", "Events", "Places", "Ads", "DeathNotice" };
        var actionTypes = Enum.GetValues<ActionType>();
        var interactions = new List<UserInteraction>();

        // Son 7 gün için rastgele etkileşimler oluştur (80 adet)
        for (int i = 0; i < 80; i++)
        {
            var daysAgo = random.Next(0, 7);
            var hoursAgo = random.Next(0, 24);
            var minutesAgo = random.Next(0, 60);
            var createdAt = DateTime.UtcNow.AddDays(-daysAgo).AddHours(-hoursAgo).AddMinutes(-minutesAgo);

            var moduleName = modules[random.Next(modules.Length)];
            var actionType = actionTypes[random.Next(actionTypes.Length)];

            // TargetId'yi sadece ClickDetail ve Like için rastgele ID olarak ayarla
            Guid? targetId = null;
            if (actionType == ActionType.ClickDetail || actionType == ActionType.Like)
            {
                targetId = Guid.NewGuid();
            }

            interactions.Add(new UserInteraction
            {
                Id = Guid.NewGuid(),
                ModuleName = moduleName,
                ActionType = actionType,
                TargetId = targetId,
                CreatedAt = createdAt
            });
        }

        // Kampanyalara özel etkileşimler ekle (TopCampaigns için - 20 adet)
        var campaignIds = sampleCampaigns.Select(c => c.Id).ToList();
        for (int i = 0; i < 20; i++)
        {
            var campaignId = campaignIds[random.Next(campaignIds.Count)];
            var daysAgo = random.Next(0, 7);
            var hoursAgo = random.Next(0, 24);
            var createdAt = DateTime.UtcNow.AddDays(-daysAgo).AddHours(-hoursAgo);

            interactions.Add(new UserInteraction
            {
                Id = Guid.NewGuid(),
                ModuleName = "Campaigns",
                ActionType = random.Next(2) == 0 ? ActionType.ClickDetail : ActionType.Like,
                TargetId = campaignId,
                CreatedAt = createdAt
            });
        }

        context.UserInteractions.AddRange(interactions);
        await context.SaveChangesAsync();
        
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Veritabanı başarıyla oluşturuldu ve seed data eklendi.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred creating the DB.");
    }
}

app.Run();

