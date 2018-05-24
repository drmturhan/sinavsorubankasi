
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SoruListe, SoruDegistir } from '../../models/soru';
import { SorularService } from '../../sorular.service';
import { MatDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { Platform } from '@angular/cdk/platform';
import * as fromStore from '../../soru-store';
import * as fromUIActions from '../../../../../../store/actions/ui.actions';
import { SbMesajService } from '../../../../../../core/services/sb-mesaj.service';
import { KayitSonuc } from '../../../../../../models/sonuclar';
import { CoktanSecmeliSoruComponent } from '../../coktan-secmeli-soru/coktan-secmeli-soru.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'fuse-soru-listesi-satiri',
  templateUrl: './soru-listesi-satiri.component.html',
  styleUrls: ['./soru-listesi-satiri.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoruListesiSatiriComponent implements OnInit, OnDestroy {
  @Input() soru: SoruListe;
  @HostBinding('class.selected') selected: boolean;
  bitisTarihiGecerli: boolean;
  selectedSoruIds$: Observable<any>;
  dialogRef: any;
  constructor(

    public dialog: MatDialog,
    private store: Store<fromStore.SoruDepoAppState>,
    private sorularService: SorularService,
    private mesajService: SbMesajService,
    public platform: Platform,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {
    this.selectedSoruIds$ = this.store.select(fromStore.getSelectedSoruNumaralari);
    this.selected = false;

  }

  ngOnInit() {
    this.soru = new SoruListe(this.soru);
    this.bitisTarihiGecerli = this.soru.baslangic < this.soru.bitis;

    this.selectedSoruIds$.subscribe((selectedMailIds: any[]) => {
      // tslint:disable-next-line:triple-equals
      const sonuc = selectedMailIds.find(id => id == this.soru.soruId);
      this.selected = selectedMailIds.length > 0 && sonuc !== undefined;
      // tslint:disable-next-line:triple-equals
      if (selectedMailIds.length == 1) {
        this.store.dispatch(new fromStore.SetAktifSoru(selectedMailIds[0]));
      }
      this.refresh();
    });

  }
  refresh() {
    this.cd.markForCheck();
  }

  onSelectedChange() {
    this.store.dispatch(new fromStore.SoruSecimiDegistir(this.soru.soruId.toString()));
  }

  ngOnDestroy() {
  }


  soruyuDegistir() {
    if (this.soru.soruKokuNo > 0) {
      this.router.navigate(['sorudeposu/iliskilisoru/', this.soru.soruKokuNo]);

    }
    else {
      this.iliskisiOlmayanSoruyuDegistir()
    }
  }

  iliskisiOlmayanSoruyuDegistir() {
    this.store.dispatch(new fromUIActions.StartLoading());
    const degisecekSoru = this.sorularService.getSoruById(this.soru.soruId)
      .subscribe((sonuc: KayitSonuc<SoruDegistir>) => {
        this.store.dispatch(new fromUIActions.StopLoading());
        if (!sonuc.basarili) {
          this.mesajService.hatalar(sonuc.hatalar);
          return;
        }
        const ders = this.sorularService.dersBul(sonuc.donenNesne.dersNo);
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
              dersNo: this.soru.dersNo,
              konuNo: this.soru.konuNo,
              ders: ders,
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
        () => this.store.dispatch(new fromUIActions.StopLoading()));
  }
  soruDegisiklikKaydet(formData: FormGroup, degisecekSoru: SoruDegistir) {
    this.sorularService.formuNesneyeCevirKaydet(formData, degisecekSoru);
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
    this.store.dispatch(new fromStore.SoruFavoriDegistir({ soruNo: this.soru.soruId, favori: true }));
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
        this.store.dispatch(new fromStore.SoruSilindiIsaretle(this.soru.soruId));
      }
    });

  }
}
