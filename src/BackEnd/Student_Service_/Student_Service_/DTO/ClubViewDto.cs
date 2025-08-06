namespace Student_Service_.DTO
{
    public class ClubViewDto
    {
        public int CId { get; set; }
        public string Clubname { get; set; }
        public string Description { get; set; }
        public DateOnly Creationdate { get; set; }
        public bool Status { get; set; }
        public int CreatedByUId { get; set; }
    }
}
