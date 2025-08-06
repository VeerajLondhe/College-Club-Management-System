using System;
using System.Collections.Generic;

namespace Student_Service_.Models;

public partial class Role
{
    public int RId { get; set; }

    public string? RName { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
