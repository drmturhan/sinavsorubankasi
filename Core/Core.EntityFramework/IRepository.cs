using System.Threading.Tasks;

namespace Core.EntityFramework
{
    public interface IRepository
    {

        Task EkleAsync<T>(T entity) where T : class;
        void Sil<T>(T entity) where T : class;
        Task<bool> KaydetAsync();
    }
}
