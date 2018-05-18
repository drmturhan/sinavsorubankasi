import { Action } from '@ngrx/store';
import { ArkadaslikSorgusu, ArkadaslikTeklif } from '../../models/arkadaslik-teklif';

export const ARKADASLAR_LISTE_AL = '[ARKADASLAR] LISTE AL';
export const ARKADASLAR_LISTE_AL_TAMAM = '[ARKADASLAR] LISTE AL TAMAM';
export const ARKADASLAR_LISTE_AL_HATAVAR = '[ARKADASLAR] LISTE AL HATA VAR';
export const ARKADASLAR_LISTESI_DEGISTI = '[ARKADASLAR] LISTE DEGISTI';


export const ARKADASLAR_SORGU_DEGISTIR = '[ARKADASLAR] SORGU DEGISTIR';

export class ArkadaslarListeAl implements Action {
    readonly type = ARKADASLAR_LISTE_AL;
    constructor(public payload: ArkadaslikSorgusu) { }
}

export class ArkadaslarListeAlTamam implements Action {
    readonly type = ARKADASLAR_LISTE_AL_TAMAM;
    constructor(public payload: any) { }
}

export class ArkadaslarListeAlHataVar implements Action {
    readonly type = ARKADASLAR_LISTE_AL_HATAVAR;
    constructor(public payload: any) { }
}

export class ArkadaslarSorguDegistir implements Action {
    readonly type = ARKADASLAR_SORGU_DEGISTIR;
    constructor(public payload: ArkadaslikSorgusu) { }
}

export class ArkadaslarListesiDegisti implements Action {
    readonly type = ARKADASLAR_LISTESI_DEGISTI;
    constructor(public payload: ArkadaslikTeklif) { }
}

export type ArkadaslarActions = ArkadaslarListeAl | ArkadaslarListeAlTamam | ArkadaslarListeAlHataVar | ArkadaslarSorguDegistir | ArkadaslarListesiDegisti;
