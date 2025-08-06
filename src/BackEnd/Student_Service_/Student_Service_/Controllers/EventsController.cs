using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Student_Service_.EventsDTO;
using Student_Service_.Models;

namespace Student_Service_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly CcmsContext _context;
        public EventsController(CcmsContext dbContext)
        {
            this._context = dbContext;
        }

        [HttpPost("request")]
        public async Task<IActionResult> RequestEventCreation(
    [FromQuery] int headUserId,
    [FromForm] EventRequestSimpleDto requestDto)
        {
          
            var ownedClub = await _context.Clubs
                .FirstOrDefaultAsync(c => c.UId == headUserId && c.Status == true);

            if (ownedClub == null)
            {
                return Forbid("You are not the head of any active club, or your club is not approved.");
            }

            
            if (requestDto.BannerImage == null || requestDto.BannerImage.Length == 0)
            {
                return BadRequest("An event banner image is required.");
            }

            var newEvent = new Event
            {
                CId = ownedClub.CId,
                Description = requestDto.Description,
                Status = false 
            };

            using (var memoryStream = new MemoryStream())
            {
                await requestDto.BannerImage.CopyToAsync(memoryStream);
                newEvent.Banner = memoryStream.ToArray();
            }

            _context.Events.Add(newEvent);
          
            await _context.SaveChangesAsync();

           
            return StatusCode(201, "Event creation request has been submitted successfully and is pending approval.");
        }

        [HttpGet("my-club/approved/{headUserId}")]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetMyClubApprovedEvents(int headUserId)
        {
           
            var approvedEvents = await _context.Events
                .Where(e => e.Status == true && e.CIdNavigation.UId == headUserId && e.CIdNavigation.Status == true)
                .Select(e => new EventDto
                {
                    EventId = e.EId,
                    Description = e.Description,
                    ClubName = e.CIdNavigation.Clubname,
                    BannerBase64 = e.Banner != null ? $"data:image/jpeg;base64,{Convert.ToBase64String(e.Banner)}" : null
                })
                .ToListAsync();

            return Ok(approvedEvents);
        }

        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetAvailableEvents()
        {
            var availableEvents = await _context.Events
                .Where(e => e.Status == true) 
                .Select(e => new EventDto
                {
                    EventId = e.EId,
                    Description = e.Description,
                    ClubName = e.CIdNavigation.Clubname,
                    
                    BannerBase64 = e.Banner != null
                        ? $"data:image/jpeg;base64,{Convert.ToBase64String(e.Banner)}"
                        : null
                })
                .ToListAsync();

            return Ok(availableEvents);
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetAllTasks()
        {
            var allTasks = await _context.Tasks
                .Select(t => new TaskDto
                {
                    TaskId = t.TId,
                    TaskName = t.TaskName,
                    Description = t.Description
                })
                .ToListAsync();

            return Ok(allTasks);
        }

        [HttpPost("assign-single")]
        public async Task<IActionResult> AssignSingleTask([FromBody] AssignSingleTaskDto assignDto)
        {
           
            var eventExists = await _context.Events.AnyAsync(e => e.EId == assignDto.EventId);
            var userExists = await _context.Users.AnyAsync(u => u.UId == assignDto.UserId);
            var taskExists = await _context.Tasks.AnyAsync(t => t.TId == assignDto.TaskId);

            if (!eventExists || !userExists || !taskExists)
            {
                return NotFound("The specified Event, User, or Task does not exist.");
            }
            var alreadyAssigned = await _context.EventTasks
                .AnyAsync(et => et.EId == assignDto.EventId &&
                                et.UId == assignDto.UserId &&
                                et.TId == assignDto.TaskId);

            if (alreadyAssigned)
            {
                return BadRequest("This task has already been assigned to this user for this event.");
            }

            
            var newEventTask = new EventTask
            {
                EId = assignDto.EventId,
                TId = assignDto.TaskId,
                UId = assignDto.UserId
            };

          
            _context.EventTasks.Add(newEventTask);
            await _context.SaveChangesAsync();

            return StatusCode(201, "Task successfully assigned.");
        }


    }
}
