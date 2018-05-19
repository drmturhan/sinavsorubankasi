
import { Component, OnInit, AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import * as fromSorularStore from '../soru-store/index';
import * as fromRootStore from '../../../../../store';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { FormGroup } from '@angular/forms';

import { Platform } from '@angular/cdk/platform';
import { SoruBirimItem, DersItem } from '../models/birim-program-donem-ders';
import { SorularEffectsService } from '../soru-store/effects/sorular-effects.service';
import { SbMesajService } from '../../../../../core/services/sb-mesaj.service';
import { SoruDepoVeriService } from '../soru-store/helpers/soru-depo-veri.service';
import { CoktanSecmeliSoruComponent } from '../coktan-secmeli-soru/coktan-secmeli-soru.component';
import { SoruYarat } from '../models/soru';
import { SorularService } from '../sorular.service';


@Component({
  selector: 'fuse-sorular-side-nav',
  templateUrl: './sorular-side-nav.component.html',
  styleUrls: ['./sorular-side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SorularSideNavComponent implements OnInit, AfterViewChecked {

  routerState: any;
  dersNo: number = null;
  konuNo: number = null;
  dialogRef: any;

  private _seciliBirim: SoruBirimItem;

  get seciliBirim(): SoruBirimItem {
    return this._seciliBirim;
  }

  set seciliBirim(value: SoruBirimItem) {
    if (this._seciliBirim !== value) {
      this._seciliBirim = value;
      this.birimSecimiDegisti();
    }
  }
  seciliBirim$: Observable<SoruBirimItem>;
  birimler$: Observable<SoruBirimItem[]>;
  filters$: Observable<any>;
  cepBilgileri$: Observable<any>;
  constructor(
    private effectsService: SorularEffectsService,
    private sorularService: SorularService,
    public platform: Platform,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private store: Store<fromRootStore.State>,
    private mesajService: SbMesajService,
    private helperService: SoruDepoVeriService,
    private router: Router) {
    this.store.select(fromRootStore.getRouterState).subscribe(routerState => {
      if (routerState) {
        this.routerState = routerState.state;
        const handle: any[] = this.effectsService.soruHandleYarat(this.routerState);
        handle.forEach(h => {
          if (h.id === 'dersNo') {
            this.dersNo = h.value;
          }
          if (h.id === 'konuNo') {
            this.konuNo = h.value;
          }
        });
      }
    });
    this.birimler$ = this.store.select(fromSorularStore.getBirimlerArr);
    this.seciliBirim$ = this.store.select(fromSorularStore.getAktifBirim);
  }
  ngOnInit() {
    this.seciliBirim$.subscribe(birim => {
      this._seciliBirim = birim;
    });

  }
  ngAfterViewChecked(): void {
    if (this._seciliBirim === null) {
      setTimeout(() => {
        this.store.dispatch(new fromSorularStore.IlkBirimiSec(false));
        this.store.dispatch(new fromSorularStore.GetSorular());
      });

    }
    this.refresh();
  }
  sayfayiTazele() {
    this.store.dispatch(new fromSorularStore.BirimleriSifirla());
    this.store.dispatch(new fromSorularStore.GetBirimler([]));
    this.store.dispatch(new fromSorularStore.SorulariSifirla());
    this.store.dispatch(new fromSorularStore.GetSorular());

  }

  private birimSecimiDegisti() {
    const value: SoruBirimItem = this.seciliBirim;
    this.store.dispatch(new fromSorularStore.SecAktifBirim(value));
    if (value === null) { return; }
    let ders: DersItem = null;
    if (value.programlari && value.programlari.length > 0) {
      if (value.programlari[0].donemleri && value.programlari[0].donemleri.length > 0) {

        if (value.programlari[0].donemleri[0].dersGruplari
          && value.programlari[0].donemleri[0].dersGruplari.length > 0
          && value.programlari[0].donemleri[0].dersGruplari[0].dersleri.length > 0) {
          ders = value.programlari[0].donemleri && value.programlari[0].donemleri[0].dersGruplari[0].dersleri[0];
        }
      }
    }
    if (ders != null) {
      this.store.dispatch(new fromSorularStore.SecAktifDers(ders));
      this.store.dispatch(new fromSorularStore.GetSorular());
      if (ders.konulari.length > 0) {
        this.store.dispatch(new fromSorularStore.SecAktifKonu({ ders: ders, konu: ders.konulari[0] }));
        this.router.navigate([`moduller/sorudeposu/ders/${ders.dersId}/konu/${ders.konulari[0].konuId}`]);
      } else {
        this.store.dispatch(new fromSorularStore.SecAktifKonu(null));
        this.router.navigate(['moduller/sorudeposu/ders/', ders.dersId]);
      }

    } else {
      this.store.dispatch(new fromSorularStore.SecAktifDers(null));
      this.store.dispatch(new fromSorularStore.SecAktifKonu(null));
      this.store.dispatch(new fromSorularStore.GetSorular());
      this.router.navigate(['moduller/sorudeposu/']);
    }

  }

  composeDialog() {
    const ders = this.sorularService.dersBul(this.dersNo);
    if (!ders) {
      this.mesajService.hataStr('Ders bilgisi alınamadığı için yeni soru ekranı açılamadı.');
      return;
    }
    if (ders && ders.konulari.length > 0 && !(this.konuNo && this.konuNo > 0)) {
      this.mesajService.goster(`${ders.dersAdi} adlı dersin konuları mevcut. Lütfen bir konu seçin.`);
      return;
    }
    let en = '70vw';
    let boy = '90vh';
    let sinif = 'popup-masaustu';
    if (this.platform.ANDROID || this.platform.IOS) {
      en = '99vw';
      boy = '95vh';
      sinif = 'popup-mobil';
    }

    this.dialogRef = this.dialog.open(CoktanSecmeliSoruComponent,
      {
        data: {
          dersNo: this.dersNo,
          konuNo: this.konuNo,
          ders: ders,
          yeni: true
        },
        height: boy,
        width: en,
        panelClass: sinif
      });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
        const actionType: string = response[0];
        const formData: FormGroup = response[1];
        const degisecekSoru: SoruYarat = response[2];
        switch (actionType) {
          /**
           * Kaydete tıklandı
           */
          case 'kaydet':
            if (degisecekSoru) {
              this.yeniSoruEkle(formData, ders);
            }
            break;

          /**
           * Kapata tıklandı
           */
          case 'kapat':
            break;
        }
      });
  }

  yeniSoruEkle(formData: FormGroup, ders: DersItem) {
    const yeniSoru: SoruYarat = Object.assign({}, formData.getRawValue());
    yeniSoru.tekDogruluSecenekleri = formData.get('secenekler').value;
    yeniSoru.kabulEdilebilirlikIndeksi = formData.get('kabulEdilebilirlikIndeksi').value;
    yeniSoru.baslangic = formData.get('gecerlilik.baslangic').value;
    yeniSoru.bitis = formData.get('gecerlilik.bitis').value;
    if (yeniSoru.dersNo > 0) {
      if (ders != null) {
        yeniSoru.birimNo = ders.birimNo;
        yeniSoru.programNo = ders.programNo;
        yeniSoru.donemNo = ders.donemNo;
        yeniSoru.dersGrubuNo = ders.dersGrubuNo;
      }
    }
    this.store.dispatch(new fromSorularStore.UpdateSoru(yeniSoru));

  }
  refresh() {
    this.cd.markForCheck();
  }
}
