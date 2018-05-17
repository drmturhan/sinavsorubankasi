import { tassign } from 'tassign';

import { Action, createFeatureSelector } from '@ngrx/store';

import { Dil } from '../../models/dil';
import * as UIActions from '../actions/ui.actions';




export interface UIState {
    loading: boolean;
    dil: Dil | null;
    calisanKomutSayisi: number;
}
const initialAppState: UIState = {
    loading: false,
    dil: null,
    calisanKomutSayisi: 0
};

export function uiReducer(state = initialAppState, action: UIActions.UIActionsTypes): UIState {
    switch (action.type) {

        case UIActions.UI_START_LOADING:
            return tassign(state, { loading: true, calisanKomutSayisi: state.calisanKomutSayisi + 1 });

        case UIActions.UI_STOP_LOADING:
            let cks = 0;
            if (state.calisanKomutSayisi > 0) {
                cks = state.calisanKomutSayisi - 1;
            }
            return tassign(state, { loading: false, calisanKomutSayisi: cks });

        case UIActions.UI_LANGUAGE_CHANGED:
            return tassign(state, { dil: action.payload });
        case UIActions.UI_LANGUAGE_CHANGED_FAILED:
            return tassign(state, { dil: initialAppState.dil });
        default:
            return state;
    }

}
export const getUIState = createFeatureSelector<UIState>('ui');





