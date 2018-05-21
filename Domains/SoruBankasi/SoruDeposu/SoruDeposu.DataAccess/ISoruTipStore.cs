using System.Threading.Tasks;
using Core.EntityFramework;
using SoruDeposu.DataAccess.Entities;

namespace SoruDeposu.DataAccess
{
    public interface ISoruTipStore
    {
        Task<SayfaliListe<SoruTip>> ListeGetirSoruTipleriAsync(SoruTipSorgusu sorguNesnesi);

    }
}