using Microsoft.AspNetCore.Mvc;
using Psg.Api.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Psg.Api.Extensions
{
    public static class UrlHelperExtensions
    {
        public static string EmailConfirmationLink(this IUrlHelper urlHelper, string userId, string code, string scheme)
        {


            return urlHelper.Action(
                        action: nameof(AuthController.ConfirmEmail),
                        controller: "Auth",
                        values: new { userId, code },
                        protocol: scheme);
        }

        public static string ResetPasswordCallbackLink(this IUrlHelper urlHelper, string userId, string code, string scheme)
        {
            return urlHelper.Action(
                action: nameof(AuthController.ResetPassword),
                controller: "Auth",
                values: new { userId, code },
                protocol: scheme);
        }
    }
}
