using System;
using Core.Base.Properties;

namespace Core.Base
{

    public class MesajTanimlayici {

        public virtual string VeritabaniKaydiBasarili()
        {
            return Resources.VeriTabaniKaydiBasarili;
        }
    }
    public class HataTanimlayici
    {

        public virtual Hata DefaultError()
        {
            return new Hata
            {
                Kod = nameof(DefaultError),
                Tanim = Resources.DefaultError
            };
        }
        public virtual Hata ConcurrencyFailure()
        {
            return new Hata
            {
                Kod = nameof(ConcurrencyFailure),
                Tanim= Resources.ConcurrencyFailure
            };
        }

       
    }

}
