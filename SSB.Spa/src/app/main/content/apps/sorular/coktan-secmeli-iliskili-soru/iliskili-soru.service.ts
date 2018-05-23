import { Injectable } from '@angular/core';
import { SoruListe, SoruKokuListe } from '../models/soru';
import { BehaviorSubject } from 'rxjs';

import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

import * as fromSoruStore from '../soru-store/index';
import { Store } from '@ngrx/store';
import { SoruTipItem, SoruZorlukItem, SoruBilisselDuzeyItem } from '../models/birim-program-donem-ders';
import { HttpClient } from '@angular/common/http';
import { FuseUtils } from '@fuse/utils';
import { environment } from 'environments/environment';
import { KayitSonuc } from '../../../../../models/sonuclar';
import { SbMesajService } from '../../../../../core/services/sb-mesaj.service';

@Injectable({
  providedIn: 'root'
})
export class IliskiliSoruService {

  baseUrl = environment.apiUrl;
  soruKokleriUrl = 'sorukokleri';

  soruKokuNo: number;

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
    private soruStore: Store<fromSoruStore.SoruDepoAppState>,
    private mesajService: SbMesajService) {
    this.secilmisSorular = [];
    this.soruTipleri$ = this.soruStore.select(fromSoruStore.getSoruTipleri);
    this.soruZorluklari$ = this.soruStore.select(fromSoruStore.getSoruZorluklari);
    this.bilisselDuzeyler$ = this.soruStore.select(fromSoruStore.getBilisselDuzeyler);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    if (route.params && route.params['soruKokuNo']) {
      this.routeParams = route.params;
      this.soruKokuNo = route.params['soruKokuNo'];
    }

    return new Promise((resolve, reject) => {
      Promise.all([
        this.getSorular()
      ]).then(
        () => {
          if (this.routeParams.soruNo) {
            this.aktiSoruyuOlarakIsaretle(this.routeParams.soruNo);
          }
          else {
            this.aktiSoruyuOlarakIsaretle(null);
          }

          this.onAramaCumlesiDegisti.subscribe(searchText => {
            if (searchText !== '') {
              this.searchText = searchText;
              this.getSorular();
            }
            else {
              this.searchText = searchText;
              this.getSorular();
            }
          });

          resolve();
        },
        reject
      );
    });
  }

  getSorular(): Promise<SoruListe[]> {
    return this.getSorularBySoruKoku(this.soruKokuNo);
  }

  getSorularBySoruKoku(soruKokuNo: number): Promise<SoruListe[]> {
    return new Promise((resolve, reject) => {

      const adres = `${this.baseUrl}/${this.soruKokleriUrl}/`;
      this.http.get<KayitSonuc<SoruKokuListe>>(adres + soruKokuNo)
        .subscribe((sonuc: KayitSonuc<SoruKokuListe>) => {
          if (sonuc.basarili) {
            this.soruKokuSonuc = sonuc;
            this.sorular = sonuc.donenNesne.sorulari.map(soruListe => {
              return new SoruListe(soruListe);
            });

            this.sorular = FuseUtils.filterArrayByString(this.sorular, this.searchText);

            this.onSorularDegisti.next(this.sorular);
            resolve(this.sorular);
          }
          else {
            resolve([]);
          }
        }, reject);
    });
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
    this.onSecilmisSorularDegisti.next(this.sorular);
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
  aktiSoruyuOlarakIsaretle(id) {
    this.aktifSoru = this.sorular.find(soru => {
      return soru.soruId === id;
    });

    this.onAktifSoruDegisti.next(this.aktifSoru);
  }
  updateMail(soru) {
    return new Promise((resolve, reject) => {

      this.http.post('api/mail-mails/' + soru.soruId, { ...soru })
        .subscribe(response => {

          this.getSorular().then(sorular => {

            if (sorular && this.aktifSoru) {
              this.aktiSoruyuOlarakIsaretle(this.aktifSoru.soruId);
            }

            resolve(sorular);

          }, reject);
        });
    });
  }
}
