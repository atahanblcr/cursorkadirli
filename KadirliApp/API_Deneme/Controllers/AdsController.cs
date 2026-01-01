using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API_Deneme.Data;
using API_Deneme.Models;

namespace API_Deneme.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Ads
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ad>>> GetAds()
        {
            return await _context.Ads
                .Where(a => a.IsActive)
                .ToListAsync();
        }

        // GET: api/Ads/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ad>> GetAd(Guid id)
        {
            var ad = await _context.Ads.FindAsync(id);

            if (ad == null)
            {
                return NotFound();
            }

            return ad;
        }

        // GET: api/Ads/type/{adType}
        [HttpGet("type/{adType}")]
        public async Task<ActionResult<IEnumerable<Ad>>> GetAdsByType(AdType adType)
        {
            var ads = await _context.Ads
                .Where(a => a.Type == adType && a.IsActive)
                .ToListAsync();

            return ads;
        }

        // POST: api/Ads
        [HttpPost]
        public async Task<ActionResult<Ad>> PostAd(Ad ad)
        {
            ad.Id = Guid.NewGuid();
            _context.Ads.Add(ad);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAd), new { id = ad.Id }, ad);
        }

        // PUT: api/Ads/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAd(Guid id, Ad ad)
        {
            if (id != ad.Id)
            {
                return BadRequest();
            }

            _context.Entry(ad).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AdExists(id))
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

        // DELETE: api/Ads/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAd(Guid id)
        {
            var ad = await _context.Ads.FindAsync(id);
            if (ad == null)
            {
                return NotFound();
            }

            _context.Ads.Remove(ad);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AdExists(Guid id)
        {
            return _context.Ads.Any(e => e.Id == id);
        }
    }
}

