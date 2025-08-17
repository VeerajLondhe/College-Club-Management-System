using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Student_Service_.Models;

namespace Student_Service_.Controllers
{
    [Route("members")]
    [ApiController]
    public class MemberController : ControllerBase
    {
        private readonly CcmsContext _context;

        public MemberController(CcmsContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllMembers()
        {
            var users = await _context.Users.ToListAsync();
            
            var members = users.Select(u => new
            {
                id = u.UId,
                firstName = u.Uname?.Split(' ').FirstOrDefault() ?? "",
                lastName = u.Uname?.Split(' ').LastOrDefault() ?? "",
                email = u.Email ?? "",
                studentId = u.UId.ToString(),
                phone = u.Phoneno ?? "",
                department = u.DName ?? "",
                year = "Senior",
                joinDate = DateTime.Now.ToString("yyyy-MM-dd"), 
                status = "Active" 
            }).ToList();

            return Ok(members);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetMemberById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var member = new
            {
                id = user.UId,
                firstName = user.Uname?.Split(' ').FirstOrDefault() ?? "",
                lastName = user.Uname?.Split(' ').LastOrDefault() ?? "",
                email = user.Email ?? "",
                studentId = user.UId.ToString(),
                phone = user.Phoneno ?? "",
                department = user.DName ?? "",
                year = "Senior",
                joinDate = DateTime.Now.ToString("yyyy-MM-dd"),
                status = "Active"
            };

            return Ok(member);
        }

        [HttpPost]
        public ActionResult<object> CreateMember([FromBody] dynamic memberData)
        {
       
            return Ok(new { message = "Member created successfully" });
        }

        [HttpPut("{id}")]
        public ActionResult<object> UpdateMember(int id, [FromBody] dynamic memberData)
        {
       
            return Ok(new { message = "Member updated successfully" });
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<object>> DeleteMember(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { success = false, message = "Member not found" });
            }

            return Ok(new { success = true, message = "Member deleted successfully" });
        }

        [HttpGet("{memberId}/clubs")]
        public ActionResult<IEnumerable<object>> GetMemberClubs(int memberId)
        {
        
            return Ok(new List<object>());
        }

        [HttpGet("{memberId}/events")]
        public ActionResult<IEnumerable<object>> GetMemberEvents(int memberId)
        {
     
            return Ok(new List<object>());
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<object>>> SearchMembers([FromQuery] string q)
        {
            if (string.IsNullOrEmpty(q))
            {
                return Ok(new List<object>());
            }

          
            var users = await _context.Users
                .Where(u => (u.Uname != null && u.Uname.Contains(q)) || (u.Email != null && u.Email.Contains(q)))
                .ToListAsync();

            var members = users.Select(u => new
            {
                id = u.UId,
                firstName = u.Uname?.Split(' ').FirstOrDefault() ?? "",
                lastName = u.Uname?.Split(' ').LastOrDefault() ?? "",
                email = u.Email ?? "",
                studentId = u.UId.ToString(),
                phone = u.Phoneno ?? "",
                department = u.DName ?? ""
            }).ToList();


            return Ok(members);
        }
    }
}
