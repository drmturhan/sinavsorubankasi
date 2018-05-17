using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace Identity.DataAccess
{
    public class RolYonetici : RoleManager<Rol>
    {
        public RolYonetici(IRoleStore<Rol> store, IEnumerable<IRoleValidator<Rol>> roleValidators, ILookupNormalizer keyNormalizer, IdentityErrorDescriber errors, ILogger<RoleManager<Rol>> logger) : base(store, roleValidators, keyNormalizer, errors, logger)
        {
        }
    }
}
