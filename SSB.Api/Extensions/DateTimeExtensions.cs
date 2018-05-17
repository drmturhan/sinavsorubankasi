using System;

namespace Psg.Api.Extensions
{
    public static class DateTimeExtensions
    {
        public static int YasHesapla(this DateTimeOffset tarih)
        {
            var suan = DateTime.UtcNow;
            int yas = suan.Year - tarih.Year;
            if (tarih.AddYears(yas) > suan)
                yas--;
            return yas;
        }
        public static int YasHesapla(this DateTime tarih)
        {
            var suan = DateTime.UtcNow;
            int yas = suan.Year - tarih.Year;
            if (tarih.AddYears(yas) > suan)
                yas--;
            return yas;
        }
    }
}
