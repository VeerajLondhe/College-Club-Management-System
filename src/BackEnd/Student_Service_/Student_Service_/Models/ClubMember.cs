using System;
using System.Collections.Generic;

namespace Student_Service_.Models;

public partial class ClubMember
{
    public int CmId { get; set; }

    public int? UId { get; set; }

    public int? CId { get; set; }

    public string Position { get; set; } = null!;

    public bool ReqStatus { get; set; }

    public virtual Club? CIdNavigation { get; set; }

    public virtual User? UIdNavigation { get; set; }
}
