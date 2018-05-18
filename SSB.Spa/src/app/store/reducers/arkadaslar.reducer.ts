import { tassign } from 'tassign';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromArkadaslarActions from '../actions/arkadaslar.actions';
import { State } from '.';
import { ArkadaslikTeklif, ArkadaslikSorgusu } from '../../models/arkadaslik-teklif';
import { ListeSonuc } from '../../models/sonuclar';



export interface ArkadaslarState {
    entities: { [kullaniciNo: number]: ArkadaslikTeklif };
    arkadaslarim: ListeSonuc<ArkadaslikTeklif>;
    sorgu: ArkadaslikSorgusu;
    loading: boolean;
    loaded: any;
}

export const ArkadaslarInitialState: ArkadaslarState = {
    entities: {},
    arkadaslarim: null,
    sorgu: new ArkadaslikSorgusu(),
    loading: false,
    loaded: false
};

export function ArkadaslarReducer(state = ArkadaslarInitialState, action: fromArkadaslarActions.ArkadaslarActions): ArkadaslarState {

    switch (action.type) {
        case fromArkadaslarActions.ARKADASLAR_LISTE_AL:
            return tassign(state, {
                loading: true,
                loaded: false
            });

        case fromArkadaslarActions.ARKADASLAR_LISTE_AL_TAMAM: {
            const gelenArkadaslar = action.payload.donenListe;
            const entities = gelenArkadaslar.reduce(
                (_entities: { [id: string]: ArkadaslikTeklif }, arkadas: ArkadaslikTeklif) => {
                    return {
                        ..._entities, [arkadas.id]: arkadas
                    };
                }, {});
            return {
                ...state,
                loading: false,
                loaded: true,
                entities,
                arkadaslarim: action.payload
            };
        }
        case fromArkadaslarActions.ARKADASLAR_LISTESI_DEGISTI: {
            const gelen = action.payload;
            const yeniKayit = state.entities[gelen.id] === null;
            const entitiler = Object.assign({}, state.entities);
            const arkadaslarimListesi = Object.assign({}, state.arkadaslarim);
            entitiler[gelen.id] = gelen;

            if (yeniKayit) {
                arkadaslarimListesi.donenListe.push(gelen);
                arkadaslarimListesi.kayitSayisi++;
            } else {
                const indeks = state.arkadaslarim.donenListe.findIndex(k => k.id === gelen.id);
                if (indeks > -1) {
                    arkadaslarimListesi.donenListe = state.arkadaslarim.donenListe.map(m => {
                        if (m.id === gelen.id) { return gelen; } else { return m; }
                    }
                    );
                }
            }

            return tassign(state, { entities: entitiler, arkadaslarim: arkadaslarimListesi });

        }
        case fromArkadaslarActions.ARKADASLAR_LISTE_AL_HATAVAR: {
            return tassign(state, {
                loading: false,
                loaded: false
            });
        }

        case fromArkadaslarActions.ARKADASLAR_SORGU_DEGISTIR: {
            return tassign(state, {
                sorgu: action.payload
            });
        }
        default: return state;

    }
}


export const getArkadaslikTeklifleri = (state: State) => state.arkadaslar;

export const getArkadaslarLoaded = createSelector(
    getArkadaslikTeklifleri,
    (state: ArkadaslarState) => state.loaded
);
export const getArkadaslikSorgusu = createSelector(

    getArkadaslikTeklifleri,
    (state: ArkadaslarState) => state.sorgu
);



