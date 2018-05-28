import { Component, OnInit, OnDestroy } from '@angular/core';
import { SoruListe, SoruDegistir } from '../../models/soru';
import { Subscription } from 'rxjs';
import { IliskiliSoruService } from '../iliskili-soru.service';
import { fuseAnimations } from '@fuse/animations';
import * as fromRootStore from '../../../../../../store/index';
import * as fromSoruStore from '../../soru-store/index';
import { DersItem, KonuItem } from '../../models/birim-program-donem-ders';
import { SorularService } from '../../sorular.service';
import { MatDialog } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Store } from '@ngrx/store';
import { KayitSonuc } from '../../../../../../models/sonuclar';
import { SbMesajService } from '../../../../../../core/services/sb-mesaj.service';
import { Platform } from '@angular/cdk/platform';
import { CoktanSecmeliSoruComponent } from '../../coktan-secmeli-soru/coktan-secmeli-soru.component';
import { FormGroup } from '@angular/forms';
import { SoruOnizlemeComponent } from '../../soru-onizleme/soru-onizleme.component';

@Component({
  selector: 'fuse-iliskili-soru-detay',
  templateUrl: './iliskili-soru-detay.component.html',
  styleUrls: ['./iliskili-soru-detay.component.scss'],
  animations: fuseAnimations
})
export class IliskiliSoruDetayComponent implements OnInit, OnDestroy {

  soru: SoruListe;
  ayrintiyiGoster = false;
  onAktifSoruDegisti: Subscription;

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
      this._dersKonuAdi = this.sorularService.dersKonuAdiniAl(this.soru.dersAdi, this.soru.konuAdi);
    }
    return this._dersKonuAdi;
  }

  dialogRef: any;
  constructor(
    private uiStore: Store<fromRootStore.UIState>,
    private soruStore: Store<fromSoruStore.SoruDepoAppState>,
    public dialog: MatDialog,
    private platform: Platform,
    public sorularService: SorularService,
    private mesajService: SbMesajService,
    private service: IliskiliSoruService
  ) { }

  ngOnInit() {
    this.onAktifSoruDegisti =
      this.service.onAktifSoruDegisti
        .subscribe(gelenSoru => {
          this.soru = gelenSoru;
          if (gelenSoru && this.soru.baslangic) {
            if (this.soru.bitis) {
              this.bitisTarihiGecerli = this.soru.baslangic < this.soru.bitis;
            } else {
              this.bitisTarihiGecerli = false;
            }
          }
        });
  }
  detayToogle() {
    this.ayrintiyiGoster = !this.ayrintiyiGoster;
  }

  ngOnDestroy() {
    this.onAktifSoruDegisti.unsubscribe();
  }
  toggleStar(event) {
    event.stopPropagation();

    // this.soru.toggleStar();

    // this.service.updateMail(this.mail);
  }
  soruDegistirmeEkrani() {

    this.uiStore.dispatch(new fromRootStore.StartLoading());
    const degisecekSoru = this.sorularService.getSoruById(this.soru.soruId)
      .subscribe((sonuc: KayitSonuc<SoruDegistir>) => {
        this.uiStore.dispatch(new fromRootStore.StopLoading());
        if (!sonuc.basarili) {
          this.mesajService.hatalar(sonuc.hatalar);
          return;
        }

        const ders = this.sorularService.dersBul(this.soru.dersNo);
        const konu = this.soru.konuNo > 0 && ders ? this.sorularService.getKonu(ders, this.soru.konuNo) : null;

        let en = '80vw';
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
              ders: ders,
              konu: konu,
              degisecekSoru: sonuc.donenNesne
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
            if (!formData.dirty) {
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
        hata => { this.mesajService.hataStr('Soru bilgisi alınamadı!'); },
        () => this.uiStore.dispatch(new fromRootStore.StopLoading()));
  }
  soruDegisiklikKaydet(formData: FormGroup, degisecekSoru: SoruDegistir) {
    this.sorularService.formuNesneyeCevirKaydet(formData, degisecekSoru);
  }

  soruyuAcKapat() {
    if (this.soru.aktif === true) {
      this.soruyuKapat();
    } else { this.soruyuAc(); }
  }

  soruyuKapat() {
    this.soruStore.dispatch(new fromSoruStore.SoruAcKapa({ soruNo: this.soru.soruId, ac: false }));
  }
  soruyuAc() {
    this.soruStore.dispatch(new fromSoruStore.SoruAcKapa({ soruNo: this.soru.soruId, ac: true }));
  }
  favoriToogle() {
    if (this.soru.favori) {
      this.soruyuSiradanYap();
    } else { this.soruyuFavoriYap(); }
  }
  soruyuFavoriYap() {
    this.soruStore.dispatch(new fromSoruStore.SoruFavoriDegistir({ soruNo: this.soru.soruId, favori: true }));
    
  }
  soruyuSiradanYap() {
    this.soruStore.dispatch(new fromSoruStore.SoruFavoriDegistir({ soruNo: this.soru.soruId, favori: false }));
    

  }
  soruyuSilindiYap() {

    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      width: '600px',
      height: '300px',
      data: {
        onaybasligi: 'Silme onayı',
        onaymesaji: '<p>Silinsin derseniz BU SORU sistemden tamamen silinecek!</p> Soru silinsin mi?',
        olumluButonYazisi: 'Silinsin',
        olumsuzButonYazisi: 'Vazgeçtim'
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.soruStore.dispatch(new fromSoruStore.SoruSilindiIsaretle([this.soru.soruId.toString()]));
      }
    });
  }
  soruOnIzlemeGoster() {

    const ders: DersItem = this.sorularService.dersBul(this.soru.dersNo);
    let konu: KonuItem;
    if (this.soru.konuNo) {
      konu = this.sorularService.getKonu(this.ders, this.soru.konuNo);
    }

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
        ders: ders,
        konu: konu
      }
    });
  }
}
