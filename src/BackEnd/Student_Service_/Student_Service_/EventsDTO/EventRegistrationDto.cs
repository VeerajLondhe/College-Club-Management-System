namespace Student_Service_.EventsDTO
{
    public class EventRegistrationDto
    {
        public int UserId { get; set; }
    }

    public class EventRegistrationResponseDto
    {
        public int EventId { get; set; }
        public string EventDescription { get; set; }
        public string ClubName { get; set; }
        public DateTime RegistrationDate { get; set; }
        public bool IsActive { get; set; }
        public string? BannerBase64 { get; set; }
    }
}
