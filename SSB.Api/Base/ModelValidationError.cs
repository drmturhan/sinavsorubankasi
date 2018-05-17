using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;

namespace Psg.Api.Base
{
    public class ModelValidationError : ArgumentException
    {
        public ModelStateDictionary ModelState { get; private set; }
        public ModelValidationError(ModelStateDictionary modelState) 
        {
            this.ModelState = modelState;
        }
    }

}

