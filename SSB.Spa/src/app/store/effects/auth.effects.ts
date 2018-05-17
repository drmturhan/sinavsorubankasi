
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { withLatestFrom, map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';


import * as fromAuthActions from '../actions/auth.actions';
import * as fromAuthReducer from '../reducers/auth.reducer';
import * as fromUIActions from '../actions/ui.actions';


import { SbMesajService } from '../../core/services/sb-mesaj.service';
import { AuthService } from '../../core/services/auth.service';
import { GuvenlikBilgi } from '../../models/kullanici';
import { KayitSonuc, Sonuc } from '../../models/sonuclar';
import { State } from 'app/store';


@Injectable()
export class AuthEffect {
    constructor(
        private actions: Actions,
        private mesajService: SbMesajService,
        private authService: AuthService,
        private jwtHelperService: JwtHelperService,
        private store: Store<State>,
        private router: Router

    ) { }


    @Effect()
    loginRead: Observable<fromAuthActions.AUTHActionsTypes> = this.actions
        .ofType<fromAuthActions.LoginRead>(fromAuthActions.AUTH_LOGIN_READ)
        .pipe(
            withLatestFrom(this.store.select(fromAuthReducer.getAuthState)),
            map(([action, state]) => {
                let token: string = null;
                let tokenYanmis: boolean = null;
                if (state.tokenString == null) {
                    token = localStorage.getItem('access_token');
                }
                else {
                    token = state.tokenString;
                }
                if (token != null) {
                    tokenYanmis = this.jwtHelperService.isTokenExpired(token);
                }
                if (token !== null && tokenYanmis === false) {
                    localStorage.setItem('access_token', token);
                    const gb: GuvenlikBilgi = {};
                    gb.tokenString = token;
                    gb.kullanici = JSON.parse(localStorage.getItem('kullanici'));
                    return new fromAuthActions.LoginSuccess(gb);
                }
                else {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('kullanici');
                    return new fromAuthActions.LogoutSuccess();
                }
            })
        );


    @Effect()
    loginKontrol: Observable<fromAuthActions.AUTHActionsTypes> = this.actions
        .ofType<fromAuthActions.LoginCheck>(fromAuthActions.AUTH_LOGIN_CHECK)
        .pipe(
            withLatestFrom(this.store.select(fromAuthReducer.getAuthState)),
            map(([action, state]) => {
                let token: string = null;
                let tokenYanmis: boolean = null;
                if (state.tokenString == null) {
                    token = localStorage.getItem('access_token');
                }
                else {
                    token = state.tokenString;
                }
                if (token != null) {
                    tokenYanmis = this.jwtHelperService.isTokenExpired(token);
                }
                if (token === null || tokenYanmis === true) {
                    return new fromAuthActions.LoginRequired();
                } else {
                    localStorage.setItem('access_token', token);
                    const gb: GuvenlikBilgi = {};
                    gb.tokenString = token;
                    gb.kullanici = JSON.parse(localStorage.getItem('kullanici'));
                    return new fromAuthActions.LoginSuccess(gb);
                }
            })
        );
    /**
     * Giris yap
     * @type {KayitSonuc<GuvenlikBilgi>}
     */
    @Effect()
    girisYap: Observable<fromAuthActions.AUTHActionsTypes> =
        this.actions
            .ofType<fromAuthActions.StartLogin>(fromAuthActions.AUTH_LOGIN_START)
            .pipe(
                switchMap((action) => {
                    return this.authService.login(action.payload)
                        .pipe(
                            map((sonuc: KayitSonuc<GuvenlikBilgi>) => {
                                this.store.dispatch(new fromUIActions.StopLoading());
                                if (sonuc.basarili) {
                                    localStorage.setItem('access_token', sonuc.donenNesne.tokenString);
                                    localStorage.setItem('kullanici', JSON.stringify(sonuc.donenNesne.kullanici));
                                    this.mesajService.yansit(sonuc.mesajlar);
                                    return new fromAuthActions.LoginSuccess(sonuc.donenNesne);
                                } else {
                                    this.mesajService.hatalar(sonuc.hatalar);
                                    return new fromAuthActions.LoginFailed(action.payload.kullaniciAdi ? action.payload.kullaniciAdi : '');
                                }

                            }),
                            catchError(err => of(new fromAuthActions.LoginFailed(action.payload.kullaniciAdi ? action.payload.kullaniciAdi : '')))
                        );
                })
            );
    @Effect()
    facebookGirisYap: Observable<fromAuthActions.AUTHActionsTypes> =
        this.actions
            .ofType<fromAuthActions.FacebookLoginStart>(fromAuthActions.AUTH_FACEBOOK_LOGIN_START)
            .pipe(
                switchMap((action) => {
                    return this.authService.facebookLogin(action.payload)
                        .pipe(
                            map((sonuc: KayitSonuc<GuvenlikBilgi>) => {
                                if (sonuc.basarili) {
                                    localStorage.setItem('access_token', sonuc.donenNesne.tokenString);
                                    localStorage.setItem('kullanici', JSON.stringify(sonuc.donenNesne.kullanici));
                                    this.mesajService.yansit(sonuc.mesajlar);
                                    return new fromAuthActions.LoginSuccess(sonuc.donenNesne);
                                } else {
                                    this.mesajService.hatalar(sonuc.hatalar);
                                    return new fromAuthActions.FacebookLoginFailed();
                                }
                            }),
                            catchError(err => of(new fromAuthActions.LoginFailed('')))
                        );
                })
            );


    @Effect()
    sifreKurtar: Observable<fromAuthActions.AUTHActionsTypes> =
        this.actions
            .ofType<fromAuthActions.SifreKurtarStart>(fromAuthActions.AUTH_SIFREKURTAR_START)
            .pipe(
                switchMap((action) => {
                    return this.authService.sifreKurtar(action.payload)
                        .pipe(
                            map((sonuc: Sonuc) => {
                                if (sonuc.basarili) {
                                    this.mesajService.yansit(sonuc.mesajlar);
                                    return new fromAuthActions.SifreKurtarSuccess();
                                } else {
                                    this.mesajService.hatalar(sonuc.hatalar);
                                    return new fromAuthActions.SifreKurtarFailed();
                                }
                            }),
                            catchError(err => of(new fromAuthActions.SifreKurtarFailed()))
                        );
                })
            );

}
