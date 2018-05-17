using System.ComponentModel.DataAnnotations;

namespace Identity.DataAccess.Dtos
{
    public class GirisDto
    {
        [Required]
        [StringLength(20, MinimumLength = 4, ErrorMessage = "{0} alanına en az {2} en fazla {1} karakter girebilirsiniz")]
        [Display(Name = "Kullanıcı adı")]
        public string KullaniciAdi { get; set; }
        [Required]
        [StringLength(18, MinimumLength = 4, ErrorMessage = "{0} alanına en az {2} en fazla {1} karakter girebilirsiniz")]
        [Display(Name = "Şifre")]
        public string Sifre { get; set; }
    }
}


