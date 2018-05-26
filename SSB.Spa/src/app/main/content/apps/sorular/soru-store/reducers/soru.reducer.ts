import { SoruListe } from '../../models/soru';
import * as SorularActions from '../actions/sorular.actions';
import { tassign } from 'tassign';


export interface SorularState {
    entities: { [id: number]: SoruListe };
    currentSoru: any;
    selectedSoruIds: string[];
    searchText: string;
    loading: boolean;
    loaded: any;
    hataMesaji: string | null;
}

export const SorularInitialState: SorularState = {
    entities: {},
    currentSoru: null,
    selectedSoruIds: [],
    searchText: '',
    loading: false,
    loaded: false,
    hataMesaji: null
};

export function SorularReducer(state = SorularInitialState, action: SorularActions.SorularActionsAll): SorularState {
    switch (action.type) {

        case SorularActions.SORULAR_SIFIRLA: {
            return tassign(SorularInitialState);
        }
        case SorularActions.GET_SORULAR: {
            return tassign(state, { loading: true });
        }
        case SorularActions.GET_SORULAR_TAMAM:
            {
                const sorular = action.payload.sorular.donenListe;
                const loaded = action.payload.loaded;

                const entities = sorular.reduce(
                    (_entities: { [soruId: number]: SoruListe }, soru: SoruListe) => {
                        return {
                            ..._entities,
                            [soru.soruId]: soru
                        };
                    }, {});
                return tassign(state, {
                    entities: entities,
                    loading: false,
                    loaded
                });

            }
        case SorularActions.GET_SORULAR_BASARISIZ:
            {
                return tassign(state, {
                    entities: {},
                    loading: false,
                    loaded: false,
                    hataMesaji: action.payload
                });
            }


        case SorularActions.SET_AKTIF_SORU_SUCCESS:
            {
                return {
                    ...state,
                    currentSoru: action.payload
                };
            }
        case SorularActions.SET_SORULAR_ARAMA_CUMLESI:
            {

                return {
                    ...state,
                    searchText: action.payload
                };
            }


        case SorularActions.SELECT_SORULAR_TUMU:
            {
                const arr = Object.keys(state.entities).map(k => state.entities[k]);

                const tumSorular = arr.map(soru => soru.soruId);

                return {
                    ...state,
                    selectedSoruIds: tumSorular
                };
            }
        case SorularActions.DESELECT_SORULAR_TUMU:
            {
                return {
                    ...state,
                    selectedSoruIds: []
                };
            }

        case SorularActions.UPDATE_SORU_TAMAM: {
            return tassign(
                state, {
                    entities: tassign(state.entities, {
                        [action.payload.soruId]: action.payload
                    }),
                    selectedSoruIds: [],
                    currentSoru: action.payload
                });

        }

        case SorularActions.SORU_SIL_TAMAM: {
            const soruIdleri = action.payload;
            const arr = Object.keys(state.entities).map(k => state.entities[k]);

            let i = arr.length;
            while (i--) {
                if (arr[i] && arr[i].hasOwnProperty('soruId') && soruIdleri.indexOf((arr[i]['soruId']).toString()) > -1) {
                    arr.splice(i, 1);
                }
            }

            const entities = arr.reduce(
                (_entities: { [soruId: number]: SoruListe }, soru: SoruListe) => {
                    return {
                        ..._entities,
                        [soru.soruId]: soru
                    };
                }, {});
            return tassign(state, {
                entities: entities,
                loading: false,
                loaded: arr
            });


        }

        case SorularActions.SORU_SECIMI_DEGISTIR: {
            const soruId = action.payload;

            let selectedSorularinNumaralari = [...state.selectedSoruIds];

            const sonuc = selectedSorularinNumaralari.find(id => id === soruId);
            if (sonuc !== undefined) {
                selectedSorularinNumaralari = selectedSorularinNumaralari.filter(id => id !== soruId);
            }
            else {
                selectedSorularinNumaralari = [...selectedSorularinNumaralari, soruId];
            }

            return tassign(
                state,
                {
                    selectedSoruIds: selectedSorularinNumaralari
                }
            );

        }
        default:
            return state;
    }
}

