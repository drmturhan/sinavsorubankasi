import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import * as fromArkadaslarActions from '../actions/arkadaslar.actions';

import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { AuthService } from '../../core/services/auth.service';
import { ListeSonuc } from '../../models/sonuclar';
import { ArkadaslikTeklif } from '../../models/arkadaslik-teklif';
import { environment } from 'environments/environment.prod';



@Injectable()
export class ArkadaslarEffect {
    constructor(
        private actions: Actions,
        private temelService: AuthService,
        private store: Store<State>

    ) {
    }

    @Effect()
    getBirimler: Observable<fromArkadaslarActions.ArkadaslarActions> =
        this.actions
            .ofType<fromArkadaslarActions.ArkadaslarListeAl>(fromArkadaslarActions.ARKADASLAR_LISTE_AL)
            .pipe(
                switchMap((action) => {

                    return this.temelService.arkadasliklariGetir(action.payload)
                        .pipe(
                            tap((sonuc: ListeSonuc<ArkadaslikTeklif>) => {
                                console.log(sonuc);
                            }),
                            map((sonuc: ListeSonuc<ArkadaslikTeklif>) => {
                                if (sonuc.basarili) {
                                    sonuc.donenListe.forEach((arkadaslik: ArkadaslikTeklif) => {
                                        if (!arkadaslik.arkadas.profilFotoUrl) {
                                            arkadaslik.arkadas.profilFotoUrl = environment.bosFotoUrl;
                                        }
                                    });
                                    return new fromArkadaslarActions.ArkadaslarListeAlTamam(sonuc);
                                }
                                else {
                                    return new fromArkadaslarActions.ArkadaslarListeAlHataVar(sonuc.hatalar.join('.'));
                                }
                            }),
                            catchError(err =>
                                of(new fromArkadaslarActions.ArkadaslarListeAlHataVar(err)
                                ))
                        );
                }
                ));
}
