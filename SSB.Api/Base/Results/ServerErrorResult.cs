using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Psg.Api.Base
{
    public class ServerErrorResult : ObjectResult
    {
        public ServerErrorResult(object value) : base(value)
        {
            StatusCode = StatusCodes.Status500InternalServerError;
        }
        public ServerErrorResult(int statusCode, object value = null) : base(value)
        {
            StatusCode = statusCode;
        }
    }

}

