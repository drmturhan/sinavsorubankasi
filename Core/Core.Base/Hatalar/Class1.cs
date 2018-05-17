using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Base.Hatalar
{

    public class DbUpdateError : ArgumentException
    {
        public DbUpdateError(string message) : base(message)
        {
        }

        public DbUpdateError(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
    public class BadRequestError : ArgumentException
    {
        public BadRequestError()
        {
        }

        public BadRequestError(string message) : base(message)
        {
        }
    }
    public class InternalServerError : InvalidOperationException
    {
        public InternalServerError()
        {
        }

        public InternalServerError(string message) : base(message)
        {
        }
    }
    public class NotFoundError : ArgumentException
    {
        public NotFoundError()
        {
        }

        public NotFoundError(string message) : base(message)
        {
        }
    }
   public class UnauthorizedError : ArgumentException
    {
        public UnauthorizedError()
        {
        }

        public UnauthorizedError(string message) : base(message)
        {
        }
    }
    
}
