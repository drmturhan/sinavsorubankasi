
using AutoMapper;
using Core.Base;
using Core.EntityFramework;
using Core.EntityFramework.Factories;
using Core.Mail;
using Identity.DataAccess;
using Identity.DataAccess.Dtos;
using Identity.DataAccess.Helpers.Factories;
using Identity.DataAccess.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using Psg.Api.Extensions;
using Psg.Api.Helpers;
using Psg.Api.Preferences;
using Psg.Api.Repos;
using System;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace Psg.Api
{
    public class Startup
    {
        private readonly IHostingEnvironment _environment;


        public IConfigurationRoot Configuration { get; }
        public ApiTercihleri Tercihler { get; set; }
        public Startup(IHostingEnvironment env)
        {

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);
            _environment = env;
            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            bool useSqLite = false;
            bool.TryParse(Configuration["Data:useSqLite"], out useSqLite);
            string baglantiSatiri = useSqLite ? Configuration["Data:SqlLiteConnectionString"] : Configuration["Data:SqlServerConnectionString"];
            services.AddAutoMapper();
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));
            services.Configure<FotografAyarlari>(Configuration.GetSection("FotografAyarlari"));
            services.Configure<ApiTercihleri>(Configuration.GetSection("ApiTercihleri"));
            services.Configure<JwtIssuerOptions>(Configuration.GetSection("JwtIssuerOptions"));
            services.Configure<FacebookAuthSettings>(Configuration.GetSection("FacebookAuthSettings"));
            services.Configure<EpostaHesapBilgileri>(Configuration.GetSection("SistemPostaHesapBilgileri"));
            services.Configure<SMSHesapBilgileri>(Configuration.GetSection("SistemSMSHesapBilgileri"));

            

            var sp = services.BuildServiceProvider();
            Tercihler = sp.GetService<IOptions<ApiTercihleri>>().Value;


            services.AddTransient<IEmailSender, PostaciKit>();
            services.AddTransient<IPropertyMappingService, PropertyMappingService>();
            services.AddTransient<ITypeHelperService, TypeHelperService>();
            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IJwtFactory, JwtFactory>();
            services.AddScoped<IUrlHelper, UrlHelper>(implementationFactory =>
            {
                var actionContext = implementationFactory.GetService<IActionContextAccessor>().ActionContext;
                return new UrlHelper(actionContext);
            });

            services.AddDbContexts(useSqLite, baglantiSatiri, Tercihler);

            if (Tercihler.AspNetCoreIdentityKullan)
            {

                services.AddMTIdentity(Configuration);

            }
            //services.AddTransient<KullaniciRepository>();

            services.AddApplicationRepositories();


            services.AddScoped<IUykuTestRepository, UykuTestRepository>();


            services.AddSoruRepositories();


            services.AddTransient<ISeederManager, SeederManager>();

            var uygulamaAyarlari = sp.GetService<IOptions<JwtIssuerOptions>>().Value;

            SymmetricSecurityKey _signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(uygulamaAyarlari.SecretKey));
            
            services.Configure<JwtIssuerOptions>(options =>
            {
                options.Issuer = uygulamaAyarlari.Issuer;
                options.Audience = uygulamaAyarlari.Audience;
                options.SigningCredentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);
            });


            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = uygulamaAyarlari.Issuer,

                ValidateAudience = true,
                ValidAudience = uygulamaAyarlari.Audience,

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = _signingKey,

                RequireExpirationTime = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(configureOptions =>
            {
                configureOptions.ClaimsIssuer = uygulamaAyarlari.Issuer;
                configureOptions.TokenValidationParameters = tokenValidationParameters;
                configureOptions.SaveToken = true;
                configureOptions.RequireHttpsMetadata = false;
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("ApiUser", policy => policy.RequireClaim(ClaimTypes.Role, "api_access"));
            });

            services.AddMvc().AddJsonOptions(opt =>
            {
                opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                opt.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            });
            services.AddScoped<KullaniciAktiviteleriniTakipEt>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ISeederManager seederManager)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(builder =>
                {
                    builder.Run(async context =>
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        
                        var hata = context.Features.Get<IExceptionHandlerFeature>();
                        if (hata != null)
                        {
                            context.Response.UygulamaHatasiEkle(hata.Error.Message);
                            await context.Response.WriteAsync(hata.Error.Message);
                        }
                    });
                });
            }

            app.UseCors(c => c.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().AllowCredentials());
            app.UseAuthentication();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseMvc(routes =>
            {
               routes.MapSpaFallbackRoute(name: "spa-fallback", defaults: new { controller = "AnaSayfa", action = "giris" });
            });
        }
    }
}
