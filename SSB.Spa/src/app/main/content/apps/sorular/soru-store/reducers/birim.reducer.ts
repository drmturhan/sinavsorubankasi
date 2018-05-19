
import * as fromBirimlerActions from '../actions/birimler.actions';
import { tassign } from 'tassign';
import { SoruBirimItem, DersItem, KonuItem } from '../../models/birim-program-donem-ders';



export interface BirimlerState {

    entities: { [birimId: number]: SoruBirimItem };
    dersler: DersItem[];
    aktifBirim: SoruBirimItem;
    aktifDers: DersItem;
    aktifKonu: KonuItem;
    loading: boolean;
    loaded: any;
}

export const BirimInitialState: BirimlerState = {
    entities: {},
    dersler: [],
    aktifBirim: null,
    aktifDers: null,
    aktifKonu: null,
    loading: false,
    loaded: false
};

export function BirimlerReducer(state = BirimInitialState, action: fromBirimlerActions.BirimlerActionsAll): BirimlerState {

    switch (action.type) {
        case fromBirimlerActions.BIRIMLER_SIFIRLA: {

            return tassign(BirimInitialState);
        }

        case fromBirimlerActions.GET_BIRIMLER: {
            return tassign(state, {
                loading: true,
                loaded: false
            });
        }
        case fromBirimlerActions.GET_BIRIMLER_SUCCESS: {
            const birimler = action.payload;
            const entities = birimler.reduce(
                (_entities: { [birimId: number]: SoruBirimItem }, soruBirim: SoruBirimItem) => {
                    return {
                        ..._entities,
                        [soruBirim.birimId]: soruBirim
                    };
                }, {});
            return {
                ...state,
                loading: false,
                loaded: true,
                entities
            };
        }
        case fromBirimlerActions.GET_DERSLER: {
            return tassign(state, { dersler: state.dersler });
        }
        case fromBirimlerActions.GET_DERSLER_SUCCESS: {
            const dersler = [];
            if (state.dersler) {
                Object.assign(dersler, [], state.dersler);
            }

            action.payload.forEach(ders => {
                if (dersler.indexOf(ders) < 0) {
                    dersler.push(ders);
                }
            });
            return tassign(state, { dersler: dersler });

        }

        case fromBirimlerActions.GET_BIRIMLER_FAILED: {
            return {
                ...state,
                loading: false,
                loaded: false
            };
        }
        case fromBirimlerActions.SEC_AKTIF_BIRIM: {
            const gelen = action.payload;
            let ders: DersItem = null;
            if (gelen != null && gelen.programlari.length > 0 && gelen.programlari[0].donemleri.length > 0) {
                if (gelen.programlari[0].donemleri[0].dersGruplari.length > 0) {
                    ders = gelen.programlari[0].donemleri[0].dersGruplari[0].dersleri[0];
                }
            }
            if (ders != null && ders.dersId > 0) {
                return tassign(state, { aktifBirim: gelen, aktifDers: ders });
            }
            return tassign(state, { aktifBirim: gelen, aktifDers: null, aktifKonu: null });
        }

        case fromBirimlerActions.SEC_AKTIF_DERS: {
            const gelen = action.payload;
            return tassign(state, { aktifDers: gelen });
        }
        case fromBirimlerActions.SEC_AKTIF_KONU: {
            const gelen = action.payload;
            return tassign(state, { aktifDers: gelen.ders, aktifKonu: gelen.konu });
        }

        case fromBirimlerActions.KONTROL_ET_AKTIF_BIRIM: {
            return tassign(state);
        }

        case fromBirimlerActions.BIRIM_ILKINI_SEC: {
            const birimler = Object.keys(state.entities).map((birimId) => state.entities[birimId]);
            let birim: SoruBirimItem = null;
            if (birimler != null && birimler.length > 0) {
                birim = birimler[0];
            }

            let ders: DersItem = null;
            if (birim != null && birim.programlari.length > 0 && birim.programlari[0].donemleri.length > 0) {
                if (birim.programlari[0].donemleri[0].dersGruplari.length > 0) {
                    ders = birim.programlari[0].donemleri[0].dersGruplari[0].dersleri[0];
                }
            }
            let konu: KonuItem = null;
            if (ders != null && ders.konulari.length > 0) {
                konu = ders.konulari[0];
            }

            if (action.payload === false) {
                return tassign(state, { aktifBirim: birim, aktifDers: null, aktifKonu: null });
            } else {
                return tassign(state, { aktifBirim: birim, aktifDers: ders, aktifKonu: konu });
            }

        }
        default:
            return state;
    }
}

