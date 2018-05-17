using System.Threading.Tasks;
using Core.EntityFramework;
using SoruDeposu.DataAccess.Entities;

namespace SoruDeposu.DataAccess
{
    public interface IBilisselDuzeyStore
    {
        Task<SayfaliListe<BilisselDuzey>> ListeGetirBilisselDuzeylerAsync(BilisselDuzeySorgusu sorguNesnesi);
    }
}