import { Component, OnInit, OnDestroy } from '@angular/core';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SoruListe, SoruKokuListe } from '../models/soru';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IliskiliSoruService } from './iliskili-soru.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { SoruDepoVeriService } from '../soru-store/helpers/soru-depo-veri.service';
import { Router } from '@angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { map } from 'rxjs-compat/operator/map';
import { SbMesajService } from '../../../../../core/services/sb-mesaj.service';
import * as fromUIStore from '../../../../../store/index';
import { Store } from '@ngrx/store';
import { KonuItem } from '../models/birim-program-donem-ders';
import { SoruDepoResolverService } from '../soru-depo-resolver.service';
import { SorularService } from '../sorular.service';
@Component({
  selector: 'fuse-coktan-secmeli-iliskili-soru',
  templateUrl: './coktan-secmeli-iliskili-soru.component.html',
  styleUrls: ['./coktan-secmeli-iliskili-soru.component.scss']

})
export class CoktanSecmeliIliskiliSoruComponent implements OnInit, OnDestroy {


  secilmisSorularVar: boolean;
  belirlenmemis: boolean;

  searchInput: FormControl;
  aktifSoru: SoruListe;

  onSecilmisSorularDegisti: Subscription;
  onAktifSoruDegisti: Subscription;



  sorular$: Observable<SoruListe[]>;
  aktifSoru$: Observable<SoruListe>;

  constructor(
    private service: IliskiliSoruService,
    private soruDepoService: SoruDepoVeriService,
    private sorularService: SorularService,
    public dialog: MatDialog,
    private router: Router,
    private uiStore: Store<fromUIStore.UIState>,
    private mesajService: SbMesajService,
    private resolverBilgiService: SoruDepoResolverService,
    private fuseTranslationLoader: FuseTranslationLoaderService
  ) {
    this.searchInput = new FormControl('');


  }


  ngOnInit() {
    this.onSecilmisSorularDegisti =
      this.service.onSecilmisSorularDegisti
        .subscribe(secilmisSorular => {

          setTimeout(() => {
            this.secilmisSorularVar = secilmisSorular.length > 0;
            this.belirlenmemis = secilmisSorular.length > 0 && this.service.sorular && this.service.sorular.length > 0 && secilmisSorular.length !== this.service.sorular.length;
          }, 0);
        });
    this.onAktifSoruDegisti =
      this.service.onAktifSoruDegisti
        .subscribe(aktifSoru => {
          if (!aktifSoru) {
            this.aktifSoru = null;
          }
          else {
            this.aktifSoru = aktifSoru;
          }
        });

    this.searchInput.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
      .subscribe(searchText => {
        this.service.onAramaCumlesiDegisti.next(searchText);
      });

  }

  ngOnDestroy() {

    this.onSecilmisSorularDegisti.unsubscribe();
    this.onAktifSoruDegisti.unsubscribe();
  }

  toogleTumSorulariSec() {
    this.service.toggleHepsiniSec();
  }
  sorulariSec(filterParameter?, filterValue?) {
    this.service.sorulariSec(filterParameter, filterValue);
  }
  soruSeciminiUptalEt() {
    this.service.deselectSorular();
  }

  aktifSoruyuSecilmemisYap() {
    this.service.onAktifSoruDegisti.next(null);
  }


  seciliSorulariSil() {
    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      width: '600px',
      height: '400',
      data: {
        onaybasligi: 'Silme onayı!',
        onaymesaji: `<p>Silinsin derseniz listede seçilmiş olan soruların  hepsi sistemden tamamen silinecek!</p> Soru(lar) silinsin mi?`,
        olumluButonYazisi: 'Silinsin',
        olumsuzButonYazisi: 'Vazgeçtim'
      }
    });
  }
  aktifSoruyuBosYap() {

  }
  soruGoster(degisenSoruId) {

  }
  soruDepoAnaSayfayaGit() {
    this.router.navigate([`sorudeposu/`]);
  }
  soruKokunuSil() {

    if (this.service.soruKokuNo && this.service.soruKokuNo > 0) {
      const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
        width: '600px',
        height: '400',
        data: {
          onaybasligi: 'Soru kökü silme onayı!',
          onaymesaji: `<p>Silinsin derseniz soru kökü ve ilişkili soruların  hepsi sistemden tamamen silinecek!</p> Sorukökü ve ilişikili soru(lar) silinsin mi?`,
          olumluButonYazisi: 'Silinsin',
          olumsuzButonYazisi: 'Vazgeçtim'
        }
      }).afterClosed().subscribe(result => {

        if (result) {
          this.uiStore.dispatch(new fromUIStore.StartLoading());
          this.service.soruKokuSil(this.service.soruKokuNo).subscribe((sonuc) => {
            if (sonuc.basarili) {
              this.mesajService.goster('Sor kökü ve ilişkili soruları silindi!');
              this.router.navigate(['sorudeposu']);
            } else {
              this.mesajService.hataStr('Silme işlem başarısız!');
            }

          }, (hata) => {
            this.mesajService.hataStr('Soru kokü ve soruları silienemedi!');
          }, () =>
              this.uiStore.dispatch(new fromUIStore.StopLoading()));
        }
      });


    } else {
      this.yenile();
    }
  }
  yenile() {
    let bilgi = this.service.bilgi;
    if (!bilgi.sayfaBilgisi.hasOwnProperty('konuNo')) {
      this.mesajService.hataStr('Ders konu bilgisi yok!');
      return;
    }
    const aktifDers = this.sorularService.dersBul(bilgi.sayfaBilgisi.dersNo);
    let aktifKonu: KonuItem;
    if (aktifDers && bilgi.sayfaBilgisi['konuNo']) {
      aktifKonu = this.sorularService.getKonu(aktifDers, bilgi.sayfaBilgisi['konuNo']);
    }
    const soruKoku = new SoruKokuListe();
    if (aktifKonu) {
      soruKoku.konuNo = aktifKonu.konuId;
      soruKoku.dersNo = aktifKonu.dersNo;
      bilgi = this.resolverBilgiService.bilgiKoy(soruKoku, 'iliskilisoru');
      this.router.navigate([`sorudeposu/iliskilisoru/${bilgi.id}`]);
    } else {
      soruKoku.dersNo = aktifKonu.dersNo;
      bilgi = this.resolverBilgiService.bilgiKoy(soruKoku, 'iliskilisoru');
      this.router.navigate([`sorudeposu/iliskilisoru/${bilgi.id}`]);
    }
  }
}
