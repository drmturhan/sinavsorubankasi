

using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Identity.DataAccess
{
    public class Rol : IdentityRole<int>
    {
        [StringLength(250)]
        public string Description { get; set; }

    }
}
