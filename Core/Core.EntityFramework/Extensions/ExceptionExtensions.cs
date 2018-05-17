
using Core.Base;
using System;
using System.Collections.Generic;

namespace Core.EntityFramework
{
    public static class ExceptionExtensions
    {
        public static void SonucaYaz(this Exception hata, Sonuc sonuc) 
        {
            if (sonuc == null) return;
            List<Hata> hatalar = new List<Hata> { new Hata { Kod = "", Tanim = hata.Message } };
            hatalar.ForEach(h => sonuc.Hatalar.Add(h));
            if (hata.InnerException != null)
                hata.InnerException.SonucaYaz(sonuc);
        }
    }
}
