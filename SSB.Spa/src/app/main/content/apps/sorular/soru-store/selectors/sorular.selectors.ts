import { createSelector } from '@ngrx/store';
import { getSoruDepoAppState, SoruDepoAppState, SorularState } from '../reducers';
import { FuseUtils } from '@fuse/utils';
import { SoruListe } from '../../models/soru';


export const getSorularState = createSelector(getSoruDepoAppState, (state: SoruDepoAppState) => state.sorular);
export const getSorular = createSelector(getSorularState, (state: SorularState) => state.entities);
export const getSorularLoaded = createSelector(getSorularState, (state: SorularState) => state.loaded);
export const getSorularLoading = createSelector(getSorularState, (state: SorularState) => state.loading);
export const getSorularAramaCumlesi = createSelector(getSorularState, (state: SorularState) => state.searchText);

export const getSorularArr = createSelector(
    getSorular,
    getSorularAramaCumlesi,
    (entities, searchText) => {
        const arr: SoruListe[] = Object.keys(entities).map((id) => entities[id]);
        return FuseUtils.filterArrayByString(arr, searchText);
    }
);


export const getCurrentSoru = createSelector(
    getSorularState,
    (state: SorularState) => state.currentSoru
);

export const getSelectedSoruNumaralari = createSelector(
    getSorularState,
    (state: SorularState) => state.selectedSoruIds
);

export const getSorulardaHataVar = createSelector(
    getSorularState,
    (state: SorularState) => state.hataMesaji
);


