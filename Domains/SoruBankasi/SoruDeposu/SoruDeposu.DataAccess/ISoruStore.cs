using System.Threading.Tasks;
using Core.EntityFramework;
using SoruDeposu.DataAccess.Dtos;
using SoruDeposu.DataAccess.Entities;

namespace SoruDeposu.DataAccess
{
    public interface ISoruStore
    {
        Task<Soru> BulAsync(int sorId);
        Task<SayfaliListe<Soru>> ListeGetirSorularAsync(SoruSorgu sorguNesnesi);
        Task<SayfaliListe<Soru>> ListeGetirPersonelSorulariAsync(SoruSorgu sorguNesnesi, int? personelNo);
        Task<Soru> YaratAsync(SoruYaratDto yeniSoru);
        Task<Soru> DegistirAsync(SoruDegistirDto soru);
        Task<Soru> KismenDegistirAsync(SoruAlanDegistirDto degisimBilgisi);
        void Sil(Soru yeniSoru);
        Task<bool> KaydetAsync();



    }


    public interface ISoruTipStore
    {
        Task<SayfaliListe<SoruTip>> ListeGetirSoruTipleriAsync(SoruTipSorgusu sorguNesnesi);

    }
}