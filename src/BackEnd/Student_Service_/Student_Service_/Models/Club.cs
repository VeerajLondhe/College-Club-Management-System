using System;
using System.Collections.Generic;

namespace Student_Service_.Models;

public partial class Club
{
    public int CId { get; set; }

    public string Clubname { get; set; } = null!;

    public string? Description { get; set; }

    public DateOnly Creationdate { get; set; }

    public bool Status { get; set; }

    public int? UId { get; set; }

    public virtual ICollection<ClubMember> ClubMembers { get; set; } = new List<ClubMember>();

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    public virtual User? UIdNavigation { get; set; }
}
