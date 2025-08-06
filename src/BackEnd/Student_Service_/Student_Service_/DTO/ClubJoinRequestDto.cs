namespace Student_Service_.DTO
{
    public class ClubJoinRequestDto
    {
        public int UId { get; set; } // ID of the user sending the request
        public int CId { get; set; } // ID of the club they want to join
    }
}
