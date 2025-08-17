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
        [HttpDelete("leave")]
        public async Task<IActionResult> LeaveClub([FromBody] LeaveClubDto leaveDto)
        {
            var membership = await _context.ClubMembers
                .Include(cm => cm.CIdNavigation) 
                .FirstOrDefaultAsync(cm => cm.UId == leaveDto.UserId && cm.CId == leaveDto.ClubId);

            if (membership == null)
            {
                return NotFound("You are not a member of this club.");
            }
            if (membership.CIdNavigation?.UId == leaveDto.UserId)
            {
                return BadRequest("As the club head, you cannot leave your own club. Please delete the club or transfer ownership.");
            }
            _context.ClubMembers.Remove(membership);
            await _context.SaveChangesAsync();

            return Ok("You have successfully left the club.");
        }

        [HttpGet("{clubId}/is-member/{userId}")]
        public async Task<IActionResult> IsUserMemberOfClub(int clubId, int userId)
        {
            var isMember = await _context.ClubMembers
                .AnyAsync(cm => cm.CId == clubId && cm.UId == userId && cm.ReqStatus == true);

            return Ok(new { isMember = isMember });
        }

        [HttpGet("user/{userId}/memberships")]
        public async Task<IActionResult> GetUserClubMemberships(int userId)
        {
            var memberships = await _context.ClubMembers
                .Where(cm => cm.UId == userId && cm.ReqStatus == true)
                .Select(cm => new { clubId = cm.CId, position = cm.Position })
                .ToListAsync();

            return Ok(memberships);
        }


    }
}
