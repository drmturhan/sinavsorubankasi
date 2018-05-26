import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SoruBirimItem, SoruBilisselDuzeyItem, SoruTipItem, SoruZorlukItem } from '../../models/birim-program-donem-ders';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { SoruListe, SoruYarat, SoruDegistir } from '../../models/soru';
import { KayitSonuc, Sonuc, ListeSonuc } from '../../../../../../models/sonuclar';
import * as fromRootStore from '../../../../../../store/index';
import { KullaniciBilgi } from '../../../../../../models/kullanici';
import { Store } from '@ngrx/store';


@Injectable({
  providedIn: 'root'
})
export class SorularEffectsService {
  baseUrl = environment.apiUrl;
  sorularUrl = 'sorular';
  dersanlatanHocalarUrl = 'dersanlatanhocalar';
  soruTipleriUrl = 'sorutipleri';
  bilisselDuzeylerUrl = 'bilisselduzeyler';
  kb: KullaniciBilgi;
  constructor(
    private http: HttpClient,
    private rootStore: Store<fromRootStore.State>
  ) {
    rootStore.select(fromRootStore.getAuthState).subscribe(
      authState => this.kb = authState.kullaniciBilgi
    );
  }
  getKullanicininAnlattigiDersler(): Observable<SoruBirimItem[]> {
    const adres = `${this.baseUrl}/${this.dersanlatanHocalarUrl}/kullanicininanlattigiderslervekonular/`;
    return this.http.get<SoruBirimItem[]>(adres);
  }
  getBilisselDuzeyler(): Observable<SoruBilisselDuzeyItem[]> {

    const adres = `${this.baseUrl}/${this.bilisselDuzeylerUrl}/`;
    return this.http.get<SoruBilisselDuzeyItem[]>(adres);
  }
  getKullanicininSorulari(handle: any[]): Observable<SoruListe[]> {
    const adres = `${this.baseUrl}/${this.sorularUrl}/kullanicininsorulari/`;
    return this.http.get<SoruListe[]>(adres + this.createQuery(handle));
  }

  updateSoru(soru): Observable<KayitSonuc<SoruListe>> {
    const kaydedilecekSoru = Object.assign({}, soru, { personelNo: this.kb.personelNo });
    delete kaydedilecekSoru['gecerlilik'];


    if (soru && soru['soruId']) {
      return this.soruDegisiklikKaydet(kaydedilecekSoru as SoruDegistir);
    } else {
      return this.yeniSoruEkle(kaydedilecekSoru as SoruYarat);
    }
  }
  yeniSoruEkle(yeni: SoruYarat): Observable<KayitSonuc<SoruListe>> {
    const adres = `${this.baseUrl}/${this.sorularUrl}/`;
    return this.http.post<KayitSonuc<SoruListe>>(adres, yeni);
  }
  soruDegisiklikKaydet(degisecekSoru: SoruDegistir): Observable<KayitSonuc<SoruListe>> {
    const adres = `${this.baseUrl}/${this.sorularUrl}/`;
    return this.http.put<Sonuc>(adres, degisecekSoru);
  }

  soruAcKapaDegistir(bilgi: { soruNo: number, ac: boolean }) {
    const adres = `${this.baseUrl}/${this.sorularUrl}/kismen`;
    return this.http.put<Sonuc>(adres, bilgi);
  }

  soruFavoriDegistir(bilgi: { soruNo: number, favori: boolean }) {
    const adres = `${this.baseUrl}/${this.sorularUrl}/kismen`;
    return this.http.put<Sonuc>(adres, bilgi);
  }

  soruSilindiOlarakIsaretle(soruNumaralari: string[]) {
    const adres = `${this.baseUrl}/${this.sorularUrl}/coklusil`;
    return this.http.post<ListeSonuc<number>>(adres, soruNumaralari);
  }

  getSoruTipleri(): Observable<SoruTipItem[]> {
    const adres = `${this.baseUrl}/${this.soruTipleriUrl}/`;
    return this.http.get<SoruTipItem[]>(adres);
  }

  getSoruZorluklari(): Observable<SoruZorlukItem[]> {
    const adres = `${this.baseUrl}/soruzorluklari/`;
    return this.http.get<SoruZorlukItem[]>(adres);
  }


  private createQuery(handle: any[]) {
    let str = '?';
    handle.forEach(h => {
      str = str + `${h.id}=${h.value}&`;
    });
    return str.substr(0, str.length - 1);
  }

  soruHandleYarat(routerState: any): any[] {
    const handle: any[] = [];
    const routeParams = Observable.of('programNo', 'donemNo', 'dersNo', 'konuNo', 'soruId');
    routeParams.subscribe(param => {
      if (routerState.params[param]) {
        handle.push({
          id: param,
          value: routerState.params[param]
        });
      }
    });
    return handle;
  }

}
