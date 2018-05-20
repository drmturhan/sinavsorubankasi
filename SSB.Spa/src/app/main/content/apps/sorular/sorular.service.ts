
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { FormGroup } from '@angular/forms';
import { environment } from 'environments/environment';
import { DersItem, SoruBirimItem, SoruTipItem, SoruZorlukItem, SoruBilisselDuzeyItem, ProgramDonemItem, KonuItem } from './models/birim-program-donem-ders';
import { KayitSonuc, Sonuc } from '../../../../models/sonuclar';
import { SoruListe, SoruDegistir, SoruYarat } from './models/soru';
import * as fromRootStore from '../../../../store/index';
import * as fromSorularStore from './soru-store/index';
import { KullaniciBilgi } from '../../../../models/kullanici';
import { SbNavitaionItem } from '../../../../models/sb-navigation';

@Injectable({
  providedIn: 'root'
})
export class SorularService {
  baseUrl = environment.apiUrl;
  sorularUrl = 'sorular';
  kb: KullaniciBilgi;
  dersler: DersItem[];
  constructor(private http: HttpClient,
    private store: Store<fromRootStore.State>,
  ) {
    this.store.select(fromSorularStore.getDersler).subscribe((dersler: DersItem[]) => {
      this.dersler = dersler;
    });
    this.store.select(fromRootStore.getAuthState).subscribe(auth => {
      this.kb = auth.kullaniciBilgi;
    });
    this.store.dispatch(new fromSorularStore.GetDersler());
  }


  private createQuery(handle: any[]) {
    let str = '?';
    handle.forEach(h => {
      str = str + `${h.id}=${h.value}&`;
    });
    return str.substr(0, str.length - 1);
  }

  getDersinSorulari(dersNo: number): Observable<SoruListe[]> {
    const adres = `${this.baseUrl}/${this.sorularUrl}?dersNo=dersNo`;
    return this.http.get<SoruListe[]>(adres);
  }

  getKonununSorulari(konuNo: number): Observable<SoruListe[]> {
    const adres = `${this.baseUrl}/${this.sorularUrl}?konuNo=KonuNo`;
    return this.http.get<SoruListe[]>(adres);
  }

  getSoruById(soruId: number): Observable<KayitSonuc<SoruDegistir>> {
    const adres = `${this.baseUrl}/${this.sorularUrl}/sorual/${soruId}`;
    return this.http.get<KayitSonuc<SoruDegistir>>(adres);
  }



  dersBul(dersNo: number): DersItem {
    let donecekDers: DersItem = null;
    if (dersNo > 0 && this.dersler.length > 0) {
      this.dersler.forEach(ders => {
        
        // tslint:disable-next-line:triple-equals
        if (ders.dersId == dersNo) {
          donecekDers = ders;
          return;
        }
      });
    }
    return donecekDers;
  }
  formuNesneyeCevirKaydet(formData: FormGroup, degisecekSoru: SoruDegistir | SoruYarat) {
    const kaydedilecekSoru = Object.assign({}, degisecekSoru, formData.getRawValue());
    kaydedilecekSoru.tekDogruluSecenekleri = formData.get('secenekler').value;
    kaydedilecekSoru.hemenElenebilirSecenekSayisi = formData.get('hemenElenebilirSecenekSayisi').value;
    kaydedilecekSoru.baslangic = formData.get('gecerlilik.baslangic').value;
    kaydedilecekSoru.bitis = formData.get('gecerlilik.bitis').value;
    
    this.store.dispatch(new fromSorularStore.UpdateSoru(kaydedilecekSoru));

  }
  createNavigationTree(seciliBirim: SoruBirimItem): any {

    const navItems: SbNavitaionItem[] = [];
    if (!seciliBirim) {
      return navItems;
    }
    seciliBirim.programlari.forEach(program => {
      const programItem = new SbNavitaionItem();
      programItem.id = program.programId.toString();
      programItem.title = program.programAdi;
      programItem.type = 'group';
      programItem.icon = 'account_balance';
      programItem.url = `sorudeposu/program/${program.programId}`;
      programItem.exactMatch = true;
      programItem.children = [];
      program.donemleri.forEach(donem => {
        const donemItem = new SbNavitaionItem();
        donemItem.id = donem.donemId.toString();
        donemItem.title = `${donem.sinifi}. sınıf, ${donem.donemAdi}`;
        donemItem.type = 'group';
        donemItem.icon = 'event';
        donemItem.url = `${programItem.url}+/donem/${donem.donemId}`;
        donemItem.exactMatch = true;

        donem.dersGruplari.forEach(dersGrubu => {
          const dersGrubuItem = new SbNavitaionItem();
          dersGrubuItem.id = dersGrubu.dersGrupId.toString();
          dersGrubuItem.title = dersGrubu.grupAdi;
          donemItem.type = 'group';
          if (dersGrubu.staj || dersGrubu.dersKurulu) {
            dersGrubuItem.icon = 'content_copy';
          } else {
            dersGrubuItem.icon = 'folder';
          }
          dersGrubuItem.url = `${donemItem.url}/dersgrubu/${dersGrubu.dersGrupId}`;
          dersGrubu.dersleri.forEach(ders => {
            const dersItem = new SbNavitaionItem();
            dersItem.id = ders.dersId.toString();
            dersItem.title = ders.dersAdi;
            dersItem.icon = 'book';
            dersItem.url = `${dersGrubuItem.url}/ders/${ders.dersId}`;
            if (ders.konulari) {
              dersItem.type = 'group';
            } else {
              dersItem.type = 'item';
            }
            ders.konulari.forEach(konu => {
              const konuItem = new SbNavitaionItem();
              konuItem.id = konu.konuId.toString();
              konuItem.title = konu.konuAdi;
              konuItem.type = 'item';
              konuItem.url = `${dersItem.url}/konu/${konu.konuId}`;
              dersItem.children.push(konuItem);
            });
            dersGrubuItem.children.push(dersItem);
          });
          donemItem.children.push(dersGrubuItem);
        });

        programItem.children.push(donemItem);
      });
      navItems.push(programItem);
    });
    
  }
}
