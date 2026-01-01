using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API_Deneme.Data;
using API_Deneme.Models;

namespace API_Deneme.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PharmacyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PharmacyController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Pharmacy
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pharmacy>>> GetPharmacies()
        {
            return await _context.Pharmacies.ToListAsync();
        }

        // GET: api/Pharmacy/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Pharmacy>> GetPharmacy(Guid id)
        {
            var pharmacy = await _context.Pharmacies.FindAsync(id);

            if (pharmacy == null)
            {
                return NotFound();
            }

            return pharmacy;
        }

        // GET: api/Pharmacy/duty/{date}
        [HttpGet("duty/{date}")]
        public async Task<ActionResult<IEnumerable<Pharmacy>>> GetDutyPharmacies(string date)
        {
            var pharmacies = await _context.Pharmacies
                .Where(p => p.DutyDate == date)
                .ToListAsync();

            return pharmacies;
        }

        // POST: api/Pharmacy
        [HttpPost]
        public async Task<ActionResult<Pharmacy>> PostPharmacy(Pharmacy pharmacy)
        {
            pharmacy.Id = Guid.NewGuid();
            _context.Pharmacies.Add(pharmacy);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPharmacy), new { id = pharmacy.Id }, pharmacy);
        }

        // PUT: api/Pharmacy/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPharmacy(Guid id, Pharmacy pharmacy)
        {
            if (id != pharmacy.Id)
            {
                return BadRequest();
            }

            _context.Entry(pharmacy).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PharmacyExists(id))
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

        // DELETE: api/Pharmacy/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePharmacy(Guid id)
        {
            var pharmacy = await _context.Pharmacies.FindAsync(id);
            if (pharmacy == null)
            {
                return NotFound();
            }

            _context.Pharmacies.Remove(pharmacy);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PharmacyExists(Guid id)
        {
            return _context.Pharmacies.Any(e => e.Id == id);
        }
    }
}

