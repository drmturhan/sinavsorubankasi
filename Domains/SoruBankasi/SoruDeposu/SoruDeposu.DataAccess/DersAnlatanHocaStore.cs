using Microsoft.EntityFrameworkCore;
using SoruDeposu.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SoruDeposu.DataAccess
{
    public interface IDersAnlatanHocaStore
    {

        List<DersHoca> ListeGetirPersonelNoyaGore(int personelNo);
    }

    public class DersAnlatanHocaStore : IDersAnlatanHocaStore
    {
        private readonly SoruDepoDbContext db;

        public DersAnlatanHocaStore(SoruDepoDbContext db)
        {
            this.db = db;
        }

        public List<DersHoca> ListeGetirPersonelNoyaGore(int personelNo)
        {
            try
            {
                var dersAnlatanHocalar = db.DersAnlatanHocalar
                    .Include(dah => dah.Dersi).ThenInclude(d=>d.AnlatanHocalar).ThenInclude(dah2=>dah2.PersonelBilgisi).ThenInclude(pb => pb.KisiBilgisi)
                    .Include(dah => dah.Dersi).ThenInclude(ders => ders.Konulari)
                    .Include(dah => dah.Dersi).ThenInclude(ders => ders.Konulari).ThenInclude(konu=> konu.AnlatanHocalar)
                    .Include(dah => dah.Dersi).ThenInclude(ders => ders.Konulari).ThenInclude(konu => konu.AnlatanHocalar).ThenInclude(dah2 => dah2.PersonelBilgisi).ThenInclude(pb => pb.KisiBilgisi)
                    .Include(dah => dah.Dersi).ThenInclude(ders => ders.OgrenimHedefleri)
                    .Include(dah => dah.Dersi).ThenInclude(ders => ders.Gruplari).ThenInclude(dg => dg.DersGrubu).ThenInclude(dersi => dersi.Donemi).ThenInclude(donem => donem.Programi).ThenInclude(pr => pr.Birimi)
                    .Where(dah => dah.PersonelNo == personelNo).ToList();
                return dersAnlatanHocalar;
            }
            catch (Exception hata)
            {

            }
            return new List<DersHoca>();
        }
    }

}
