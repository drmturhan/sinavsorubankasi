import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { SoruListe, SoruDegistir, SoruYarat } from '../../models/soru';
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
import { MatDialog } from '@angular/material';
import { CoktanSecmeliSoruComponent } from '../../coktan-secmeli-soru/coktan-secmeli-soru.component';
import { FormGroup } from '@angular/forms';
import { DersItem } from '../../models/birim-program-donem-ders';
@Component({
  selector: 'fuse-iliskili-soru-listesi',
  templateUrl: './iliskili-soru-listesi.component.html',
  styleUrls: ['./iliskili-soru-listesi.component.scss'],
  animations: fuseAnimations
})
export class IliskiliSoruListesiComponent implements OnInit, OnDestroy {

  sorular: SoruListe[];
  aktifSoru: SoruListe;
  onSorularDegisti: Subscription;
  onAktifSoruDegisti: Subscription;
  dialogRef: any;
  constructor(private route: ActivatedRoute,
    private uiStore: Store<fromRootStore.UIState>,
    private sorularStore: Store<fromSorularStore.SoruDepoAppState>,
    public service: IliskiliSoruService,
    private mesajService: SbMesajService,
    public sorularService: SorularService,
    public location: Location,
    public dialog: MatDialog,
    private platform: Platform
  ) { }

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
    this.service.aktiSoruyuOlarakIsaretle(soruId);
  }

  yeniSoruYarat() {
    
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
    this.sorularStore.dispatch(new fromSorularStore.UpdateSoru(yeniSoru));
    this.service.yenile();

  }
}
