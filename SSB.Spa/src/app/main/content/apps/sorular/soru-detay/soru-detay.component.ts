import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';

import { SoruListe, SoruDegistir } from '../models/soru';
import { Observable } from 'rxjs/Observable';
import { SorularService } from '../sorular.service';
import { MatDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';

import { Platform } from '@angular/cdk/platform';
import * as fromUIActions from '../../../../../store/actions/ui.actions';
import * as fromStore from '../soru-store/index';
import { DersItem, KonuItem } from '../models/birim-program-donem-ders';
import { SbMesajService } from '../../../../../core/services/sb-mesaj.service';
import { CoktanSecmeliSoruComponent } from '../coktan-secmeli-soru/coktan-secmeli-soru.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { KayitSonuc } from '../../../../../models/sonuclar';
import { SoruOnizlemeComponent } from '../soru-onizleme/soru-onizleme.component';

@Component({
  selector: 'fuse-soru-detay',
  templateUrl: './soru-detay.component.html',
  styleUrls: ['./soru-detay.component.scss']
})
export class SoruDetayComponent implements OnInit, OnChanges {


  labels$: Observable<any>;
  @Input('soru') soru: SoruListe;
  detayGoster = false;

  bitisTarihiGecerli: boolean;

  private ders: DersItem;
  public get Ders(): DersItem {
    if (this.soru && !this.ders) {
      this.ders = this.sorularService.dersBul(this.soru.dersNo);
      this._dersKonuAdi = undefined;
    }
    return this.ders;
  }


  private _dersKonuAdi: string;
  public get dersKonuAdi(): string {
    if (!this._dersKonuAdi) {
      this._dersKonuAdi = this.dersKonuAdiniAl();
    }
    return this._dersKonuAdi;
  }



  dialogRef: any;
  constructor(
    public dialog: MatDialog,
    private sorularService: SorularService,
    private store: Store<fromStore.SoruDepoAppState>,
    private mesajService: SbMesajService,
    public platform: Platform,
  ) {
    // this.labels$ = this.store.select(fromStore.getLabelsArr);
  }

  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges): void {

    if (this.soru) {
      if (this.soru.baslangic) {
        if (this.soru.bitis) {
          this.bitisTarihiGecerli = this.soru.baslangic < this.soru.bitis;
        } else {
          this.bitisTarihiGecerli = false;
        }
      }
    }
  }
  detayToogle() {
    this.detayGoster = !this.detayGoster;
  }
  dersKonuAdiniAl(): string | null {
    let sonuc: string = null;
    if (this.Ders) {
      let konu: KonuItem = null;
      if (this.soru.konuNo) {
        konu = this.getKonu(this.soru.konuNo);
      }
      if (konu) {
        sonuc = `${this.ders.dersAdi} : ${konu.konuAdi}`;
      } else {
        return this.ders.dersAdi;
      }
    }
    return sonuc;
  }
  getKonu(konuNo): KonuItem {
    if (this.Ders && konuNo > 0) {
      for (let index = 0; index < this.ders.konulari.length; index++) {
        const konu = this.ders.konulari[index];
        // tslint:disable-next-line:triple-equals
        if (konu.konuId == konuNo) {
          return konu;
        }
      }
    }
    return null;
  }

  soruyuDegistir() {
    this.store.dispatch(new fromUIActions.StartLoading());
    const degisecekSoru = this.sorularService.getSoruById(this.soru.soruId).subscribe((sonuc: KayitSonuc<SoruDegistir>) => {
      this.store.dispatch(new fromUIActions.StopLoading());
      if (!sonuc.basarili) {
        this.mesajService.hatalar(sonuc.hatalar);
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
          data: { dersNo: this.soru.dersNo, konuNo: this.soru.konuNo, ders: this.ders, degisecekSoru: sonuc.donenNesne },
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
          if (formData.pristine) {
            console.log('Kaydetmeye gerek yok!');
            return;
          }
          const kaydedilecekSoru: SoruDegistir = response[2];
          switch (actionType) {
            /**
             * Kaydete tıklandı
             */
            case 'kaydet':
              this.soruDegisiklikKaydet(formData, kaydedilecekSoru);
              break;

            /**
             * Kapata tıklandı
             */
            case 'kapat':
              break;
          }
        });

    },
      hata => {
        this.store.dispatch(new fromUIActions.StopLoading());
        this.mesajService.hataStr('Soru bilgisi alınamadı!');
      });

  }
  soruDegisiklikKaydet(formData: FormGroup, degisecekSoru: SoruDegistir) {

    const kaydedilecekSoru = Object.assign({}, degisecekSoru, formData.getRawValue());
    kaydedilecekSoru.tekDogruluSecenekleri = formData.get('secenekler').value;
    this.store.dispatch(new fromStore.UpdateSoru(kaydedilecekSoru));

  }
  soruyuAcKapat() {
    if (this.soru.aktif === true) {
      this.soruyuKapat();
    } else { this.soruyuAc(); }
  }
  soruyuKapat() {
    this.store.dispatch(new fromStore.SoruAcKapa({ soruNo: this.soru.soruId, ac: false }));
  }
  soruyuAc() {
    this.store.dispatch(new fromStore.SoruAcKapa({ soruNo: this.soru.soruId, ac: true }));
  }
  favoriToogle() {
    if (this.soru.favori) {
      this.soruyuSiradanYap();
    } else { this.soruyuFavoriYap(); }
  }
  soruyuFavoriYap() {
    this.store.dispatch(new fromStore.SoruFavoriDegistir({ soruNo: this.soru.soruId, favori: true }));
  }
  soruyuSiradanYap() {
    this.store.dispatch(new fromStore.SoruFavoriDegistir({ soruNo: this.soru.soruId, favori: false }));
  }
  soruyuSilindiYap() {

    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      width: '600px',
      height: '400px',
      data: {
        onaybasligi: 'Silme onayı',
        onaymesaji: '<p>Silinsin derseniz BU SORU sistemden tamamen silinecek!</p> Soru silinsin mi?',
        olumluButonYazisi: 'Silinsin',
        olumsuzButonYazisi: 'Vazgeçtim'
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.store.dispatch(new fromStore.SoruSilindiIsaretle(this.soru.soruId));
      }
    });
  }

  soruOnIzlemeGoster() {

    let en = '100vw';
    let boy = '10 0vh';
    let sinif = 'popup-masaustu';
    if (this.platform.ANDROID || this.platform.IOS) {
      en = '600px';
      boy = '960px';
      sinif = 'popup-mobil';
    }
    const dialogRef = this.dialog.open(SoruOnizlemeComponent, {
      height: boy,
      width: en,
      panelClass: sinif,
      data: {
        soru: this.soru,
        ders: this.ders,
        konu: this.getKonu(this.soru.konuNo)
      }
    });
  }
}
