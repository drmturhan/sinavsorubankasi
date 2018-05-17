using System;

namespace Core.Base
{
    public class DisposableBase : IDisposable
    {
        private bool _disposed;
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        protected virtual void Dispose(bool disposing)

        {
            if (disposing && !_disposed)
            {
                //Diğer disposable nesneler burada dispose edilecek
                //Store.Dispose();
                _disposed = true;
            }
        }
        protected void ThrowIfDisposed()
        {
            if (_disposed)
            {
                throw new ObjectDisposedException(GetType().Name);
            }
        }
    }

}
