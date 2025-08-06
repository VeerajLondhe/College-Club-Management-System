namespace Student_Service_.DTO
{
    public class ClubCreationRequestDto
    {  
            public string Clubname { get; set; }
            public string Description { get; set; }
            public int RequestingUId { get; set; } // The ID of the student making the request
        
    }
}
