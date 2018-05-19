import { createSelector } from '@ngrx/store';
import { getSoruDepoAppState, SoruDepoAppState, SoruGerekliListelerState } from '../reducers';

export const getGerekliListelerState = createSelector(
    getSoruDepoAppState,
    (state: SoruDepoAppState) => state.gerekliListeler
);


export const getBilisselDuzeyler = createSelector(
    getGerekliListelerState,
    (state: SoruGerekliListelerState) => state.bilisselDuzeyler
);

export const getSoruTipleri = createSelector(
    getGerekliListelerState,
    (state: SoruGerekliListelerState) => state.soruTipleri
);


export const getSoruZorluklari = createSelector(
    getGerekliListelerState,
    (state: SoruGerekliListelerState) => state.soruZorluklari
);

export const getSoruTipleriLoaded = createSelector(
    getGerekliListelerState,
    (state: SoruGerekliListelerState) => state.soruTipleriLoaded
);
export const getSoruZorluklariLoaded = createSelector(
    getGerekliListelerState,
    (state: SoruGerekliListelerState) => state.soruZorluklariLoaded
);

export const getBilisselDuzeylerLoaded = createSelector(
    getGerekliListelerState,
    (state: SoruGerekliListelerState) => state.bilisselDuzeylerLoaded
);
