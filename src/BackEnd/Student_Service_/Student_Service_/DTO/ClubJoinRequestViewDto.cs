namespace Student_Service_.DTO
{
    public class ClubJoinRequestViewDto
    {
        public int ClubMemberId { get; set; } 
        public int RequestingUserId { get; set; }
        public string RequestingUsername { get; set; }
    }
}
