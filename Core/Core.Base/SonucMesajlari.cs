using Core.Base.Properties;
using System;
using System.Collections.Generic;

namespace Core.Base
{


    public enum MesajAnahtarlari
    {
        IslemBasarili,
        KayitBulunamadi,
        SifirdanBuyukDegerGerekli,
        KayitBosOlamaz,
        IslemGerceklesmedi,
        DahaSonraTekrarDeneyiniz
    }

    public class SonucMesajlari : SortedList<MesajAnahtarlari, string>
    {
        private static volatile SonucMesajlari instance;
        private static object syncRoot = new Object();


        protected SonucMesajlari()
        {
            Add(MesajAnahtarlari.IslemBasarili, Resources.IslemBasarili);
            Add(MesajAnahtarlari.KayitBulunamadi, Resources.KayitBulunamadi);
            Add(MesajAnahtarlari.SifirdanBuyukDegerGerekli, Resources.BuyukDegerGerekli);
            Add(MesajAnahtarlari.KayitBosOlamaz, Resources.KayitBosOlamaz);
            Add(MesajAnahtarlari.IslemGerceklesmedi, Resources.IslemGerceklesmesi);
            Add(MesajAnahtarlari.DahaSonraTekrarDeneyiniz, Resources.DahaSonraTekrarDeneyiniz);
        }

        public static SonucMesajlari Liste
        {
            get
            {
                if (instance == null)
                {
                    lock (syncRoot)
                    {
                        if (instance == null)
                            instance = new SonucMesajlari();
                    }
                }
                return instance;
            }
        }
    }
}
