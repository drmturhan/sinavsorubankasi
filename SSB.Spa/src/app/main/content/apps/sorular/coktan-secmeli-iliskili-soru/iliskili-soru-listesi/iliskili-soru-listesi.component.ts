import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { SoruListe, SoruDegistir, SoruYarat, SoruKokuListe, SoruKokuYarat, SoruKokuDuzenle } from '../../models/soru';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IliskiliSoruService } from '../iliskili-soru.service';
import { fuseAnimations } from '@fuse/animations';
import { Store } from '@ngrx/store';
import * as fromRootStore from '../../../../../../store/index';
import * as fromSorularStore from '../../soru-store/index';
import { SorularService } from '../../sorular.service';
import { KayitSonuc } from '../../../../../../models/sonuclar';
import { SbMesajService } from '../../../../../../core/services/sb-mesaj.service';
import { Platform } from '@angular/cdk/platform';
import { MatDialog, MatExpansionPanel } from '@angular/material';
import { CoktanSecmeliSoruComponent } from '../../coktan-secmeli-soru/coktan-secmeli-soru.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DersItem } from '../../models/birim-program-donem-ders';
import { SatPopover } from '@ncstate/sat-popover';
@Component({
  selector: 'fuse-iliskili-soru-listesi',
  templateUrl: './iliskili-soru-listesi.component.html',
  styleUrls: ['./iliskili-soru-listesi.component.scss'],
  animations: fuseAnimations
})
export class IliskiliSoruListesiComponent implements OnInit, OnDestroy {
  @ViewChild(SatPopover) popover: SatPopover;
  @ViewChild(MatExpansionPanel) soruKokuMetiniPaneli: MatExpansionPanel;
  
  sorular: SoruListe[];
  aktifSoru: SoruListe;
  onSorularDegisti: Subscription;
  onAktifSoruDegisti: Subscription;
  dialogRef: any;
  soruKokuForm: FormGroup;
  panelOpenState: boolean;
  public get soruKokuNo(): number {
    if (!this.soruKokuForm || !this.soruKokuForm.get('soruKokuId')) {
      return 0;
    } else {
      const deger = this.soruKokuForm.get('soruKokuId').value;

      return deger;
    }
  }

  public get soruKokuMetni(): string {
    if (!this.soruKokuForm || !this.soruKokuForm.get('soruKokuMetni')) {
      return '';
    } else {
      const deger = this.soruKokuForm.get('soruKokuMetni').value;
      if (this.panelOpenState === true) {
        return '';
      }
      return deger;
    }
  }

  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private uiStore: Store<fromRootStore.UIState>,
    private sorularStore: Store<fromSorularStore.SoruDepoAppState>,
    public service: IliskiliSoruService,
    private mesajService: SbMesajService,
    public sorularService: SorularService,
    public location: Location,
    public dialog: MatDialog,
    private platform: Platform
  ) {

  
    this.soruKokuFormuYarat(service.soruKokuSonuc ? service.soruKokuSonuc.donenNesne.soruKokuId : null,
      service.soruKokuSonuc ? service.soruKokuSonuc.donenNesne.soruKokuMetni : '');
  }

  soruKokuFormuYarat(id, metin) {
    this.soruKokuForm = this.formBuilder.group({
      soruKokuId: id,
      soruKokuMetni: [metin, [Validators.required]]
    });
  }
  ngOnInit() {
    this.onSorularDegisti =
      this.service.onSorularDegisti
        .subscribe(sorular => {
          this.sorular = sorular;

        });

    this.onAktifSoruDegisti =
      this.service.onAktifSoruDegisti
        .subscribe(gelenAktifSoru => {
          if (!gelenAktifSoru) {
            // Set the current mail id to null to deselect the current mail
            this.aktifSoru = null;
            this.location.go('sorudeposu/iliskilisoru/' + this.service.soruKokuNo);

          }
          else {
            this.aktifSoru = gelenAktifSoru;
          }
        });
  }
  ngOnDestroy() {
    this.onAktifSoruDegisti.unsubscribe();
    this.onSorularDegisti.unsubscribe();
  }
  soruyuOku(soruId) {
    this.service.aktiSoruOlarakIsaretle(soruId);
  }
  soruKokunuKaydet() {
    if (this.soruKokuNo > 0) {
      const degisecek: SoruKokuDuzenle = Object.assign({}, this.soruKokuForm.value);
      degisecek.sorulari = this.sorular.map(s => s.soruId);
      this.service.soruKokuKaydet(degisecek).subscribe((sonuc: KayitSonuc<SoruKokuListe>) => {
        if (sonuc.basarili) {
          this.service.onKayitGeldi(sonuc);
          this.soruKokuForm.patchValue({ soruKokuId: sonuc.donenNesne.soruKokuId, soruKokuMetni: sonuc.donenNesne.soruKokuMetni });
          this.location.go('sorudeposu/iliskilisoru/' + this.service.soruKokuNo);
          this.soruKokuForm.markAsPristine();
        } else {
          this.mesajService.hata(sonuc.hatalar[0]);
        }
      });
    } else {
      const yeni: SoruKokuYarat = Object.assign({}, this.soruKokuForm.value);
      yeni.sorulari = this.sorular.map(s => s.soruId);
      this.service.soruKokuYarat(yeni).subscribe((sonuc: KayitSonuc<SoruKokuListe>) => {
        if (sonuc.basarili) {
          this.service.onKayitGeldi(sonuc);
          this.soruKokuForm.patchValue({ soruKokuId: sonuc.donenNesne.soruKokuId, soruKokuMetni: sonuc.donenNesne.soruKokuMetni });
          this.soruKokuForm.markAsPristine();
        } else {
          this.mesajService.hata(sonuc.hatalar[0]);
        }
      });
    }
  }

  yeniSoruYarat() {

    const soruKokuMetni = this.soruKokuForm.get('soruKokuMetni').value;
    if (!soruKokuMetni || soruKokuMetni.length === 0) {
      this.mesajService.hataStr('Lütfen önce soru kökü metnini yazın!');
      this.soruKokuMetiniPaneli.open();
      this.panelOpenState = true;
      return;
    }

    const ders = this.sorularService.dersBul(this.service.soruKokuSonuc.donenNesne.dersNo);
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
          dersNo: this.service.soruKokuSonuc.donenNesne.dersNo,
          konuNo: this.service.soruKokuSonuc.donenNesne.konuNo,
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
    let kaydedilecekSoruKoku: SoruKokuListe = null;
    if (this.soruKokuNo > 0) {
      kaydedilecekSoruKoku = Object.assign({}, this.soruKokuForm.value);
    } else {
      const yeni: SoruKokuYarat = Object.assign({}, this.soruKokuForm.value);
      yeni.sorulari = this.sorular.map(s => s.soruId);
      this.service.soruKokuYarat(yeni).subscribe((sonuc: KayitSonuc<SoruKokuListe>) => {
        if (sonuc.basarili) {
          kaydedilecekSoruKoku = sonuc.donenNesne;
          this.service.onKayitGeldi(sonuc);
        } else {
          this.mesajService.hata(sonuc.hatalar[0]);
        }
      });
    }

    if (kaydedilecekSoruKoku === null) {
      this.mesajService.hataStr('Soru kökü bilgisi kaydedilemedi! Değişiklikler kayboldu!');
      return;
    }

    const yeniSoru: SoruYarat = Object.assign({}, formData.getRawValue());
    yeniSoru.tekDogruluSecenekleri = formData.get('secenekler').value;
    yeniSoru.kabulEdilebilirlikIndeksi = formData.get('kabulEdilebilirlikIndeksi').value;
    yeniSoru.baslangic = formData.get('gecerlilik.baslangic').value;
    yeniSoru.bitis = formData.get('gecerlilik.bitis').value;
    yeniSoru.soruKokuNo = kaydedilecekSoruKoku.soruKokuId;
    if (yeniSoru.dersNo > 0) {
      if (ders != null) {
        yeniSoru.birimNo = ders.birimNo;
        yeniSoru.programNo = ders.programNo;
        yeniSoru.donemNo = ders.donemNo;
        yeniSoru.dersGrubuNo = ders.dersGrubuNo;
      }
    }
    yeniSoru.soruKokuNo = kaydedilecekSoruKoku.soruKokuId;
    this.sorularStore.dispatch(new fromSorularStore.UpdateSoru(yeniSoru));


  }
  soruKokunuDuzenle() {
    if (this.popover) {
      this.popover.toggle();
    }
  }
  closeOnEnter(event: KeyboardEvent) {

    if (event.code === 'Enter') {
      this.popover.close();
    }
  }

}
