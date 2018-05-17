using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Psg.Api.Data;
using Psg.Api.Dtos;
using Psg.Api.Repos;

namespace Psg.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/uykuTestleri")]
    [Authorize]
    public class UykuTestleriController : Controller
    {
        private readonly IMapper mapper;
        private readonly IUykuTestRepository repo;


        public UykuTestleriController(IMapper mapper, IUykuTestRepository repo)
        {
            this.mapper = mapper;
            this.repo = repo;

        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var entityListesi = await repo.TumTestleriListeleAsync();
            var dtoListesi = mapper.Map<ICollection<UykuTestOkuDto>>(entityListesi);
            return Ok(dtoListesi);
        }

    }
}