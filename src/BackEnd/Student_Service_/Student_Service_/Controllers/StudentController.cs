using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Student_Service_.DTO;
using Student_Service_.Models;
using System.Linq;

using System.Security.Claims;
using System.Text;

namespace Student_Service_.Controllers
{   //localhost:8080/api/Student
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly CcmsContext _context;
        public StudentController(CcmsContext dbContext)
        {
            this._context = dbContext;
        }

        [HttpGet]
        public IActionResult GetAllClubs()
        {
            var allClubs=_context.Clubs.ToList();

            return Ok(allClubs);
        }


        //---------------------------------------------------------------------------------------------------
        [HttpPost("request")]
        public async Task<IActionResult> RequestClubCreation(ClubCreationRequestDto requestDto)
        {
            var user = await _context.Users.FindAsync(requestDto.RequestingUId);
            if (user == null)
            {
                return BadRequest("Invalid user ID.");
            }

            var existingClub = await _context.Clubs
                .FirstOrDefaultAsync(c => c.UId == requestDto.RequestingUId);

            if (existingClub != null)
            {
                if (existingClub.Status == false)
                {
                    return BadRequest("You already have a pending club creation request. Please wait for an admin to approve it.");
                }
                else
                {
                    return BadRequest("You have already created an approved club and cannot create another.");
                }
            }

            var newClubRequest = new Club
            {
                Clubname = requestDto.Clubname,
                Description = requestDto.Description,
                Creationdate = DateOnly.FromDateTime(DateTime.Now),
                Status = false, 
                UId = requestDto.RequestingUId
            };

            _context.Clubs.Add(newClubRequest);
            await _context.SaveChangesAsync();

            return StatusCode(201, "Club creation request submitted successfully and is pending approval.");
        }

        
        [HttpPost("join")]
        public async Task<IActionResult> SendJoinRequest(ClubJoinRequestDto joinRequest)
        {
            var user = await _context.Users.FindAsync(joinRequest.UId);
            var club = await _context.Clubs.FindAsync(joinRequest.CId);
            if (user == null || club == null)
            {
                return NotFound("User or Club not found.");
            }

            //
            if (club.Status == false)
            {
                return BadRequest("This club is not currently active and cannot be joined.");
            }

            var isClubHead = await _context.ClubMembers
                .AnyAsync(cm => cm.UId == joinRequest.UId && cm.Position == "club_head" && cm.ReqStatus == true);

            if (isClubHead)
            {
                return BadRequest("As a Club Head, you are not permitted to join other clubs.");
            }

            var existingRequest = await _context.ClubMembers
                .FirstOrDefaultAsync(cm => cm.UId == joinRequest.UId && cm.CId == joinRequest.CId);

            if (existingRequest != null)
            {
                return BadRequest("You have already sent a join request to this club.");
            }

            var newMemberRequest = new ClubMember
            {
                UId = joinRequest.UId,
                CId = joinRequest.CId,
                Position = "club_member",
                ReqStatus = false 
            };

            _context.ClubMembers.Add(newMemberRequest);
            await _context.SaveChangesAsync();

            return StatusCode(201, "Your request to join the club has been sent and is pending approval.");
        }

        //-----------------------------------------------------------------------------------------------------
        [HttpGet("requests/{headUserId}")]
        public async Task<ActionResult<IEnumerable<ClubJoinRequestViewDto>>> GetPendingJoinRequests(int headUserId)
        {
        var ownedClub = await _context.Clubs
            .FirstOrDefaultAsync(c => c.UId == headUserId && c.Status == true);

        if (ownedClub == null)
        {
            return NotFound("You are not the head of any active club.");
        }
        var pendingRequests = await _context.ClubMembers
            .Where(cm => cm.CId == ownedClub.CId && cm.ReqStatus == false)
            .Include(cm => cm.UIdNavigation)
            .Select(cm => new ClubJoinRequestViewDto
            {
                ClubMemberId = cm.CmId,
                RequestingUserId = cm.UId.Value,
                RequestingUsername = cm.UIdNavigation.Uname
            })
            .ToListAsync();

        return Ok(pendingRequests);
    }

        //------------------------------------------------------------------------------------------------------------

        [HttpPut("approve")]
        public async Task<IActionResult> ApproveJoinRequest([FromBody] ApproveJoinRequestDto approveDto)
        {
            var joinRequest = await _context.ClubMembers
                .Include(cm => cm.CIdNavigation)
                .FirstOrDefaultAsync(cm => cm.CmId == approveDto.ClubMemberId);

          
            if (joinRequest == null)
            {
                return NotFound("Join request not found.");
            }

            if (joinRequest.ReqStatus == true)
            {
                return BadRequest("This request has already been approved.");
            }
            if (joinRequest.CIdNavigation?.UId != approveDto.HeadUserId)
            {
                return Forbid("You are not authorized to approve requests for this club.");
            }
            joinRequest.ReqStatus = true;

            await _context.SaveChangesAsync();

            return Ok("Join request approved successfully.");
        }

        [HttpGet("members/{headUserId}")]
        public async Task<ActionResult<IEnumerable<ClubMemberDto>>> GetClubMembers(int headUserId)
        {
            var ownedClub = await _context.Clubs
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.UId == headUserId && c.Status == true);

            if (ownedClub == null)
            {
                return NotFound("You are not the head of any active club.");
            }
            var members = await _context.ClubMembers
                .Where(cm => cm.CId == ownedClub.CId && cm.ReqStatus == true)
                .Include(cm => cm.UIdNavigation) 
                .Select(cm => new ClubMemberDto
                {
                    UserId = cm.UId.Value,
                    Username = cm.UIdNavigation.Uname,
                    Position = cm.Position
                })
                .ToListAsync();

            return Ok(members);
        }
        //---------------------------------------------------------------------------------------------------------
        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveMember([FromBody] RemoveMemberDto removeDto)
        {
           
            var ownedClub = await _context.Clubs
                .AsNoTracking() 
                .FirstOrDefaultAsync(c => c.UId == removeDto.HeadUserId && c.Status == true);

            if (ownedClub == null)
            {
                return Forbid("You are not the head of any active club and cannot perform this action.");
            }

            if (removeDto.HeadUserId == removeDto.MemberToRemoveUserId)
            {
                return BadRequest("A club head cannot remove themselves from the club.");
            }

            var memberToRemove = await _context.ClubMembers
                .FirstOrDefaultAsync(cm => cm.CId == ownedClub.CId && cm.UId == removeDto.MemberToRemoveUserId);

            if (memberToRemove == null)
            {
                return NotFound("The specified user is not a member of this club.");
            }
            _context.ClubMembers.Remove(memberToRemove);
            await _context.SaveChangesAsync();


            return Ok("Club member removed successfully.");
        }

        [HttpGet("my-club/{headUserId}")]
        public async Task<ActionResult<ClubViewDto>> GetMyClub(int headUserId)
        {
            var ownedClub = await _context.Clubs
                .AsNoTracking() 
                .FirstOrDefaultAsync(c => c.UId == headUserId);

            if (ownedClub == null)
            {
                return NotFound("No club found for the specified head user.");
            }
            var clubDto = new ClubViewDto
            {
                CId = ownedClub.CId,
                Clubname = ownedClub.Clubname,
                Description = ownedClub.Description,
                Creationdate = ownedClub.Creationdate,
                Status = ownedClub.Status,
                CreatedByUId = ownedClub.UId.Value
            };
            return Ok(clubDto);
        }

        //[HttpPost]
        //public IActionResult sentRequest(ClubDto c)
        //{
        //    Club c1 = new Club()
        //    {
        //        Clubname = c.Clubname,
        //        Description = c.Description,
        //        Creationdate=c.Creationdate,
        //        Status = c.Status,  
        //        UId
        //    };

        //}

        

       
    }
}
