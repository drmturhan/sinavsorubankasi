using System;

namespace Identity.DataAccess.Dtos
{
    public class ArkadaslarimListeDto
    {

        public string Id { get; set; }
        public ArkadasDto Arkadas { get; set; }
        public ArkadasDto TeklifEden { get; set; }
        public ArkadasDto TeklifEdilen{ get; set; }
        public DateTime IstekTarihi { get; set; }
        public DateTime? CevapTarihi { get; set; }
        public bool? Karar { get; set; }
        public DateTime? IptalTarihi { get; set; }
        public int? IptalEdenKullaniciNo { get; set; }
        public bool? IptalEdildi { get; set; }
    }
    public class ArkadasDto
    {
        public int Id { get; set; }
        public string Eposta { get; set; }
        public bool EpostaOnaylandi { get; set; }
        public string TelefonNumarasi { get; set; }
        public bool TelefonOnaylandi { get; set; }
        public string ProfilFotoUrl { get; set; }
        public string CinsiyetAdi { get; set; }
        public int Yasi { get; set; }
        public string TamAdi { get; set; }

    }
    public class MesajYaratmaDto
    {

        public int GonderenNo { get; set; }
        public int AlanNo { get; set; }
        public string Icerik { get; set; }
        public DateTime? GonderilmeZamani { get; set; }

        public MesajYaratmaDto()
        {
            GonderilmeZamani = DateTime.UtcNow;
        }
    }

    public class MesajListeDto
    {
        public int MesajId { get; set; }
        public int GonderenNo { get; set; }
        public string GonderenTamAdi { get; set; }
        public string GonderenProfilFotoUrl { get; set; }
        public string AlanTamAdi { get; set; }
        public string AlanProfilFotoUrl { get; set; }
        public int AlanNo { get; set; }
        public string Icerik { get; set; }
        public bool Okundu { get; set; }
        public DateTime? GonderilmeZamani { get; set; }
        public DateTime? OkunmaZamani { get; set; }

    }
}

