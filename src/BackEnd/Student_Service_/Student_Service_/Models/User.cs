using System;
using System.Collections.Generic;

namespace Student_Service_.Models;

public partial class User
{
    public int UId { get; set; }

    public string? DName { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public string? Phoneno { get; set; }

    public string? Uname { get; set; }

    public int? RId { get; set; }

    public virtual ICollection<ClubMember> ClubMembers { get; set; } = new List<ClubMember>();

    public virtual ICollection<Club> Clubs { get; set; } = new List<Club>();

    public virtual ICollection<EventTask> EventTasks { get; set; } = new List<EventTask>();

    public virtual Role? RIdNavigation { get; set; }
}
