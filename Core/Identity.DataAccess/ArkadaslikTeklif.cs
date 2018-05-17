using Core.EntityFramework.SharedEntity;

namespace Identity.DataAccess
{
    public class ArkadaslikTeklif : ArkadaslikTeklifBase
    {
        public Kullanici TeklifEden { get; set; }

        public Kullanici TeklifEdilen { get; set; }
    }
}
