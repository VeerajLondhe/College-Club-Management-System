using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Student_Service_.DTO;
using Student_Service_.Models;

namespace Student_Service_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClubController : ControllerBase
    {
        private readonly CcmsContext _context;
        public ClubController(CcmsContext dbContext)
        {
            this._context = dbContext;
        }


        [HttpGet("user/joined/{userId}")]
        public async Task<ActionResult<IEnumerable<ClubViewDto>>> GetUserJoinedClubs(int userId)
        {
            
            var userExists = await _context.Users.AnyAsync(u => u.UId == userId);
            if (!userExists)
            {
                return NotFound($"User with ID {userId} not found.");
            }

           
            var joinedClubs = await _context.ClubMembers
                .Where(cm => cm.UId == userId && cm.ReqStatus == true) 
                .Include(cm => cm.CIdNavigation) 
                .Select(cm => cm.CIdNavigation) 
                .Select(c => new ClubViewDto 
                {
                    CId = c.CId,
                    Clubname = c.Clubname,
                    Description = c.Description,
                    Creationdate = c.Creationdate,
                    Status = c.Status,
                    CreatedByUId = c.UId.Value
                })
                .ToListAsync();

            if (!joinedClubs.Any())
            {
                return Ok(new List<ClubViewDto>());
            }

            return Ok(joinedClubs);
        }

        //Available clubs----------------------------------------------------------------------------------
        [HttpGet("available/{userId}")]
        public async Task<ActionResult<IEnumerable<NonJoinedClubDto>>> GetNonJoinedClubs(int userId)
        {
            var joinedOrPendingClubIds = await _context.ClubMembers
                .Where(cm => cm.UId == userId)
                .Select(cm => cm.CId)
                .ToListAsync();

            var availableClubs = await _context.Clubs
                .Where(c => !joinedOrPendingClubIds.Contains(c.CId) && c.Status == true)
                .Select(c => new NonJoinedClubDto
                {
                    CId = c.CId,
                    Clubname = c.Clubname,
                    Description = c.Description
                })
                .ToListAsync();

            return Ok(availableClubs);
        }

        
    }
}
