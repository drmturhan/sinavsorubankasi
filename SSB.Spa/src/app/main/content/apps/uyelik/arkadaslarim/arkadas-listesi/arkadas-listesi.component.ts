import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';
import { MatTableDataSource, MatPaginator, MatPaginatorIntl, MatSort, MatTab } from '@angular/material';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { fuseAnimations } from '@fuse/animations';
import { ArkadaslikTeklif, ArkadaslikSorgusu } from '../../../../../../models/arkadaslik-teklif';
import { ListeSonuc, KayitSonuc } from '../../../../../../models/sonuclar';
import { State } from '../../../../../../store';
import { UyelikService } from '../../uyelik.service';
import { SbMesajService } from '../../../../../../core/services/sb-mesaj.service';

import * as fromArkadaslarimReducer from '../../../../../../store/reducers/arkadaslar.reducer';
import * as fromArkadaslarimActions from '../../../../../../store/actions/arkadaslar.actions';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'fuse-arkadas-listesi',
  templateUrl: './arkadas-listesi.component.html',
  styleUrls: ['./arkadas-listesi.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ArkadasListesiComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() kullaniciNo: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: MatTableDataSource<ArkadaslikTeklif> = new MatTableDataSource();
  onArkadaslarDegisti: Subscription;

  arkadasliklar: ListeSonuc<ArkadaslikTeklif>;
  secilenArkadaslar: ArkadaslikTeklif[];
  onSecimDegisti: Subscription;
  checkboxes: {};
  sorgu: ArkadaslikSorgusu;
  gosterilenKolonlar = ['avatar', 'ad', 'eposta', 'telefon', 'durum', 'iptal', 'butonlar'];
  mobilplatform: boolean;
  constructor(
    private store: Store<State>,
    private uyelikService: UyelikService,
    private mesajService: SbMesajService,
    private platform: Platform) {
    this.mobilplatform = this.platform.ANDROID || this.platform.IOS;
    if (this.mobilplatform) {
      this.gosterilenKolonlar = ['avatar', 'ad', 'eposta', 'telefon', 'durum', 'iptal', 'butonlar'];
    } else {
      this.gosterilenKolonlar = ['checkbox', 'avatar', 'ad', 'eposta', 'telefon', 'durum', 'iptal', 'butonlar'];
    }

    this.dataSource.paginator = this.paginator;
    this.onArkadaslarDegisti = this.store.select(fromArkadaslarimReducer.getArkadaslikTeklifleri).subscribe(listeSonuc => {
      if (listeSonuc && listeSonuc.arkadaslarim) {
        this.arkadasliklar = listeSonuc.arkadaslarim;
        // this.paginator.hidePageSize = true;
        this.dataSource.data = this.arkadasliklar.donenListe;
        this.checkboxes = {};
        this.arkadasliklar.donenListe.map(arkadaslik => {
          this.checkboxes[arkadaslik.id] = false;
        });

      }

    });
    this.store.select(fromArkadaslarimReducer.getArkadaslikSorgusu).subscribe(sorgu => {
      this.sorgu = sorgu;
    });


    this.onSecimDegisti =
      this.uyelikService.onArkadaslikSecimiDegisti.subscribe(secilenArkadaslar => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = secilenArkadaslar.includes(id);
        }
        this.secilenArkadaslar = secilenArkadaslar;
      });
  }

  ngOnInit() {

  }
  ngAfterViewInit() {


  }
  sayfaDegisti(bilgi) {

    const yeniSorgu = Object.assign({}, this.sorgu, { sayfa: bilgi.pageIndex + 1, sayfaBuyuklugu: bilgi.pageSize });
    this.store.dispatch(new fromArkadaslarimActions.ArkadaslarSorguDegistir(yeniSorgu));
  }
  ngOnDestroy() {
    this.onArkadaslarDegisti.unsubscribe();
    this.onSecimDegisti.unsubscribe();

  }
  secimDegisti(teklif) {
    this.uyelikService.toggleSelectedTeklif(teklif.id);
  }
  deleteArkadaslik(teklif: ArkadaslikTeklif) {
    this.uyelikService.arkadaslikTeklifiniIptalEt(teklif.teklifEden.id, teklif.teklifEdilen.id).subscribe(sonuc => {
      this.sonucIslemleri(sonuc);
    },
      hata => this.mesajService.hataStr(hata.error));
  }


  degistir(teklif) {
    this.uyelikService.toggleSelectedTeklif(teklif.id);
  }
  kabulEt(teklif: ArkadaslikTeklif) {
    this.kararVer(teklif.teklifEden.id, teklif.teklifEdilen.id, true);
  }
  reddet(teklif) {
    this.kararVer(teklif.teklifEden.id, teklif.teklifEdilen.id, false);
  }
  private kararVer(isteyen: number, cevaplayan: number, karar: boolean) {
    this.uyelikService.arkadaslikTeklifineKararVer(isteyen, cevaplayan, karar).subscribe(sonuc => {
      this.sonucIslemleri(sonuc);
    },
      hata => this.mesajService.hataStr(hata.error));
  }
  geriAl(teklif) {
    this.uyelikService.arkadaslikteklifEt(this.kullaniciNo, teklif.arkadas.id).subscribe(sonuc => {
      this.sonucIslemleri(sonuc);
    },
      hata => this.mesajService.hataStr(hata.error));
  }
  sonucIslemleri(sonuc: KayitSonuc<ArkadaslikTeklif>) {
    if (sonuc.basarili) {
      this.store.dispatch(new fromArkadaslarimActions.ArkadaslarListesiDegisti(sonuc.donenNesne));
      this.mesajService.goster(sonuc.mesajlar[0]);
    }
    else {
      this.mesajService.hatalar(sonuc.hatalar);
    }
  }
}
export class MatPaginatorIntlTr extends MatPaginatorIntl {
  itemsPerPageLabel = 'Sayfa büyüklüğü';
  nextPageLabel = 'Sonraki sayfa';
  previousPageLabel = 'Önceki sayfa';
  firstPageLabel = 'İlk sayfa';
  lastPageLabel = 'Son sayfa';
  getRangeLabel = function (page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return '0 / ' + length;
    }
    length = Math.max(length, 0);

    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' / ' + length;
  };

}
