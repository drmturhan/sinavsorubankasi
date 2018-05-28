import { Component, OnInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
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
import { StartLoading } from '../../../../../../store/index';
@Component({
  selector: 'fuse-iliskili-soru-listesi',
  templateUrl: './iliskili-soru-listesi.component.html',
  styleUrls: ['./iliskili-soru-listesi.component.scss'],
  animations: fuseAnimations
})
export class IliskiliSoruListesiComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild(SatPopover) popover: SatPopover;
  @ViewChild(MatExpansionPanel) soruKokuMetiniPaneli: MatExpansionPanel;


  sorular: SoruListe[];
  aktifSoru: SoruListe;

  onSorularDegisti: Subscription;
  onAktifSoruDegisti: Subscription;

  yukleniyor: boolean;
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
    this.formyarat();
  }

  formyarat() {
    this.soruKokuFormuYarat(this.service.soruKokuSonuc ? this.service.soruKokuSonuc.donenNesne.soruKokuId : null,
      this.service.soruKokuSonuc ? this.service.soruKokuSonuc.donenNesne.soruKokuMetni : '');
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
          this.formyarat();
        });

    this.onAktifSoruDegisti =
      this.service.onAktifSoruDegisti
        .subscribe(gelenAktifSoru => {
          if (!gelenAktifSoru) {
            // Set the current mail id to null to deselect the current mail
            this.aktifSoru = null;
            // this.location.go('sorudeposu/iliskilisoru/' + this.service.soruKokuNo);

          }
          else {
            this.aktifSoru = gelenAktifSoru;
          }
        });
  }
  ngAfterViewChecked(): void {
    if (this.soruKokuMetiniPaneli && !this.soruKokuMetni) {
      setTimeout(() => {
        this.panelOpenState = true;
        this.soruKokuMetiniPaneli.open();
      });
    }
  }
  ngOnDestroy() {
    this.onAktifSoruDegisti.unsubscribe();
    this.onSorularDegisti.unsubscribe();
  }
  soruyuOku(soruId) {
    this.service.aktiSoruOlarakIsaretle(soruId);
  }
  soruKokunuKaydet() {
    this.uiStore.dispatch(new fromRootStore.StartLoading());
    if (this.soruKokuNo > 0) {
      const degisecek: SoruKokuDuzenle = Object.assign({}, this.soruKokuForm.value);
      degisecek.sorulari = this.sorular.map(s => s.soruId);
      this.service.soruKokuKaydet(degisecek).subscribe((sonuc: KayitSonuc<SoruKokuListe>) => {
        this.uiStore.dispatch(new fromRootStore.StopLoading());
        if (sonuc.basarili) {
          this.service.onKayitGeldi(sonuc);
          this.soruKokuForm.patchValue({ soruKokuId: sonuc.donenNesne.soruKokuId, soruKokuMetni: sonuc.donenNesne.soruKokuMetni });
          this.soruKokuForm.markAsPristine();
          this.mesajService.goster('Soru kökü kaydedildi.');
        } else {
          this.mesajService.hata(sonuc.hatalar[0]);
        }
      }, (hata) => this.mesajService.hataStr('Kaydedilemedi!'),
        () => this.uiStore.dispatch(new fromRootStore.StopLoading()));
    } else {
      const yeni: SoruKokuYarat = Object.assign({}, this.soruKokuForm.value);
      // yeni.sorulari = this.sorular.map(s => s.soruId);
      this.service.soruKokuYarat(yeni).subscribe((sonuc: KayitSonuc<SoruKokuListe>) => {
        this.uiStore.dispatch(new fromRootStore.StopLoading());
        if (sonuc.basarili) {
          this.service.onKayitGeldi(sonuc);
          this.soruKokuForm.patchValue({ soruKokuId: sonuc.donenNesne.soruKokuId, soruKokuMetni: sonuc.donenNesne.soruKokuMetni });
          this.soruKokuForm.markAsPristine();
          this.mesajService.goster('Soru kökü kaydedildi.');
        } else {
          this.mesajService.hata(sonuc.hatalar[0]);
        }
      }, (hata) => this.mesajService.hataStr('Kaydedilemedi!'),
        () => this.uiStore.dispatch(new fromRootStore.StopLoading()));
    }
  }

  yeniSoruYaratmaEkrani(soru: SoruYarat = null) {

    const soruKokuMetni = this.soruKokuForm.get('soruKokuMetni').value;
    if (!soruKokuMetni || soruKokuMetni.length === 0) {
      this.mesajService.hataStr('Lütfen önce soru kökü metnini yazın!');
      this.soruKokuMetiniPaneli.open();
      this.panelOpenState = true;
      return;
    }

    const ders = this.sorularService.dersBul(this.service.bilgi.sayfaBilgisi.dersNo);
    const konu = this.service.bilgi.sayfaBilgisi.konuNo > 0 && ders ? this.sorularService.getKonu(ders, this.service.bilgi.sayfaBilgisi.konuNo) : null;
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
          degisecekSoru: soru,
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
        const yeniSoru: SoruYarat = response[2];
        switch (actionType) {
          /**
           * Kaydete tıklandı
           */
          case 'kaydet':
            if (yeniSoru) {
              this.yeniSoruEkle(yeniSoru, formData);
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


  // Soru kokune yoksa yaratılacak yeni soru eklenecek, varsa yaratılmadan yeni sor eklenecek yani soru koku degistirilecek
  yeniSoruEkle(yaratilacakSoru: SoruYarat, formData: FormGroup) {

    
    // Soru koku var ve degismis
    if (this.soruKokuNo > 0 && this.soruKokuForm.dirty) {
      //  Soru koku fromu zaten valid yoksa buraya gelmez yeni soru ekrani acilmazdi
      const degisecek: SoruKokuDuzenle = Object.assign({}, this.soruKokuForm.value);
      this.uiStore.dispatch(new fromRootStore.StartLoading());
      this.service.soruKokuKaydet(degisecek).subscribe((sonuc: KayitSonuc<SoruKokuListe>) => {
        if (sonuc.basarili) {
          // Yeni soruyu da kaydet
          this.service.onKayitGeldi(sonuc);
          this.soruKokuForm.patchValue({ soruKokuId: sonuc.donenNesne.soruKokuId, soruKokuMetni: sonuc.donenNesne.soruKokuMetni });
          yaratilacakSoru.soruKokuNo = sonuc.donenNesne.soruKokuId;
          this.soruyuKaydet(yaratilacakSoru, formData);

        } else {
          // Kayit yapilamaz ise ekrani tekrar ac
          this.yeniSoruYaratmaEkrani(Object.assign({}, formData.getRawValue()));
          return;
        }
      },
        (hata) => {
          this.yeniSoruYaratmaEkrani(Object.assign({}, formData.getRawValue()));
          return;
        },
        () => {
          this.uiStore.dispatch(new fromRootStore.StopLoading());
        });
    } else {

      const yeniSoruKoku: SoruKokuYarat = Object.assign({}, this.soruKokuForm.getRawValue());
      this.service.soruKokuYarat(yeniSoruKoku).subscribe((sonuc: KayitSonuc<SoruKokuListe>) => {
        if (sonuc.basarili) {
          // Yeni soruyu da kaydet
          this.service.onKayitGeldi(sonuc);
          this.soruKokuForm.patchValue({ soruKokuId: sonuc.donenNesne.soruKokuId, soruKokuMetni: sonuc.donenNesne.soruKokuMetni });
          yaratilacakSoru.soruKokuNo = sonuc.donenNesne.soruKokuId;
          this.soruyuKaydet(yaratilacakSoru, formData);
        } else {
          // Kayit yapilamaz ise ekrani tekrar ac
          this.yeniSoruYaratmaEkrani(Object.assign({}, formData.getRawValue()));
          return;
        }
      },
        (hata) => {
          this.yeniSoruYaratmaEkrani(Object.assign({}, formData.getRawValue()));
          return;
        },
        () => {
          this.uiStore.dispatch(new fromRootStore.StopLoading());
        });
    }

    // Yeni soru kaydı buarada yapılıyor;

  }
  private soruyuKaydet(yaratilacakSoru: SoruYarat, formData: FormGroup) {
    const yeniSoru: SoruYarat = Object.assign({}, yaratilacakSoru, formData.getRawValue());
    this.sorularService.formuNesneyeCevirKaydet(formData, yeniSoru);
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
