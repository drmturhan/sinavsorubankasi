import { createSelector } from '@ngrx/store';
import { getSoruDepoAppState, SoruDepoAppState, BirimlerState } from '../reducers';


export const getBirimlerState = createSelector(
    getSoruDepoAppState,
    (state: SoruDepoAppState) => state.birimler
);

export const getBirimler = createSelector(
    getBirimlerState,
    (state: BirimlerState) => state.entities
);
export const getAktifBirim = createSelector(
    getBirimlerState,
    (state: BirimlerState) => state.aktifBirim
);

export const getAktifDers = createSelector(
    getBirimlerState,
    (state: BirimlerState) => state.aktifDers
);
export const getAktifKonu = createSelector(
    getBirimlerState,
    (state: BirimlerState) => state.aktifKonu
);
export const getBirimlerLoaded = createSelector(
    getBirimlerState,
    (state: BirimlerState) => state.loaded
);

export const getBirimlerArr = createSelector(
    getBirimler,
    (entities) => Object.keys(entities).map((birimId) => entities[birimId])
);
export const getDersler = createSelector(
    getBirimlerState,
    (state: BirimlerState) => state.dersler
);

