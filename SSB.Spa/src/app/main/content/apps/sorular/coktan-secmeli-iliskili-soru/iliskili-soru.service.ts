import { Injectable } from '@angular/core';
import { SoruListe, SoruKokuListe, SoruKokuYarat, SoruKokuDuzenle } from '../models/soru';
import { BehaviorSubject } from 'rxjs';

import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { Observable } from 'rxjs/internal/Observable';
// import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/forkJoin';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError, tap, take, filter } from 'rxjs/operators';
import * as fromSoruStore from '../soru-store/index';
import { Store } from '@ngrx/store';
import { SoruTipItem, SoruZorlukItem, SoruBilisselDuzeyItem, DersItem, KonuItem } from '../models/birim-program-donem-ders';
import { HttpClient } from '@angular/common/http';
import { FuseUtils } from '@fuse/utils';
import { environment } from 'environments/environment';
import { KayitSonuc, Sonuc } from '../../../../../models/sonuclar';
import { SbMesajService } from '../../../../../core/services/sb-mesaj.service';
import { SoruDepoVeriService } from '../soru-store/helpers/soru-depo-veri.service';
import { SoruDepoResolverService } from '../soru-depo-resolver.service';
import { ResolveInfo } from '../../../../../models/resolve-model';

@Injectable({
  providedIn: 'root'
})
export class IliskiliSoruService {


  baseUrl = environment.apiUrl;
  soruKokleriUrl = 'sorukokleri';
  yukleniyor = false;
  soruKokuNo: number;
  dersler: DersItem[];
  bilgi: ResolveInfo;
  ders: DersItem;
  konu: KonuItem;
  soruKokuSonuc: KayitSonuc<SoruKokuListe>;
  sorular: SoruListe[];
  secilmisSorular: SoruListe[];
  aktifSoru: SoruListe;
  searchText = '';
  routeParams: any;

  soruTipleri$: Observable<SoruTipItem[]>;
  soruZorluklari$: Observable<SoruZorlukItem[]>;
  bilisselDuzeyler$: Observable<SoruBilisselDuzeyItem[]>;

  onSorularDegisti: BehaviorSubject<any> = new BehaviorSubject([]);


  onSecilmisSorularDegisti: BehaviorSubject<any> = new BehaviorSubject([]);
  onAktifSoruDegisti: BehaviorSubject<any> = new BehaviorSubject([]);

  onAramaCumlesiDegisti: BehaviorSubject<any> = new BehaviorSubject('');



  constructor(
    private http: HttpClient,
    private router: Router,
    private soruStore: Store<fromSoruStore.SoruDepoAppState>,
    private resolverBilgi: SoruDepoResolverService,
    private mesajService: SbMesajService,
    private soruDepoVeriService: SoruDepoVeriService) {

    this.secilmisSorular = [];
    this.soruTipleri$ = this.soruStore.select(fromSoruStore.getSoruTipleri);
    this.soruZorluklari$ = this.soruStore.select(fromSoruStore.getSoruZorluklari);
    this.bilisselDuzeyler$ = this.soruStore.select(fromSoruStore.getBilisselDuzeyler);

    this.soruStore.select(fromSoruStore.getSorularState).subscribe(sonuc => {
      if (this.yukleniyor) { return; }
      if (this.soruKokuNo !== undefined) {
        const arr = Object.keys(sonuc.entities).map(k => sonuc.entities[k]);
        // tslint:disable-next-line:triple-equals
        const eklenecekListe: SoruListe[] = arr.filter(soru => soru.soruKokuNo == this.soruKokuNo);
        this.sorular = eklenecekListe;
        this.onSorularDegisti.next(this.sorular);
        if (this.aktifSoru) {
          const yeniAktifSoru = this.sorular.find(soruListe => soruListe.soruId == this.aktifSoru.soruId);
          this.onAktifSoruDegisti.next(yeniAktifSoru);
        }

      }

    });

  }
  checkStore(): Observable<any> {

    return forkJoin(
      this.soruDepoVeriService.getBirimler(),
      this.soruDepoVeriService.getSoruTipleri(),
      this.soruDepoVeriService.getSoruBilisselDuzeyleri(),
      this.soruDepoVeriService.getSoruZorluklari()
    )
      .pipe(
        filter(([birimlerLoaded, soruTipleriLoaded, soruZorluklariLoaded, bilisselDuzeylerLoaded]) =>
          birimlerLoaded && soruTipleriLoaded && soruZorluklariLoaded && bilisselDuzeylerLoaded),
        take(1),
    );
  }


  yenile(soruKokuNo: number) {
    this.getSorularBySoruKoku(soruKokuNo);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    this.secilmisSorular = [];

    this.yukleniyor = true;
    this.aktifSoru = null;
    this.onAktifSoruDegisti.next(this.aktifSoru);
    this.checkStore();
    if (route.params) {
      this.routeParams = route.params;
      if (route.params['bilgi']) {
        // Gelen sorudan sorukoku bilgisi alındı.

        this.bilgi = this.resolverBilgi.bilgiAl(route.params['bilgi'], 'iliskilisoru');

        if (this.bilgi) {
          this.soruKokuNo = this.bilgi.sayfaBilgisi['soruKokuNo'];
          if (this.soruKokuNo) {
            this.soruKokuBilgisiAl(this.soruKokuNo).subscribe(sonuc => {

              if (sonuc.basarili) {
                this.bilgi = this.resolverBilgi.bilgiDegistir(this.bilgi.id, this.bilgi.url, sonuc.donenNesne);
                this.onKayitGeldi(sonuc);
                this.soruStore.dispatch(new fromSoruStore.UpdateSorularTamam(sonuc.donenNesne.sorulari));

              } else {
                const aksiyon = this.mesajService.hataStr('Sorular yüklenirken bir hata oluştu!', 'Yeniden dene');
                aksiyon.onAction().subscribe(() => { this.resolve(route, state); });
              }
            },
              (hata) => {
                this.mesajService.hataStr('Sorular yüklenirken bir hata oluştu!');
              },
              () => this.yukleniyor = false);
            return;
          } else {
            // YENİ SORU KOKU
            this.yukleniyor = false;
            this.soruKokuNo = 0;
            const yeniKayit = new KayitSonuc<SoruKokuListe>();
            yeniKayit.basarili = true;
            yeniKayit.donenNesne = new SoruKokuListe();
            yeniKayit.donenNesne.soruKokuId = 0;
            yeniKayit.donenNesne.sorulari = [];
            this.soruKokuNo = yeniKayit.donenNesne.soruKokuId;
            if (this.bilgi.sayfaBilgisi.hasOwnProperty('dersNo')) {
              yeniKayit.donenNesne.dersNo = this.bilgi.sayfaBilgisi.dersNo;
            }
            if (this.bilgi.sayfaBilgisi.hasOwnProperty('konuNo')) {
              yeniKayit.donenNesne.konuNo = this.bilgi.sayfaBilgisi.konuNo;
            }
            yeniKayit.donenNesne.soruKokuMetni = '';
            this.onKayitGeldi(yeniKayit);
            this.onSorularDegisti.next([]);
            this.mesajService.goster('Lütfen yeni soru kökünü girdikten sonra ilişkili soruları girin..');
            return;
          }
        }
      }
    }
    // Direkt bu sayafaya gelmek istenmiş
    this.mesajService.hataStr('Bu sayfaya ilişkili soru seçerek veya yaratarak gelebilirsiniz!');
    this.router.navigate(['sorudeposu']);


    // return new Promise((resolve, reject) => {
    //   Promise.all([
    //     this.getSorular()
    //   ]).then(
    //     () => {


    //       this.onAramaCumlesiDegisti.subscribe(searchText => {
    //         if (searchText !== '') {
    //           this.searchText = searchText;
    //           this.getSorular();
    //         }
    //         else {
    //           this.searchText = searchText;
    //           this.getSorular();
    //         }
    //       });

    //       resolve();
    //     },
    //     reject
    //   );
    // });
  }

  getSorular(): Promise<SoruListe[]> {
    return this.getSorularBySoruKoku(this.soruKokuNo);
  }

  getSorularBySoruKoku(soruKokuNo: number): Promise<SoruListe[]> {
    return new Promise((resolve, reject) => {


      if (this.soruKokuNo === undefined || this.soruKokuNo === 0) {
        const yeniKayit = new KayitSonuc<SoruKokuListe>();
        yeniKayit.basarili = true;
        yeniKayit.donenNesne = new SoruKokuListe();
        yeniKayit.donenNesne.soruKokuId = 0;
        yeniKayit.donenNesne.sorulari = [];
        this.soruKokuNo = yeniKayit.donenNesne.soruKokuId;
        if (this.routeParams.dersNo) {
          yeniKayit.donenNesne.dersNo = +this.routeParams.dersNo;
        }

        if (this.routeParams.konuNo) {
          yeniKayit.donenNesne.konuNo = +this.routeParams.konuNo;
        }

        yeniKayit.donenNesne.soruKokuMetni = '';
        this.onKayitGeldi(yeniKayit);
        this.onAktifSoruDegisti.next(null);
        resolve(this.sorular);
      } else {
        const adres = `${this.baseUrl}/${this.soruKokleriUrl}/`;
        this.http.get<KayitSonuc<SoruKokuListe>>(adres + soruKokuNo)
          .subscribe((sonuc: KayitSonuc<SoruKokuListe>) => {
            if (sonuc.basarili) {
              this.onKayitGeldi(sonuc);
              resolve(this.sorular);
            }
            else {
              resolve([]);
            }
          }, reject);
      }
    });
  }


  onKayitGeldi(sonuc: KayitSonuc<SoruKokuListe>) {

    this.soruKokuNo = sonuc.donenNesne.soruKokuId;
    this.soruKokuSonuc = sonuc;
    // this.sorular = sonuc.donenNesne.sorulari.map(soruListe => {
    //   return new SoruListe(soruListe);
    // });

    // this.sorular = FuseUtils.filterArrayByString(this.sorular, this.searchText);

    // this.onSorularDegisti.next(this.sorular);
    // this.onAktifSoruDegisti.next(null);

  }

  soruKokuBilgisiAl(id: number, alanAdlari: string = null): Observable<KayitSonuc<SoruKokuListe>> {
    let adres = `${this.baseUrl}/${this.soruKokleriUrl}/${id}`;
    if (alanAdlari) {
      adres = adres + `?alanlar=${alanAdlari})`;
    }
    return this.http.get<KayitSonuc<SoruKokuListe>>(adres);
  }
  soruKokuYarat(soruKoku: SoruKokuYarat): Observable<KayitSonuc<SoruKokuListe>> {

    const adres = `${this.baseUrl}/${this.soruKokleriUrl}/`;
    return this.http.post<KayitSonuc<SoruKokuListe>>(adres, { ...soruKoku });

  }

  soruKokuKaydet(soruKoku: SoruKokuDuzenle): Observable<KayitSonuc<SoruKokuListe>> {
    const adres = `${this.baseUrl}/${this.soruKokleriUrl}/`;
    return this.http.put<KayitSonuc<SoruKokuListe>>(adres, { ...soruKoku });
  }

  soruKokuSil(soruKokuNo: number): Observable<Sonuc> {
    const adres = `${this.baseUrl}/${this.soruKokleriUrl}/${soruKokuNo}`;
    return this.http.delete<Sonuc>(adres);
  }
  toggleHepsiniSec() {
    if (this.secilmisSorular.length > 0) {
      this.deselectSorular();
    }
    else {
      this.sorulariSec();
    }

  }

  toggleSoruSec(id) {
    //  Önce gelen soru secilmis mi kontrol et (soru secilmisse secilmemis yapmak icin)..
    if (this.secilmisSorular.length > 0) {
      for (const soru of this.secilmisSorular) {
        // ... secilmis soruyu sil
        if (soru.soruId === id) {
          const index = this.secilmisSorular.indexOf(soru);

          if (index !== -1) {
            this.secilmisSorular.splice(index, 1);

            // secilmisoruyu olayini tetikle
            this.onSecilmisSorularDegisti.next(this.secilmisSorular);

            // don
            return;
          }
        }
      }
    }

    //  Eger gelen soru secilmemi ise secilmis yap
    this.secilmisSorular.push(
      this.sorular.find(soru => {
        return soru.soruId === id;
      })
    );

    // Tetikle
    this.onSecilmisSorularDegisti.next(this.secilmisSorular);
  }

  sorulariSec(filterParameter?, filterValue?) {
    this.secilmisSorular = [];

    // Eger filtre yoksa hepsini sec
    if (filterParameter === undefined || filterValue === undefined) {
      this.secilmisSorular = this.sorular;
    }
    else {
      this.secilmisSorular.push(...
        this.sorular.filter(soru => {
          return soru[filterParameter] === filterValue;
        })
      );
    }

    // Sonrakini tetikle
    this.onSecilmisSorularDegisti.next(this.secilmisSorular);
  }

  deselectSorular() {
    this.secilmisSorular = [];

    // Sonrakini tetikle
    this.onSecilmisSorularDegisti.next(this.secilmisSorular);
  }
  aktiSoruOlarakIsaretle(id) {
    if (id !== null && this.sorular) {
      this.aktifSoru = this.sorular.find(soru => {
        return soru.soruId === id;
      });
    }

    this.onAktifSoruDegisti.next(this.aktifSoru);
  }


}
