
using SoruDeposu.DataAccess.Dtos;
using SoruDeposu.DataAccess.Entities;
using SoruDeposu.DataAccess.Mappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SoruDeposu.DataAccess.Helpers
{
    public class BirimAgaciFactory
    {
        private readonly List<DersHoca> kaynak;
        private readonly int personelNo;
        private List<SoruBirimDto> birimAgaci = new List<SoruBirimDto>();



        public BirimAgaciFactory(List<DersHoca> kaynak, int personelNo)
        {
            this.kaynak = kaynak;
            this.personelNo = personelNo;
        }
        public List<SoruBirimDto> Yarat()
        {



            foreach (var dersHoca in kaynak)
            {
                Birim birim = BirimiAl(dersHoca);
                if (birim == null) continue;
                SoruBirimDto birimDto = AgactaVarsaAl(birim);
                if (birimDto == null)
                {
                    try
                    {
                        birimDto = birim.ToSoruBirimDto();
                        birimAgaci.Add(birimDto);

                    }
                    catch (Exception hata)
                    {

                    }
                }

            }
            KaynaktaPersonelinHocaOlmadigiBilgilerCilkarilsin();
            return birimAgaci;

        }
        List<Konu> cikarilacakKonular = new List<Konu>();
        List<Ders> cikarilacakDersler = new List<Ders>();
        private void KaynaktaPersonelinHocaOlmadigiBilgilerCilkarilsin()
        {

            for (int i = 0; i < birimAgaci.Count; i++)
            {
                SoruBirimDto birim = birimAgaci[i];

                for (int j = 0; j < birim.Programlari.Count; j++)
                {
                    SoruProgramDto program = birim.Programlari[j];


                    for (int k = 0; k < program.Donemleri.Count; k++)
                    {
                        ProgramDonemDto donem = program.Donemleri[k];


                        for (int l = 0; l < donem.DersGruplari.Count; l++)
                        {
                            DersGrupDto dersGrubu = donem.DersGruplari[l];

                            for (int m = 0; m < dersGrubu.Dersleri.Count; m++)
                            {
                                DersDto ders = dersGrubu.Dersleri[m];

                                for (int n = 0; n < ders.Konulari.Count; n++)
                                {
                                    KonuDto konu = ders.Konulari[n];
                                    if (!konu.AnlatanHocalar.Any(ah => ah.PersonelNo == personelNo))
                                    {

                                        ders.Konulari.RemoveAt(n);
                                        n--;
                                    }
                                }
                                if (!ders.AnlatanHocalar.Any(ah => ah.PersonelNo == personelNo))
                                {
                                    dersGrubu.Dersleri.RemoveAt(m);
                                    m--;
                                }
                                else
                                {
                                    if (ders.Konulari.Count == 0)
                                    {
                                        dersGrubu.Dersleri.RemoveAt(m);

                                    }
                                }

                            }
                            if (dersGrubu.Dersleri.Count == 0)
                            {
                                donem.DersGruplari.RemoveAt(l);
                                l--;
                            }

                        }
                        if (donem.DersGruplari.Count == 0)
                        {
                            program.Donemleri.RemoveAt(k);
                            k--;
                        }
                    }
                    if (program.Donemleri.Count == 0)
                    {

                        birim.Programlari.RemoveAt(j);
                        j--;
                    }
                }
                if (birim.Programlari.Count == 0)
                {

                    birim.Programlari.RemoveAt(i);
                }

            }


        }

        private Birim BirimiAl(DersHoca dersHoca)
        {
            if (dersHoca == null
                   || dersHoca.Dersi == null
                   || dersHoca.Dersi.Gruplari.Count < 1
                   || dersHoca.Dersi.Gruplari.First().DersGrubu == null
                   || dersHoca.Dersi.Gruplari.First().DersGrubu.Donemi == null
                   || dersHoca.Dersi.Gruplari.First().DersGrubu.Donemi.Programi == null
                   || dersHoca.Dersi.Gruplari.First().DersGrubu.Donemi.Programi.Birimi == null)
                return null;

            var birim = dersHoca.Dersi.Gruplari.First().DersGrubu.Donemi.Programi.Birimi;

            return birim;
        }

        private SoruBirimDto AgactaVarsaAl(Birim birim)
        {
            foreach (var item in birimAgaci)
            {
                if (item.BirimId == birim.BirimId)
                    return item;
            }
            return null;


        }
    }
}
