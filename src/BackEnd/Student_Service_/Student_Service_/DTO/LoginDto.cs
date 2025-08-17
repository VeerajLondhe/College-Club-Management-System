using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Student_Service_.DTO
{
    public class LoginDto
    {
        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
