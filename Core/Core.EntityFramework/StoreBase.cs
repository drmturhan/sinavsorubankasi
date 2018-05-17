using Core.Base;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace Core.EntityFramework
{

    public class StoreBase<TContext, TEntity> : IDisposable, IStoreReadBase<TContext, TEntity> where TContext : DbContext where TEntity : class
    {
        public StoreBase(TContext context)
        {
            Context = context;
            sorgu = Context.Set<TEntity>().AsNoTracking().AsQueryable<TEntity>();
            kayit = Context.Set<TEntity>();
        }
        public TContext Context { get; protected set; }

        IQueryable<TEntity> sorgu;
        IQueryable<TEntity> kayit;
        public virtual IQueryable<TEntity> Sorgu { get { return sorgu; } set { sorgu = value; } }
        public virtual IQueryable<TEntity> Kayit { get { return kayit; } set { kayit = value; } }

        public HataTanimlayici HataTanimlayici { get; protected set; }

        protected bool _disposed;
        protected void ThrowIfDisposed()
        {
            if (_disposed)
            {
                throw new ObjectDisposedException(GetType().Name);
            }
        }
        public void Dispose()
        {
            Context.Dispose();
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            _disposed = true;
        }
    }

}
