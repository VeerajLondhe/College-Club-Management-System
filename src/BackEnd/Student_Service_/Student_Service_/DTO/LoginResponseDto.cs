using System;
using System.Collections.Generic;

namespace Student_Service_.DTO
{
    public class LoginResponseDto
    {
        public int Uid { get; set; }
        public string Uname { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phoneno { get; set; } = string.Empty;
        public string Dname { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string JWT { get; set; } = string.Empty;
    }
}
