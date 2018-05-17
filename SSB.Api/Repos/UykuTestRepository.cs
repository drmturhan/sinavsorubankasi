using Microsoft.EntityFrameworkCore;
using Psg.Api.DbContexts;
using Psg.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Psg.Api.Repos
{
    public interface IUykuTestRepository
    {
        Task<ICollection<UykuTest>> TumTestleriListeleAsync();
    }
    public class UykuTestRepository : IUykuTestRepository
    {
        private readonly PsgContext db;

        public UykuTestRepository(PsgContext db)
        {
            this.db = db;
        }
        public async Task<ICollection<UykuTest>> TumTestleriListeleAsync()
        {
            return await db.UykuTestleri.Include(test=>test.Hasta).ToListAsync();
        }
    }

}
