using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API_Deneme.Data;
using API_Deneme.Models;

namespace API_Deneme.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeathNoticeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DeathNoticeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/DeathNotice
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeathNotice>>> GetDeathNotices()
        {
            return await _context.DeathNotices
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();
        }

        // GET: api/DeathNotice/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DeathNotice>> GetDeathNotice(Guid id)
        {
            var deathNotice = await _context.DeathNotices.FindAsync(id);

            if (deathNotice == null)
            {
                return NotFound();
            }

            return deathNotice;
        }

        // POST: api/DeathNotice
        [HttpPost]
        public async Task<ActionResult<DeathNotice>> PostDeathNotice(DeathNotice deathNotice)
        {
            deathNotice.Id = Guid.NewGuid();
            deathNotice.CreatedAt = DateTime.UtcNow;
            _context.DeathNotices.Add(deathNotice);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDeathNotice), new { id = deathNotice.Id }, deathNotice);
        }

        // PUT: api/DeathNotice/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeathNotice(Guid id, DeathNotice deathNotice)
        {
            if (id != deathNotice.Id)
            {
                return BadRequest();
            }

            _context.Entry(deathNotice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeathNoticeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/DeathNotice/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeathNotice(Guid id)
        {
            var deathNotice = await _context.DeathNotices.FindAsync(id);
            if (deathNotice == null)
            {
                return NotFound();
            }

            _context.DeathNotices.Remove(deathNotice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DeathNoticeExists(Guid id)
        {
            return _context.DeathNotices.Any(e => e.Id == id);
        }
    }
}

