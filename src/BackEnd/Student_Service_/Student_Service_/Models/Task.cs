using System;
using System.Collections.Generic;

namespace Student_Service_.Models;

public partial class Task
{
    public int TId { get; set; }

    public string TaskName { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<EventTask> EventTasks { get; set; } = new List<EventTask>();
}
