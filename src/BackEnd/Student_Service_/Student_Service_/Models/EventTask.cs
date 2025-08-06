using System;
using System.Collections.Generic;

namespace Student_Service_.Models;

public partial class EventTask
{
    public int EtId { get; set; }

    public int? TId { get; set; }

    public int? EId { get; set; }

    public int? UId { get; set; }

    public virtual Event? EIdNavigation { get; set; }

    public virtual Task? TIdNavigation { get; set; }

    public virtual User? UIdNavigation { get; set; }
}
