
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
import { SoruBirimItem, DersItem, KonuItem, DersGrupItem, ProgramDonemItem, SoruProgramItem } from '../models/birim-program-donem-ders';
import { SorularEffectsService } from '../soru-store/effects/sorular-effects.service';
import { SbMesajService } from '../../../../../core/services/sb-mesaj.service';
import { SoruDepoVeriService } from '../soru-store/helpers/soru-depo-veri.service';
import { CoktanSecmeliSoruComponent } from '../coktan-secmeli-soru/coktan-secmeli-soru.component';
import { SoruYarat } from '../models/soru';
import { SorularService } from '../sorular.service';
import { DialMenuModel } from '../../../../../models/dial-menu-model';
import { SbNavitaionItem } from '../../../../../models/sb-navigation';
import { SoruDepoResolverService } from '../soru-depo-resolver.service';
import { ResolveInfo } from '../../../../../models/resolve-model';


@Component({
  selector: 'fuse-sorular-side-nav',
  templateUrl: './sorular-side-nav.component.html',
  styleUrls: ['./sorular-side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SorularSideNavComponent implements OnInit, AfterViewChecked {

  routerState: any;
  bilgi: ResolveInfo;
  // birimSorulariGorunsun = !this.program 
  //  && !this.donem 
  //  && !this.dersGrubu 
  //  && !this.ders 
  //  && !this.konu;
  dialogRef: any;
  navigation: any;

  yenimenuItems: DialMenuModel[] = [
    { name: 'basit', icon: 'add', title: 'Yeni soru', arkaplanrengi: '#424A5E', renk: '#BD3D4B' },
    { name: 'iliskili', icon: 'attachment', title: 'Yeni ilişkili soru', arkaplanrengi: '#CCB8C7', renk: '#BD3D4B' }
  ];

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
    private resolverBilgi: SoruDepoResolverService,
    private router: Router) {
    this.store.select(fromRootStore.getRouterState).subscribe(routerState => {
      if (routerState) {
        this.routerState = routerState.state;
        if (routerState.state.params['bilgi']) {
          this.bilgi = this.resolverBilgi.bilgiAl(routerState.state.params['bilgi'], 'soru');

        }
      }
    });
    this.birimler$ = this.store.select(fromSorularStore.getBirimlerArr);
    this.seciliBirim$ = this.store.select(fromSorularStore.getAktifBirim);
  }
  ngOnInit() {
    this.seciliBirim$.subscribe(birim => {
      this._seciliBirim = birim;
      this.navigation = this.sorularService.createNavigationTree(birim);
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
    this.resolverBilgi.sil('soru');
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
        this.router.navigate([`sorudeposu/ders/${ders.dersId}/konu/${ders.konulari[0].konuId}`]);
      } else {
        this.store.dispatch(new fromSorularStore.SecAktifKonu(null));
        this.router.navigate(['sorudeposu/ders/', ders.dersId]);
      }

    } else {
      this.store.dispatch(new fromSorularStore.SecAktifDers(null));
      this.store.dispatch(new fromSorularStore.SecAktifKonu(null));
      this.store.dispatch(new fromSorularStore.GetSorular());
      this.router.navigate(['sorudeposu/']);
    }

  }

  composeDialog() {
    const konu = this.bilgi.sayfaBilgisi.hasOwnProperty('konuId') ? this.bilgi.sayfaBilgisi : null;
    const ders = konu ? this.sorularService.dersBul(konu.dersNo) : this.bilgi.sayfaBilgisi;
    if (!ders) {
      this.mesajService.hataStr('Ders bilgisi alınamadığı için yeni soru ekranı açılamadı.');
      return;
    }
    if (ders && ders.konulari.length > 0 && !konu) {
      this.mesajService.goster(`${ders.dersAdi} adlı dersin konuları mevcut. Lütfen bir konu seçin.`);
      return;
    }
    let en = '70vw';
    let boy = '90vh';
    let sinif = 'popup-masaustu';
    if (this.platform.ANDROID || this.platform.IOS) {
      en = '99vw';
      boy = '99vh';
      sinif = 'popup-mobil';
    }

    this.dialogRef = this.dialog.open(CoktanSecmeliSoruComponent,
      {
        data: {
          ders: ders,
          konu: konu,
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
  yeniSoruYarat(islem) {
    switch (islem) {
      case 'iliskili':
        const aktifKonu: KonuItem = this.bilgi.sayfaBilgisi.hasOwnProperty('konuId') ? this.bilgi.sayfaBilgisi : null;
        const aktifDers: DersItem = aktifKonu ? this.sorularService.dersBul(aktifKonu.dersNo) : this.bilgi.sayfaBilgisi;
        if (aktifKonu) {
          this.router.navigate([`sorudeposu/iliskilisoru/ders/${aktifDers.dersId}/konu/${aktifKonu.konuId}`]);
        } else {
          this.router.navigate([`sorudeposu/iliskilisoru/ders/${aktifDers.dersId}`]);
        }
        break;

      default:
        this.composeDialog();
        break;
    }
  }

  programSorulariniGoster(program: SoruProgramItem) {

    const bilgi = this.resolverBilgi.bilgiKoy(program, 'soru');
    this.router.navigate(['sorudeposu/programsorulari/', bilgi.id]);
  }
  donemSorulariniGoster(donem: ProgramDonemItem) {

    const bilgi = this.resolverBilgi.bilgiKoy(donem, 'soru');
    this.router.navigate(['sorudeposu/donemsorulari/', bilgi.id]);
  }
  dersGrubuSorulariniGoster(dersgrubu: DersGrupItem) {

    const bilgi = this.resolverBilgi.bilgiKoy(dersgrubu, 'soru');
    this.router.navigate(['sorudeposu/dersgrubusorulari/', bilgi.id]);
  }
  dersinSorulariniGoster(ders: DersItem) {

    const bilgi = this.resolverBilgi.bilgiKoy(ders, 'soru');
    this.router.navigate(['sorudeposu/dersinsorulari/', bilgi.id]);
  }
  konununSorulariniGoster(konu: KonuItem) {

    const bilgi = this.resolverBilgi.bilgiKoy(konu, 'soru');
    this.router.navigate(['sorudeposu/konusorulari/', bilgi.id]);
  }
  yeniSoruEkelenebilirmi() {
    if (this.bilgi === null || this.bilgi === undefined) {
      return false;
    }
    return this.bilgi.sayfaBilgisi.hasOwnProperty('konuId') || this.bilgi.sayfaBilgisi.hasOwnProperty('dersId');
  }
}
