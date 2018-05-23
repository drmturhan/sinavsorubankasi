import { Component, OnInit, OnDestroy } from '@angular/core';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SoruListe } from '../models/soru';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IliskiliSoruService } from './iliskili-soru.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';


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
    public dialog: MatDialog,
    private fuseTranslationLoader: FuseTranslationLoaderService
  ) {
    this.searchInput = new FormControl('');
    // this.fuseTranslationLoader.loadTranslations(english, turkish);
  }

  ngOnInit() {
    this.onSecilmisSorularDegisti =
      this.service.onSecilmisSorularDegisti
        .subscribe(secilmisSorular => {

          setTimeout(() => {
            this.secilmisSorularVar = secilmisSorular.length > 0;
            this.belirlenmemis = (secilmisSorular.length !== this.service.sorular.length && secilmisSorular.length > 0);
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

  aktifSoruyuSecilmemisYap()
  {
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
}
