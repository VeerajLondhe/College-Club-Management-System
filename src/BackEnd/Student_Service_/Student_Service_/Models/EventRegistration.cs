using System;
using System.Collections.Generic;

namespace Student_Service_.Models;

public partial class EventRegistration
{
    public int ErId { get; set; }

    public int? UId { get; set; }

    public int? EId { get; set; }

    public DateTime? RegistrationDate { get; set; }

    public bool IsActive { get; set; }

    public virtual User? UIdNavigation { get; set; }

    public virtual Event? EIdNavigation { get; set; }
}
