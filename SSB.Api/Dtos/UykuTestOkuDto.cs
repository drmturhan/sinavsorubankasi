using System.ComponentModel.DataAnnotations;

namespace Psg.Api.Dtos
{
    public class UykuTestOkuDto
    {
        public int Id { get; set; }
        public int HastaNo { get; set; }
        public string Ad { get; set; }
        public string Soyad { get; set; }
        public int Yas { get; set; }
        public double Ahi { get; set; }
        public double St90 { get; set; }
    }




    public class SifreDegistirDto
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Eposta")]
        public string Eposta { get; set; }

        [Required]
        [Display(Name = "Şifre")]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        public string Sifre { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Şifre kontrol")]
        [Compare("Sifre", ErrorMessage = "The password and confirmation password do not match.")]
        public string SifreKontrol { get; set; }


    }
    public class SifreKurtarDto : SifreDegistirDto
    {
        [Required]
        [Display(Name = "Kurtarma kodu")]
        public string Kod { get; set; }
    }
}
