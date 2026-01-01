using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API_Deneme.Data;
using API_Deneme.Models;
using System.Security.Cryptography;
using System.Text;

namespace API_Deneme.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Auth/Login
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == request.Username);

                if (user == null)
                {
                    return Unauthorized(new { message = "Kullanıcı adı veya şifre hatalı" });
                }

                // Basit şifre kontrolü (production'da bcrypt veya benzeri kullanılmalı)
                var passwordHash = HashPassword(request.Password);
                if (user.PasswordHash != passwordHash)
                {
                    return Unauthorized(new { message = "Kullanıcı adı veya şifre hatalı" });
                }

                // Basit token oluştur (production'da JWT kullanılmalı)
                var token = Guid.NewGuid().ToString();

                var response = new LoginResponse
                {
                    Id = user.Id,
                    Username = user.Username,
                    Role = user.Role,
                    Token = token
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Sunucu hatası: " + ex.Message });
            }
        }

        // GET: api/Auth/Users (Sadece Admin)
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Role,
                    u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        // POST: api/Auth/Register (Sadece Admin)
        [HttpPost("register")]
        public async Task<ActionResult<object>> Register(CreateUserRequest request)
        {
            // Kullanıcı adı kontrolü
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest(new { message = "Bu kullanıcı adı zaten kullanılıyor" });
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = request.Username,
                PasswordHash = HashPassword(request.Password),
                Role = request.Role,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Role,
                user.CreatedAt
            });
        }

        // DELETE: api/Auth/Users/{id} (Sadece Admin)
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Auth/Users/{id} (Sadece Admin)
        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, UpdateUserRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Kullanıcı adı değiştiyse ve başka bir kullanıcı tarafından kullanılıyorsa
            if (user.Username != request.Username && 
                await _context.Users.AnyAsync(u => u.Username == request.Username && u.Id != id))
            {
                return BadRequest(new { message = "Bu kullanıcı adı zaten kullanılıyor" });
            }

            user.Username = request.Username;
            // Şifre sadece null değilse ve boş değilse güncelle
            if (!string.IsNullOrEmpty(request.Password))
            {
                user.PasswordHash = HashPassword(request.Password);
            }
            user.Role = request.Role;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }
}

