import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as fromGerekliListelerActions from '../actions/gerekli-listeler.actions';

import { SorularEffectsService } from './sorular-effects.service';

@Injectable()
export class GerekliListelerEffect {
    constructor(
        private actions: Actions,
        private service: SorularEffectsService,
    ) {
    }

    @Effect()
    GetBilisselDuzeyler: Observable<fromGerekliListelerActions.GerekliListelerActionsAll> =
        this.actions
            .ofType<fromGerekliListelerActions.GetBilisselDuzeyler>(fromGerekliListelerActions.GET_BILISSEL_DUZEYLER)
            .pipe(
                switchMap((action) => {
                    return this.service.getBilisselDuzeyler()
                        .pipe(
                            map((folders: any) => {
                                return new fromGerekliListelerActions.GetBilisselDuzeylerTamam(folders.donenListe);
                            }),
                            catchError(err => of(new fromGerekliListelerActions.GetBilisselDuzeylerHata()))
                        );
                }
                ));
    @Effect()
    GetSoruTipleri: Observable<fromGerekliListelerActions.GerekliListelerActionsAll> =
        this.actions
            .ofType<fromGerekliListelerActions.GetSoruTipleri>(fromGerekliListelerActions.GET_SORU_TIPLERI)
            .pipe(
                switchMap((action) => {
                    return this.service.getSoruTipleri()
                        .pipe(
                            map((folders: any) => {
                                return new fromGerekliListelerActions.GetSoruTipleriTamam(folders.donenListe);
                            }),
                            catchError(err => of(new fromGerekliListelerActions.GetSoruTipleriHata()))
                        );
                }
                ));
    @Effect()
    GetSoruZorluklari: Observable<fromGerekliListelerActions.GerekliListelerActionsAll> =
        this.actions
            .ofType<fromGerekliListelerActions.GetSoruZorluklari>(fromGerekliListelerActions.GET_SORU_ZORLUKLARI)
            .pipe(
                switchMap((action) => {
                    return this.service.getSoruZorluklari()
                        .pipe(
                            map((folders: any) => {
                                return new fromGerekliListelerActions.GetSoruZorluklariTamam(folders.donenListe);
                            }),
                            catchError(err => of(new fromGerekliListelerActions.GetSoruZorluklariHata()))
                        );
                }
                ));
}
