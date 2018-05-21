import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import * as fromRootStore from '../../../../store';
import * as fromAuthStore from '../../../../store/';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { DersItem, KonuItem, SoruBirimItem } from './models/birim-program-donem-ders';
import { SoruListe } from './models/soru';
import * as fromSorularStore from './soru-store';
import { SorularEffectsService } from './soru-store/effects/sorular-effects.service';
import { SoruDepoVeriService } from './soru-store/helpers/soru-depo-veri.service';
import { SorularService } from './sorular.service';





@Component({
  selector: 'fuse-sorular',
  templateUrl: './sorular.component.html',
  styleUrls: ['./sorular.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class SorularComponent implements OnInit, OnDestroy {
  routerState: any;
  hasSelectedSorular: boolean;
  isIndeterminate: boolean;
  searchInput: FormControl;
  baslik = '';
  sorular$: Observable<SoruListe[]>;
  aktifBirim: SoruBirimItem = null;
  aktifders: DersItem = null;
  aktifKonu: KonuItem = null;
  aktifSoru$: Observable<SoruListe>;
  selectedSorularIds$: Observable<string[]>;
  searchText$: Observable<string>;
  sorular: SoruListe[];
  selectedSorularIds: string[];

  private kullaniciTakip$: Subscription;
  constructor(
    private configService: FuseConfigService,
    private translationLoader: FuseTranslationLoaderService,
    private store: Store<fromSorularStore.SoruDepoAppState>,
    private rootStore: Store<fromRootStore.State>,
    private authStore: Store<fromAuthStore.UIState>,
    private sorularService: SorularService,
    private effectsService: SorularEffectsService,
    private cd: ChangeDetectorRef,
    private route: Router,
    public dialog: MatDialog,
    private helperServide: SoruDepoVeriService) {

    this.rootStore.select(fromRootStore.getRouterState).subscribe(routerState => {

      if (routerState) {
        this.routerState = routerState.state;
        const handle: any[] = this.effectsService.soruHandleYarat(this.routerState);
        let aktifDersNo = 0;
        let aktifKonuNo = 0;
        handle.forEach(h => {
          if (h.id === 'dersNo') {
            aktifDersNo = h.value;
          }
          if (h.id === 'konuNo') {
            aktifKonuNo = h.value;
          }
        });
        if (aktifDersNo > 0) {
          this.aktifders = this.sorularService.dersBul(aktifDersNo);
        }
        else {
          this.aktifders = null;
        }
        if (this.aktifders && aktifKonuNo > 0) {
          const konular = this.aktifders.konulari.filter(k => k.konuId == aktifKonuNo);
          if (konular && konular.length === 1) {
            this.aktifKonu = konular[0];
          }
          else {
            this.aktifKonu = null;
          }
        }
        this.soruBasliginiOlustur();
      }
    });
    this.store.select(fromSorularStore.getAktifBirim).subscribe(birim => {
      if (birim) {
        this.aktifBirim = birim;
        this.soruBasliginiOlustur();
      }
    });
    this.kullaniciTakip$ = this.authStore.select(fromAuthStore.getAuthState).subscribe((authBilgi: any | null) => {
      if (!authBilgi.kullaniciAdi) {
        this.store.dispatch(new fromSorularStore.SorulariSifirla());
        this.store.dispatch(new fromSorularStore.BirimleriSifirla());

        this.route.navigate(['/']);
      }
    });

    this.store.select(fromSorularStore.getAktifDers).subscribe(ders => {
      if (ders) {
        this.aktifders = ders;
        this.soruBasliginiOlustur();
      }
    });

    this.store.select(fromSorularStore.getAktifKonu).subscribe(konu => {
      this.aktifKonu = konu;
      this.soruBasliginiOlustur();
    });

    this.store.select(fromSorularStore.getSorulardaHataVar).subscribe(mesaj => {
      if (mesaj) {
        console.log(mesaj);
      }
    });

    this.searchInput = new FormControl('');
    this.translationLoader.loadTranslations(english, turkish);
    this.aktifSoru$ = this.store.select(fromSorularStore.getCurrentSoru);
    this.sorular$ = this.store.select(fromSorularStore.getSorularArr);
    this.selectedSorularIds$ = this.store.select(fromSorularStore.getSelectedSoruNumaralari);
    this.searchText$ = this.store.select(fromSorularStore.getSorularAramaCumlesi);
    this.sorular = [];
    this.selectedSorularIds = [];

    this.configService.setConfig({
      routerAnimation: 'none'
    });

  }

  ngOnInit() {
    // this.sorular$.subscribe(sorular => {
    //   this.sorular = sorular;
    //   this.cd.detectChanges();
    //   console.log(sorular);
    // });



    this.selectedSorularIds$
      .subscribe(selectedMailIds => {
        this.selectedSorularIds = selectedMailIds;
        this.hasSelectedSorular = selectedMailIds.length > 0;
        this.isIndeterminate = (selectedMailIds.length !== this.sorular.length && selectedMailIds.length > 0);
        this.refresh();
      });

    this.searchText$.subscribe(searchText => {
      this.searchInput.setValue(searchText);
    });

    this.searchInput.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(searchText => {
        this.store.dispatch(new fromSorularStore.SetSorularAramaCumlesi(searchText));
      });
  }

  soruBasliginiOlustur() {

    if (this.aktifders == null && this.aktifKonu == null) {
      if (this.aktifBirim !== null) {
        this.baslik = `${this.aktifBirim.birimAdi}`;
      } else {
        this.baslik = '';
      }
    }

    if (this.aktifders != null && this.aktifKonu != null) {
      this.baslik = `${this.aktifders.dersAdi} - ${this.aktifKonu.konuAdi}`;
    }
    if (this.aktifders == null || this.aktifKonu == null) {

      if (this.aktifders != null) {
        this.baslik = `${this.aktifders.dersAdi}`;
      }

      if (this.aktifKonu != null) {
        this.baslik = `${this.aktifKonu.konuAdi}`;
      }
    }
    this.baslik = this.baslik + ' Soruları';
    this.store.dispatch(new fromSorularStore.GetSorular());
    this.store.dispatch(new fromSorularStore.SetSorularAramaCumlesi(''));
    this.store.dispatch(new fromSorularStore.DeselectSorularTumu());
  }
  yukle() {
    // this.store.dispatch(new UI.StartLoading());

  }
  toggleSelectAll(ev) {
    ev.preventDefault();

    if (this.selectedSorularIds.length && this.selectedSorularIds.length > 0) {
      this.hicSoruSecilmesin();
    }
    else {
      this.tumSorulariSec();
    }
  }

  tumSorulariSec() {
    this.store.dispatch(new fromSorularStore.SelectSorularTumu());
  }

  hicSoruSecilmesin() {
    this.store.dispatch(new fromSorularStore.DeselectSorularTumu());
  }

  selectMailsByParameter(parameter, value) {
    this.store.dispatch(new fromSorularStore.SelectSorularParametreyeGore({
      parameter,
      value
    }));
  }
  seciliSorulariSil() {

    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      width: '600px',
      height: '400',
      data: {
        onaybasligi: 'Silme onayı!',
        onaymesaji: `<p>Silinsin derseniz listede seçilmiş olan soruların (${this.selectedSorularIds.length} soru) hepsi sistemden tamamen silinecek!</p> Soru(lar) silinsin mi?`,
        olumluButonYazisi: 'Silinsin',
        olumsuzButonYazisi: 'Vazgeçtim'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        for (let index = 0; index < this.selectedSorularIds.length; index++) {
          const soruNo = this.selectedSorularIds[index];
          this.store.dispatch(new fromSorularStore.SoruSilindiIsaretle(+soruNo));
        }
      }
    });

  }
  aktifSoruyuBosYap() {
    this.store.dispatch(new fromSorularStore.SetAktifSoru(''));
  }

  refresh() {
    this.cd.markForCheck();
  }
  ngOnDestroy() {
    if (this.kullaniciTakip$) {
      this.kullaniciTakip$.unsubscribe();
    }
    this.cd.detach();
  }
  soruGoster(degisenSoruId) {
    this.store.dispatch(new fromSorularStore.SetAktifSoru(degisenSoruId));
  }
}
