using Core.Base;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Threading.Tasks;

namespace Identity.DataAccess
{
    public class MedeniHal : MedeniHal<int>
    {
        public ICollection<KullaniciKisi> Kisileri { get; set; } = new List<KullaniciKisi>();
    }
    public class MedeniHal<TKey> : EBase, IEntity<TKey> where TKey : IEquatable<TKey>
    {
        public TKey MedeniHalId { get; set; }
        public string MedeniHalAdi { get; set; }
        [NotMapped]
        public TKey Kimlik { get { return MedeniHalId; } set { MedeniHalId = value; } }
    }


    //public class CustomAuthenticationSchemeProvider : AuthenticationSchemeProvider
    //{
    //    private readonly IHttpContextAccessor httpContextAccessor;

    //    public CustomAuthenticationSchemeProvider(
    //        IHttpContextAccessor httpContextAccessor,
    //        IOptions<AuthenticationOptions> options)
    //        : base(options)
    //    {
    //        this.httpContextAccessor = httpContextAccessor;
    //    }

    //    private async Task<AuthenticationScheme> GetRequestSchemeAsync()
    //    {
    //        var request = httpContextAccessor.HttpContext?.Request;
    //        if (request == null)
    //        {
    //            throw new ArgumentNullException("The HTTP request cannot be retrieved.");
    //        }

    //        // For API requests, use authentication tokens.
    //        if (request.Path.StartsWithSegments("/api"))
    //        {
    //            return await GetSchemeAsync(OAuthValidationDefaults.AuthenticationScheme);
    //        }

    //        // For the other requests, return null to let the base methods
    //        // decide what's the best scheme based on the default schemes
    //        // configured in the global authentication options.
    //        return null;
    //    }

    //    public override async Task<AuthenticationScheme> GetDefaultAuthenticateSchemeAsync() =>
    //        await GetRequestSchemeAsync() ??
    //        await base.GetDefaultAuthenticateSchemeAsync();

    //    public override async Task<AuthenticationScheme> GetDefaultChallengeSchemeAsync() =>
    //        await GetRequestSchemeAsync() ??
    //        await base.GetDefaultChallengeSchemeAsync();

    //    public override async Task<AuthenticationScheme> GetDefaultForbidSchemeAsync() =>
    //        await GetRequestSchemeAsync() ??
    //        await base.GetDefaultForbidSchemeAsync();

    //    public override async Task<AuthenticationScheme> GetDefaultSignInSchemeAsync() =>
    //        await GetRequestSchemeAsync() ??
    //        await base.GetDefaultSignInSchemeAsync();

    //    public override async Task<AuthenticationScheme> GetDefaultSignOutSchemeAsync() =>
    //        await GetRequestSchemeAsync() ??
    //        await base.GetDefaultSignOutSchemeAsync();

    //}
}
