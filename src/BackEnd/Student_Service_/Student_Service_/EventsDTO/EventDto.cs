namespace Student_Service_.EventsDTO
{
    public class EventDto
    {
        public int EventId { get; set; }
        public string Description { get; set; }
        public string ClubName { get; set; }
        public bool Status { get; set; }
        public string? BannerBase64 { get; set; }
        public string? TaskName { get; set; } 
    }
}
