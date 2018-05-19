import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import * as fromBirimlerActions from '../actions/birimler.actions';



import { Store } from '@ngrx/store';
import { SoruDepoAppState } from '../reducers/';
import { SoruBirimItem } from '../../models/birim-program-donem-ders';
import { SorularEffectsService } from './sorular-effects.service';

@Injectable()
export class BirimlerEffect {
    constructor(
        private actions: Actions,
        private service: SorularEffectsService,
        private store: Store<SoruDepoAppState>

    ) {
    }

    /**
     * Get Folders from Server
     * @type {Observable<any>}
     */
    @Effect()
    getBirimler: Observable<fromBirimlerActions.BirimlerActionsAll> =
        this.actions
            .ofType<fromBirimlerActions.GetBirimler>(fromBirimlerActions.GET_BIRIMLER)
            .pipe(
                switchMap((action) => {
                    return this.service.getKullanicininAnlattigiDersler()
                        .pipe(
                            tap((birimler: SoruBirimItem[]) => {
                                birimler.forEach(birim => {
                                    if (birim.programlari.length > 0) {
                                        birim.programlari.forEach(program => {
                                            if (program.donemleri.length > 0) {
                                                program.donemleri.forEach(donem => {
                                                    if (donem.dersGruplari.length > 0) {
                                                        donem.dersGruplari.forEach(grup => {
                                                            grup.dersleri.forEach(ders => {
                                                                ders.birimNo = birim.birimId;
                                                                ders.birimAdi = birim.birimAdi;
                                                                ders.programNo = program.programId;
                                                                ders.programAdi = program.programAdi;
                                                                ders.donemNo = donem.donemId;
                                                                ders.donemAdi = donem.donemAdi;
                                                                ders.dersGrubuNo = grup.dersGrupId;
                                                                ders.stajDersi = grup.staj;
                                                                ders.dersKuruluDersi = grup.dersKurulu;
                                                                ders.dersGrubuAdi = grup.grupAdi;

                                                            });
                                                            this.store.dispatch(new fromBirimlerActions.GetDerslerSuccess(grup.dersleri));
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }),
                            map((birimler: SoruBirimItem[]) => {
                                return new fromBirimlerActions.GetBirimlerSuccess(birimler);
                            }),
                            catchError(err =>
                                of(new fromBirimlerActions.GetBirimlerFailed(err)
                                ))
                        );
                }
                ));
}
