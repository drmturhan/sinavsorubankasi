
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { FormGroup } from '@angular/forms';
import { environment } from 'environments/environment';
import { DersItem, SoruBirimItem, SoruTipItem, SoruZorlukItem, SoruBilisselDuzeyItem } from './models/birim-program-donem-ders';
import { KayitSonuc, Sonuc } from '../../../../models/sonuclar';
import { SoruListe, SoruDegistir, SoruYarat } from './models/soru';
import * as fromRootStore from '../../../../store/index';
import * as fromSorularStore from './soru-store/index';
import { KullaniciBilgi } from '../../../../models/kullanici';

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
        console.log(ders.dersId, dersNo);
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
    console.log('Soru kayıt bilgisi', kaydedilecekSoru);
    this.store.dispatch(new fromSorularStore.UpdateSoru(kaydedilecekSoru));

  }
}
