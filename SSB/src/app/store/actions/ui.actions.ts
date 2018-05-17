import { Action } from '@ngrx/store';
import { Dil } from '../../models/dil';


export const UI_START_LOADING = '[UI] Start Loading';
export const UI_STOP_LOADING = '[UI] Stop Loading';
export const UI_LANGUAGE_CHANGE = '[UI] Change Language';
export const UI_LANGUAGE_CHANGED = '[UI] Changed Language';
export const UI_LANGUAGE_CHANGED_FAILED = '[UI] Changed Language Failed';


export class StartLoading implements Action {
    readonly type = UI_START_LOADING;

    constructor() {
    }
}
export class StopLoading implements Action {
    readonly type = UI_STOP_LOADING;

    constructor() {
    }

}

export class ChangeLanguage implements Action {
    readonly type = UI_LANGUAGE_CHANGE;

    constructor(public payload: Dil) {
    }
}

export class LanguageChanged implements Action {
    readonly type = UI_LANGUAGE_CHANGED;

    constructor(public payload: Dil) {
    }
}

export class LanguageChangedFailed implements Action {
    readonly type = UI_LANGUAGE_CHANGED_FAILED;
    constructor() {
    }
}
export type UIActionsTypes = StartLoading | StopLoading | ChangeLanguage | LanguageChanged | LanguageChangedFailed;
