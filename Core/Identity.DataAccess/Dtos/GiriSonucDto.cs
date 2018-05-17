namespace Identity.DataAccess.Dtos
{
    public class GiriSonucDto
    {
        public string TokenString { get; set; }
        public KullaniciBilgi KullaniciBilgi { get; set; }
        public string ReturnUrl { get; set; }
    }
}

