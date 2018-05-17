using System.Threading.Tasks;
using Core.EntityFramework;
using DersYonetimi.DataAccess.Entities;

namespace DersYonetimi.DataAccess
{
    public interface IDersStore
    {
        Task<SayfaliListe<Ders>> ListeGetirPersonelSorulariAsync(DersSorgu sorguNesnesi);
    }
}