namespace DersYonetimi.DataAccess.Entities
{
    public class DersBase
    {
        public int DersId { get; set; }
        public int? AlanKodNo { get; set; }
        
        public string DersAdi { get; set; }
        public int KuramsalSaat { get; set; }
        public int UygulamaSaati { get; set; }
        public int HaftalikHesaplanacak { get; set; }
        
    }
}
