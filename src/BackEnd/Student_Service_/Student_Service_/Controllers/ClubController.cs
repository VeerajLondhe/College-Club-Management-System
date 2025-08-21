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
        // DELETE: api/ClubMembership/leave
        [HttpDelete("leave")]
        public async Task<IActionResult> LeaveClub([FromBody] LeaveClubDto leaveDto)
        {
            // 1. Find the specific membership record for the user in the specified club.
            var membership = await _context.ClubMembers
                .Include(cm => cm.CIdNavigation) // Include the Club to check who the head is
                .FirstOrDefaultAsync(cm => cm.UId == leaveDto.UserId && cm.CId == leaveDto.ClubId);

            if (membership == null)
            {
                return NotFound("You are not a member of this club.");
            }

            // 2. Business Rule: Prevent the club head from leaving their own club.
            // They would need to delete the club or transfer ownership instead.
            if (membership.CIdNavigation?.UId == leaveDto.UserId)
            {
                return BadRequest("As the club head, you cannot leave your own club. Please delete the club or transfer ownership.");
            }

            // 3. Remove the membership record from the database.
            _context.ClubMembers.Remove(membership);
            await _context.SaveChangesAsync();

            return Ok("You have successfully left the club.");
        }

        // New endpoint to check if user is a member of a specific club
        [HttpGet("{clubId}/is-member/{userId}")]
        public async Task<IActionResult> IsUserMemberOfClub(int clubId, int userId)
        {
            var isMember = await _context.ClubMembers
                .AnyAsync(cm => cm.CId == clubId && cm.UId == userId && cm.ReqStatus == true);

            return Ok(new { isMember = isMember });
        }

        // Get user's membership status for all clubs (for checking join/leave buttons)
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
