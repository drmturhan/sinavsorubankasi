import { Component, OnInit, Input, HostBinding, OnDestroy } from '@angular/core';
import { SoruListe, SoruDegistir } from '../../../models/soru';
import { Subscription } from 'rxjs';
import { IliskiliSoruService } from '../../iliskili-soru.service';
import * as fromRootStore from '../../../../../../../store/index';
import { Store } from '@ngrx/store';
import { SorularService } from '../../../sorular.service';
import { KayitSonuc } from '../../../../../../../models/sonuclar';
import { SbMesajService } from '../../../../../../../core/services/sb-mesaj.service';
import { Platform } from '@angular/cdk/platform';
import { MatDialog } from '@angular/material';
import { CoktanSecmeliSoruComponent } from '../../../coktan-secmeli-soru/coktan-secmeli-soru.component';
import { FormGroup } from '@angular/forms';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'fuse-iliskili-soru-item',
  templateUrl: './iliskili-soru-item.component.html',
  styleUrls: ['./iliskili-soru-item.component.scss']
})
export class IliskiliSoruItemComponent implements OnInit, OnDestroy {

  @Input() soru: SoruListe;

  @HostBinding('class.selected') selected: boolean;

  onSecilmisSorularDegisti: Subscription;

  dialogRef: any;
  constructor(
    private uiStore: Store<fromRootStore.UIState>,
    private service: IliskiliSoruService,
    private sorularService: SorularService,
    private mesajService: SbMesajService,
    private platform: Platform,
    public dialog: MatDialog,

  ) { }

  ngOnInit() {
    this.soru = new SoruListe(this.soru);

    this.onSecilmisSorularDegisti =
      this.service.onSecilmisSorularDegisti
        .subscribe(secilmisSorular => {
          const benVarmiyim = secilmisSorular.filter(ss => ss.soruId === this.soru.soruId);
          this.selected = benVarmiyim && benVarmiyim.length === 1 ? true : false;
        });


  }
  ngOnDestroy() {
    this.onSecilmisSorularDegisti.unsubscribe();
  }
  onSelectedChange() {
    this.service.toggleSoruSec(this.soru.soruId);
  }

  toggleStar(event) {
    event.stopPropagation();

    // this.soru.toggleStar();

    // this.service.updateMail(this.soru);
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

        const ders = this.sorularService.dersBul(sonuc.donenNesne.dersNo);
        const konu = sonuc.donenNesne.konuNo > 0 && ders ? this.sorularService.getKonu(ders, this.service.bilgi.sayfaBilgisi.konuNo) : null;

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
  soruyuKapat() {

  }
  soruyuAc() {

  }
  favoriToogle() {
    if (this.soru.favori) {
      this.soruyuSiradanYap();
    } else { this.soruyuFavoriYap(); }
  }
  soruyuFavoriYap() {

  }
  soruyuSiradanYap() {

  }
  soruyuSilindiYap() {
    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      width: '600px',
      height: '400',
      data: {
        onaybasligi: 'Silme onayı',
        onaymesaji: '<p>Silinsin derseniz BU SORU sistemden tamamen silinecek!</p> Soru silinsin mi?',
        olumluButonYazisi: 'Silinsin',
        olumsuzButonYazisi: 'Vazgeçtim'
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {

      }
    });

  }
}
