
using Core.Base;
using Core.Base.Helpers;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;

namespace Core.EntityFramework
{



    public class ListeSonuc<TEntity> : Sonuc
    {
        public IList<TEntity> DonenListe { get; set; }
        public IEnumerable<ExpandoObject> DonenSekillenmisListe { get; set; }
        public int KayitSayisi { get; set; }
        public int SayfaSayisi { get; set; }
        public int SayfaBuyuklugu { get; set; }
        public int Sayfa { get; set; }
        public static ListeSonuc<TEntity> IslemTamam(SayfaliListe<TEntity> kayitlar)
        {
            var result = Tamam as ListeSonuc<TEntity>;
            result.DonenListe = kayitlar;
            result.Sayfa = kayitlar.SayfaBilgisi.Sayfa;
            result.KayitSayisi = kayitlar.SayfaBilgisi.KayitSayisi;
            result.SayfaBuyuklugu = kayitlar.SayfaBilgisi.SayfaBuyuklugu;
            result.SayfaSayisi = kayitlar.SayfaBilgisi.SayfaSayisi;
            return result;
        }
        public static ListeSonuc<TEntity> IslemTamam(IList<TEntity> kayitlar)
        {
            var result = Tamam as ListeSonuc<TEntity>;
            result.DonenListe = kayitlar;
            return result;
        }
        public static new ListeSonuc<TEntity> Tamam
        {
            get
            {
                return new ListeSonuc<TEntity> { Basarili = true, Mesajlar = new List<string> { SonucMesajlari.Liste[MesajAnahtarlari.IslemBasarili] } };
            }
        }
        public new static ListeSonuc<TEntity> Basarisiz(params Hata[] errors)
        {
            var result = new ListeSonuc<TEntity> { Basarili = false };
            if (errors != null)
            {
                result._errors.AddRange(errors);
            }
            return result;
        }


    }
    public class KayitSonuc<TEntity> : Sonuc
    {
        public TEntity DonenNesne { get; set; }
        public ExpandoObject DonenSekillenmisNesne { get; set; }
        public static KayitSonuc<TEntity> IslemTamam(TEntity kayit)
        {
            var result = Tamam as KayitSonuc<TEntity>;
            result.DonenNesne = kayit;
            return result;
        }
        public static new KayitSonuc<TEntity> Tamam
        {
            get
            {
                return new KayitSonuc<TEntity> { Basarili = true, Mesajlar = new List<string> { SonucMesajlari.Liste[MesajAnahtarlari.IslemBasarili] } };
            }
        }
        public new static KayitSonuc<TEntity> Basarisiz(params Hata[] errors)
        {
            var result = new KayitSonuc<TEntity> { Basarili = false };
            if (errors != null)
            {
                result._errors.AddRange(errors);
            }
            return result;
        }

    }
    public class Sonuc
    {

        protected List<Hata> _errors;
        public Sonuc()
        {
            _errors = new List<Hata>();
            Mesajlar = new List<string>();
        }

        public bool Basarili { get; protected set; }
        public IList<Hata> Hatalar => _errors;
        public List<string> Mesajlar { get; set; }
        public static Sonuc Tamam
        {
            get
            {
                return new Sonuc { Basarili = true, Mesajlar = new List<string> { SonucMesajlari.Liste[MesajAnahtarlari.IslemBasarili] } };
            }
        }

        public static Sonuc Basarisiz(params Hata[] errors)
        {
            var result = new Sonuc { Basarili = false };
            if (errors != null)
            {
                result._errors.AddRange(errors);
            }
            return result;
        }
        public static Sonuc Basarisiz(Exception hata)
        {
            var result = new Sonuc { Basarili = false };
            hata.SonucaYaz(result);
            return result;
        }

        public override string ToString()
        {
            return Basarili ?
                   "Başarılı" :
                   string.Format("{0} : {1}", "Hatalı sonuç", string.Join(",", Hatalar.Select(x => x.Tanim).ToList()));
        }
        public string ToString(bool mesaj = true)
        {
            if (!mesaj || !Basarili) return ToString();

            return
                  string.Format("{0} : {1}", "Mesajlar", string.Join(",", Mesajlar.ToList()));

        }
    }
}
