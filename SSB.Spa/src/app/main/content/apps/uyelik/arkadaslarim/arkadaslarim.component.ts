import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MatDialog } from '@angular/material';
import { Platform } from '@angular/cdk/platform';

import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { map, switchMap, catchError, tap, take, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { fuseAnimations } from '@fuse/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { KullaniciBilgi } from '../../../../../models/kullanici';
import { Subscription } from 'rxjs/Subscription';
import { ArkadaslikSorgusu } from '../../../../../models/arkadaslik-teklif';
import { UyelikService } from '../uyelik.service';
import { State } from '../../../../../store';
import { SbMesajService } from '../../../../../core/services/sb-mesaj.service';
import * as fromArkadaslarActions from '../../../../../store/actions/arkadaslar.actions';
import * as fromArkadaslarReducer from '../../../../../store/reducers/arkadaslar.reducer';
import { ArkadasEkleComponent } from './arkadas-ekle/arkadas-ekle.component';

@Component({
    selector: 'fuse-arkadaslarim',
    templateUrl: './arkadaslarim.component.html',
    styleUrls: ['./arkadaslarim.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ArkadaslarimComponent implements OnInit, OnDestroy {
    dialogRef: any;
    yukleniyor = true;
    searchInput: FormControl;
    suankiKullanici: KullaniciBilgi;
    authState$: Subscription;
    onSecimDegistiSubscription: Subscription;
    teklifSecilmis: boolean;
    arkadaslarLoaded$: Subscription;
    sorguDegisti$: Subscription;
    guncelSorgu: ArkadaslikSorgusu;
    mobilplatform: boolean;
    constructor(
        public uyelikService: UyelikService,
        private rootStore: Store<State>,
        private mesajService: SbMesajService,
        public dialog: MatDialog,
        public platform: Platform) {
        this.mobilplatform = this.platform.ANDROID || this.platform.IOS;
        this.searchInput = new FormControl('');
    }

    ngOnInit() {
        // this.getArkadaslar();
        this.onSecimDegistiSubscription =
            this.uyelikService.onArkadaslikSecimiDegisti
                .subscribe(secilenler => {
                    this.teklifSecilmis = secilenler.length > 0;
                });
        this.arkadaslarLoaded$ = this.rootStore.select(fromArkadaslarReducer.getArkadaslarLoaded).subscribe(yuklendi => {
            this.yukleniyor = !yuklendi;
        });

        this.sorguDegisti$ = this.rootStore.select(fromArkadaslarReducer.getArkadaslikSorgusu).subscribe(sorgu => {
            this.guncelSorgu = sorgu;
            this.searchInput.patchValue(sorgu.aramaCumlesi);
            this.rootStore.dispatch(new fromArkadaslarActions.ArkadaslarListeAl(this.guncelSorgu));
        });
        this.searchInput.valueChanges
            .debounceTime(800)
            .distinctUntilChanged()
            .subscribe(searchText => {
                if (!searchText) {
                    return;
                }
                if (searchText.length < 3 && searchText.length > 0) {
                    return;
                }
                if (this.guncelSorgu && this.guncelSorgu.aramaCumlesi !== searchText) {
                    const yeniSorgu = Object.assign({}, this.guncelSorgu);
                    yeniSorgu.aramaCumlesi = searchText;
                    this.rootStore.dispatch(new fromArkadaslarActions.ArkadaslarSorguDegistir(yeniSorgu));
                }
            });


    }
    ngOnDestroy() {
        this.onSecimDegistiSubscription.unsubscribe();
        this.arkadaslarLoaded$.unsubscribe();
        this.sorguDegisti$.unsubscribe();
    }
    getArkadaslar() {
        this.rootStore.dispatch(new fromArkadaslarActions.ArkadaslarSorguDegistir(this.guncelSorgu));
    }
    yenile() {

        this.rootStore.dispatch(new fromArkadaslarActions.ArkadaslarListeAl(this.guncelSorgu));
    }
    arkadasBul() {

        let en = '70vw';
        let boy = '90vh';
        const sinif = 'erkadas-ekle-dialog';
        if (this.platform.ANDROID || this.platform.IOS) {
            en = '99vw';
            boy = '95vh';
            // sinif = 'popup-mobil';
        }
        this.dialogRef = this.dialog.open(ArkadasEkleComponent, {
            data: {
                kb: this.uyelikService.kb
            },
            width: en,
            panelClass: sinif
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }



            });
    }
}
