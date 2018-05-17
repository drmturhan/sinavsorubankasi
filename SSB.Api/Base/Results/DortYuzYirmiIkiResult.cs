using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;

namespace Psg.Api.Base
{
    public class DortYuzYirmiIkiResult : ObjectResult
    {
        public DortYuzYirmiIkiResult(ModelStateDictionary modelState) : base(new SerializableError(modelState))
        {
            if (modelState == null)
                throw new ArgumentNullException(nameof(modelState));
            StatusCode = 422;
        }
    }

}

