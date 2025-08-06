namespace Student_Service_.DTO
{
    public class RemoveMemberDto
    {
        public int HeadUserId { get; set; }

        // The ID of the user to be removed from the club
        public int MemberToRemoveUserId { get; set; }
    }
}
