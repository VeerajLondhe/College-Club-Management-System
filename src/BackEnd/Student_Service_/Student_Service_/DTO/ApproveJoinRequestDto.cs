namespace Student_Service_.DTO
{
    public class ApproveJoinRequestDto
    {
        // The ID of the user who is the club head and is approving the request
        public int HeadUserId { get; set; }

        // The ID of the ClubMember record (the pending request) to be approved
        public int ClubMemberId { get; set; }
    }
}
