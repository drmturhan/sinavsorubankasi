import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SoruBirimItem, SoruBilisselDuzeyItem, SoruTipItem, SoruZorlukItem } from '../../models/birim-program-donem-ders';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { SoruListe, SoruYarat, SoruDegistir } from '../../models/soru';
import { KayitSonuc, Sonuc } from '../../../../../../models/sonuclar';
import { SorularService } from '../../sorular.service';


@Injectable({
  providedIn: 'root'
})
export class SorularEffectsService {
  baseUrl = environment.apiUrl;
  sorularUrl = 'sorular';
  dersanlatanHocalarUrl = 'dersanlatanhocalar';
  soruTipleriUrl = 'sorutipleri';
  bilisselDuzeylerUrl = 'bilisselduzeyler';
  constructor(
    private http: HttpClient,
    private sorularService: SorularService
  ) { }
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
    const kaydedilecekSoru = Object.assign({}, soru, { personelNo: this.sorularService.kb.personelNo });
    delete kaydedilecekSoru['gecerlilik'];
    console.log(kaydedilecekSoru);

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

  soruSilindiOlarakIsaretle(soruNo: number) {
    const adres = `${this.baseUrl}/${this.sorularUrl}/${soruNo}`;
    return this.http.delete<Sonuc>(adres);
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
    const routeParams = Observable.of('dersNo', 'konuNo', 'soruId');
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
