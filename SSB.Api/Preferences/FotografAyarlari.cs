using System.IO;
using System.Linq;

namespace Psg.Api.Preferences
{
    public class FotografAyarlari {
        public int  MaxBytes { get; set; }
        public string[] AcceptedFileTypes { get; set; }
        public bool SadeceLokaldeTut { get; set; } = false;
        public bool SadeceBulutaYukle { get; set; } = false;

        public bool DosyaTipUygunmu(string dosyaAdi)
        {
            return AcceptedFileTypes.Any(s => s == Path.GetExtension(dosyaAdi).ToLower());
        }
    }
    public class ApiTercihleri
    {
        public bool AspNetCoreIdentityKullan { get; set; }
    }
}
