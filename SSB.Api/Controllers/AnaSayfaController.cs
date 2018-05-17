using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Psg.Api.Controllers
{
    public class AnaSayfaController : Controller
    {
        public IActionResult Giris()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"),"text/HTML");
        }
    }
}