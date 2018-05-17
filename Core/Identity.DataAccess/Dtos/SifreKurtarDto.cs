using System.ComponentModel.DataAnnotations;

namespace Identity.DataAccess.Dtos
{
    public class SifreKurtarBaslatDto
    {
        [Required]
        public string Eposta { get; set; }
    }
}


