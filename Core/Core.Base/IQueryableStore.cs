using System;
using System.Linq;

namespace Core.Base
{
    public interface IQueryableStore<TEntity> 
      where TEntity : class
      
    {
        IQueryable<TEntity> Liste { get; }
    }

}
