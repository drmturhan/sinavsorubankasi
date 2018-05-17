using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Base.Helpers
{
    public static class DateTimeExtensions
    {
        public static int YasHesapla(this DateTimeOffset tarih)
        {
            var suan = DateTime.UtcNow;
            int yas = suan.Year - tarih.Year;
            if (suan < tarih.AddYears(yas))
                yas--;
            return yas;
        }
        public static int YasHesapla(this DateTime tarih)
        {
            var suan = DateTime.UtcNow;
            int yas = suan.Year - tarih.Year;
            if (suan < tarih.AddYears(yas))
                yas--;
            return yas;
        }
    }
    
}
