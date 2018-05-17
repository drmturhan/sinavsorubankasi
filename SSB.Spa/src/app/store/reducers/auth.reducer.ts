import { tassign } from 'tassign';
import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import { KullaniciBilgi } from '../../models/kullanici';


export interface AuthState {
    kullaniciBilgi: KullaniciBilgi | null;
    tokenString: string | null;
    hataliDenemeSayisi: number;
    girisGerekli: boolean;
    sifreKurtarmaEkraniniAc: boolean;
    kullaniciAdi: string;
    facebookLoginProgress: boolean;
    girisKilitlendi: boolean;
    loading: boolean;
    loaded: any;
}
const initialAuthState: AuthState = {
    kullaniciBilgi: null,
    tokenString: null,
    hataliDenemeSayisi: 0,
    girisGerekli: false,
    sifreKurtarmaEkraniniAc: false,
    kullaniciAdi: null,
    facebookLoginProgress: false,
    girisKilitlendi: false,
    loading: false,
    loaded: false

};

export function authReducer(state = initialAuthState, action: AuthActions.AUTHActionsTypes): AuthState {
    switch (action.type) {


        case AuthActions.AUTH_LOGIN_READ:
            return tassign(state);
        case AuthActions.AUTH_LOGIN_CHECK:
            return tassign(state);

        case AuthActions.AUTH_LOGIN_REQUIRED:
            return tassign(state, { girisGerekli: true });
        case AuthActions.AUTH_LOGIN_START:
            return tassign(state, { loading: true, loaded: false });

        case AuthActions.AUTH_LOGIN_CANCELLED:
            return tassign(state, {
                loading: false,
                loaded: true,
                kullaniciBilgi: null,
                girisGerekli: false,
                facebookLoginProgress: false,
                tokenString: null
            });

        case AuthActions.AUTH_LOGIN_RESET_COUNTER:

            return tassign(state, { hataliDenemeSayisi: 0, girisKilitlendi: false });


        case AuthActions.AUTH_LOGIN_SUCCESS:
            return tassign(state, {
                kullaniciBilgi: action.payload.kullanici,
                kullaniciAdi: action.payload.kullanici.kullaniciAdi,
                tokenString: action.payload.tokenString,
                hataliDenemeSayisi: 0,
                girisGerekli: false,
                facebookLoginProgress: false,
                girisKilitlendi: null,
                loaded: true,
                loading: false
            });

        case AuthActions.AUTH_LOGIN_FAILED:

            return tassign(state, {
                hataliDenemeSayisi: state.hataliDenemeSayisi + 1,
                kullaniciBilgi: null,
                kullaniciAdi: action.payload,
                facebookLoginProgress: false,
                loaded: true,
                loading: false
            });

        case AuthActions.AUTH_FACEBOOK_LOGIN_PROGRESS:
            return tassign(state, {
                facebookLoginProgress: true
            });

        case AuthActions.AUTH_FACEBOOK_LOGIN_FAILED:
            return tassign(state, {
                hataliDenemeSayisi: state.hataliDenemeSayisi + 1,
                kullaniciBilgi: null,
                girisGerekli: true,
                facebookLoginProgress: false
            });

        case AuthActions.AUTH_LOGOUT_START:
            return tassign(state, {
                girisGerekli: false,
                facebookLoginProgress: false
            });

        case AuthActions.AUTH_LOGOUT_SUCCESS:
            return tassign(initialAuthState);


        case AuthActions.AUTH_SIFREKURTAR_REQUIRED:
            return tassign(state, { sifreKurtarmaEkraniniAc: true });
        case AuthActions.AUTH_SIFREKURTAR_SUCCESS:
            return tassign(state, { sifreKurtarmaEkraniniAc: false });
        case AuthActions.AUTH_SIFREKURTAR_FAILED:
            return tassign(state, { sifreKurtarmaEkraniniAc: true });
        case AuthActions.AUTH_SIFREKURTAR_CANCELLED:
            return tassign(state, { sifreKurtarmaEkraniniAc: false });

        case AuthActions.AUTH_KULLANICI_BILGI_DEGISTI:
            return tassign(state, {
                kullaniciBilgi: action.payload
            });

        default: return state;
    }
}

export const getAuthState = createFeatureSelector<AuthState>('auth');

export const getGirisGerekliState = createSelector(getAuthState, (state: AuthState) => state.girisGerekli);

export const getHataliDenemeSayisi = createSelector(getAuthState, (state: AuthState) => state.hataliDenemeSayisi);

