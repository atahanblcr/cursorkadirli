namespace API_Deneme.Models
{
    public class LoginResponse
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public string Token { get; set; } = string.Empty; // Basit token, production'da JWT kullanılmalı
    }
}

