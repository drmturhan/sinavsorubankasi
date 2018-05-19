
import * as fromGerekliListeler from '../actions/gerekli-listeler.actions';
import { tassign } from 'tassign';
import { SoruBilisselDuzeyItem, SoruTipItem, SoruZorlukItem } from '../../models/birim-program-donem-ders';

export interface SoruGerekliListelerState {
    bilisselDuzeyler: SoruBilisselDuzeyItem[];
    soruTipleri: SoruTipItem[];
    soruZorluklari: SoruZorlukItem[];
    loading: boolean;
    soruTipleriLoaded: any;
    soruZorluklariLoaded: any;
    bilisselDuzeylerLoaded: any;

}

export const SoruGerekliListelerInitialState: SoruGerekliListelerState = {
    bilisselDuzeyler: [],
    soruTipleri: [],
    soruZorluklari: [],
    loading: false,
    soruTipleriLoaded: false,
    soruZorluklariLoaded: false,
    bilisselDuzeylerLoaded: false
};



export function SoruGerekliListelerReducer(state = SoruGerekliListelerInitialState, action: fromGerekliListeler.GerekliListelerActionsAll): SoruGerekliListelerState {
    switch (action.type) {
        case fromGerekliListeler.GET_BILISSEL_DUZEYLER: {
            return tassign(state, {
                loading: true,
                bilisselDuzeylerLoaded: false
            });
        }
        case fromGerekliListeler.GET_BILISSEL_DUZEYLER_TAMAM: {
            return tassign(state, {
                bilisselDuzeyler: action.payload,
                loading: false,
                bilisselDuzeylerLoaded: true
            });
        }
        case fromGerekliListeler.GET_BILISSEL_DUZEYLER_HATA: {
            return tassign(state, {
                loading: false,
                bilisselDuzeylerLoaded: false
            });
        }
        case fromGerekliListeler.GET_SORU_TIPLERI: {
            return tassign(state, {
                loading: true,
                soruTipleriLoaded: false
            });
        }
        case fromGerekliListeler.GET_SORU_TIPLERI_TAMAM: {
            return tassign(state, {
                soruTipleri: action.payload,
                loading: false,
                soruTipleriLoaded: true
            });
        }
        case fromGerekliListeler.GET_SORU_TIPLERI_HATA: {
            return tassign(state, {
                loading: false,
                soruTipleriLoaded: false
            });
        }



        case fromGerekliListeler.GET_SORU_ZORLUKLARI: {
            return tassign(state, {
                loading: true,
                soruZorluklariLoaded: false
            });
        }
        case fromGerekliListeler.GET_SORU_ZORLUKLARI_TAMAM: {
            return tassign(state, {
                soruZorluklari: action.payload,
                loading: false,
                soruZorluklariLoaded: true
            });
        }
        case fromGerekliListeler.GET_SORU_ZORLUKLARI_HATA: {
            return tassign(state, {
                loading: false,
                soruZorluklariLoaded: false
            });
        }

        default: return state;
    }
}
