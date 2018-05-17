using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.EntityFramework
{
    public interface IStoreReadBase<TContext, TEntity> : IDisposable
          where TContext : DbContext
          where TEntity : class
    {
        TContext Context { get; }
        IQueryable<TEntity> Sorgu { get; }
    }

    public class SayfaBilgi
    {
        public int KayitSayisi { get; set; }
        public int SayfaSayisi { get; set; }
        public int SayfaBuyuklugu { get; set; }
        public int Sayfa { get; set; }
        [JsonIgnore]
        public bool OncesiVar => Sayfa > 1;
        [JsonIgnore]
        public bool SonrasiVar
        {
            get
            {
                return Sayfa < SayfaSayisi;
            }
        }
    }
    public class SayfaliListe<T> : List<T>
    {
        public SayfaliListe()
        {

        }
        public SayfaBilgi SayfaBilgisi { get; set; } = new SayfaBilgi();
        public SayfaliListe(List<T> kayitlar, int kayitSayisi, int sayfa, int sayfaBuyuklugu)
        {
            AddRange(kayitlar);
            SayfaBilgisi.KayitSayisi = kayitSayisi;
            SayfaBilgisi.Sayfa = sayfa;
            SayfaBilgisi.SayfaBuyuklugu = sayfaBuyuklugu;
            SayfaBilgisi.SayfaSayisi = (int)Math.Ceiling(kayitSayisi / (double)sayfaBuyuklugu);
        }

        

        public static async Task<SayfaliListe<T>> SayfaListesiYarat(IQueryable<T> kaynakSorgu, int sayfa, int sayfaBuyuklugu)
        {

            var count = await kaynakSorgu.CountAsync();
            var items = await kaynakSorgu.Skip((sayfa - 1) * sayfaBuyuklugu).Take(sayfaBuyuklugu).ToListAsync();
            return new SayfaliListe<T>(items, count, sayfa, sayfaBuyuklugu);
        }
        public static async Task<SayfaliListe<T>> SayfaListesiYarat(IQueryable<T> kaynakSorgu)
        {

            var items = await kaynakSorgu.ToListAsync();
            return new SayfaliListe<T>(items, items.Count, -1, -1);
        }


    }
    public static class SayfaliListeExtensions
    {

        public static async Task<SayfaliListe<T>> SayfaListesiYarat<T>(this IQueryable<T> kaynakSorgu, int sayfa, int sayfaBuyuklugu) where T : class
        {

            var count = await kaynakSorgu.CountAsync();
            var items = await kaynakSorgu.Skip((sayfa - 1) * sayfaBuyuklugu).Take(sayfaBuyuklugu).ToListAsync();
            return new SayfaliListe<T>(items, count, sayfa, sayfaBuyuklugu);
        }

        public static async Task<SayfaliListe<T>> SayfaListesiYarat<T>(this IQueryable<T> kaynakSorgu) where T : class
        {

            var items = await kaynakSorgu.ToListAsync();
            return new SayfaliListe<T>(items, items.Count, -1, -1);
        }

    }
}
