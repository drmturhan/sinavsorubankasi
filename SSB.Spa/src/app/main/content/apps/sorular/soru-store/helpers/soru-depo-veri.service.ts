import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { SoruDepoAppState } from '../reducers';

import { Observable } from 'rxjs/Observable';
import { map, switchMap, catchError, tap, take, filter } from 'rxjs/operators';
import * as fromStore from '../index';
import * as fromRootStore from '../../../../../../store/index';
@Injectable()
export class SoruDepoVeriService {


    constructor(private store: Store<SoruDepoAppState>) {
        this.store.select(fromRootStore.getRouterState).subscribe(routerState => {
            if (routerState) {
                this.routerState = routerState.state;
            }
        });
    }
    routerState: any;


    checkStore(): Observable<any> {
        return Observable
            .forkJoin(
                this.getBirimler(),
                this.getSoruTipleri(),
                this.getSoruBilisselDuzeyleri(),
                this.getSoruZorluklari()
            )
            .pipe(
                filter(([birimlerLoaded, soruTipleriLoaded, soruZorluklariLoaded, bilisselDuzeylerLoaded]) =>
                    birimlerLoaded && soruTipleriLoaded && soruZorluklariLoaded && bilisselDuzeylerLoaded),
                take(1),
                switchMap(() =>
                    this.getSorular()
                ),
                take(1),
                map(() => {
                    this.store.dispatch(new fromStore.SetAktifSoru(this.routerState.params.soruId));
                })
            );
    }

    getBirimler() {
        return this.store.select(fromStore.getBirimlerLoaded)
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                        this.store.dispatch(new fromStore.GetBirimler([]));
                    }
                }),
                filter(loaded => loaded),
                take(1)
            );
    }

    getSoruTipleri() {
        return this.store.select(fromStore.getSoruTipleriLoaded)
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                        this.store.dispatch(new fromStore.GetSoruTipleri());
                    }
                }),
                filter(loaded => loaded),
                take(1)
            );

    }

    getSoruZorluklari() {
        return this.store.select(fromStore.getSoruZorluklariLoaded)
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                        this.store.dispatch(new fromStore.GetSoruZorluklari());
                    }
                }),
                filter(loaded => loaded),
                take(1)
            );

    }

    getSoruBilisselDuzeyleri() {
        return this.store.select(fromStore.getBilisselDuzeylerLoaded)
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                        this.store.dispatch(new fromStore.GetBilisselDuzeyler());
                    }
                }),
                filter(loaded => loaded),
                take(1)
            );

    }
    getSorular() {
        return this.store.select(fromStore.getSorularLoaded)
            .pipe(
                tap((loaded: any) => {

                    if (!this.routerState.params[loaded.id] || this.routerState.params[loaded.id] !== loaded.value) {
                        this.store.dispatch(new fromStore.GetSorular());
                        this.store.dispatch(new fromStore.SetSorularAramaCumlesi(''));
                        this.store.dispatch(new fromStore.DeselectSorularTumu());
                    }
                }),
                filter((loaded: any) => {
                    return !this.routerState.params[loaded.id] || this.routerState.params[loaded.id] !== loaded.value;
                }),
                take(1)
            );
    }
}
