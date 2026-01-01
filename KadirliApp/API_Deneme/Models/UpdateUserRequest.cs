namespace API_Deneme.Models
{
    public class UpdateUserRequest
    {
        public string Username { get; set; } = string.Empty;
        public string? Password { get; set; } // Null olabilir (güncellemede boş bırakılabilir)
        public UserRole Role { get; set; }
    }
}

