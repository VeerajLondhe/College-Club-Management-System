using System;
using System.Collections.Generic;

namespace Student_Service_.Models;

public partial class Event
{
    public int EId { get; set; }

    public int? CId { get; set; }

    public string? Description { get; set; }

    public byte[]? Banner { get; set; }

    public bool Status { get; set; }

    public virtual Club? CIdNavigation { get; set; }

    public virtual ICollection<EventTask> EventTasks { get; set; } = new List<EventTask>();
}
