import { createFeatureSelector, createSelector, ActionReducerMap } from '@ngrx/store';
import { SorularState, SorularReducer } from './soru.reducer';
import { BirimlerState, BirimlerReducer } from './birim.reducer';
import { SoruGerekliListelerState, SoruGerekliListelerReducer } from './gerekli-listeler.reducers';


export interface SoruDepoAppState {
    birimler: BirimlerState;
    sorular: SorularState;
    gerekliListeler: SoruGerekliListelerState;

}


export const getSoruDepoAppState = createFeatureSelector<SoruDepoAppState>(
    'soru-depo-app'
);


export const getAppState = createSelector(
    getSoruDepoAppState,
    (state: SoruDepoAppState) => state
);

export const reducers: ActionReducerMap<SoruDepoAppState> = {
    birimler: BirimlerReducer,
    sorular: SorularReducer,
    gerekliListeler: SoruGerekliListelerReducer
};


export * from './birim.reducer';
export * from './soru.reducer';
export * from './gerekli-listeler.reducers';


