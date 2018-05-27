import { Action } from '@ngrx/store';
import { SoruListe } from '../../models/soru';

export const GET_SORULAR = '[SORULAR] GET SORULAR';
export const GET_SORULAR_TAMAM = '[SORULAR] GET SORULAR TAMAM';
export const GET_SORULAR_BASARISIZ = '[SORULAR] GET SORULAR BASARISIZ';
export const SET_SORULAR_ARAMA_CUMLESI = '[SORULAR] SET SORULAR ARAMA CUMLESI';




export const UPDATE_SORU = '[SORULAR] UPDATE SORU';
export const UPDATE_SORU_TAMAM = '[SORULAR] UPDATE SORU TAMAM';

export const SORU_AC_KAPA = '[SORULAR] SORU AC KAPA';
export const SORU_FAVORI_DEGISTIR = '[SORULAR] SORU FAVORI DEGISTIR';


export const UPDATE_SORULAR = '[SORULAR] UPDATE SORULAR';
export const UPDATE_SORULAR_TAMAM = '[SORULAR] UPDATE SORULAR TAMAM';

export const SORULAR_YUKLENSIN = '[SORULAR] YUKLE SORULAR';

export const SORU_SIL = '[SORULAR] SORU SILINDI OLARAK ISARETLE';
export const SORU_SIL_TAMAM = '[SORULAR] SORU SILINDI TAMAM';


export const SET_AKTIF_SORU = '[SORULAR] SET AKTIF SORU';
export const SET_AKTIF_SORU_SUCCESS = '[SORULAR] SET AKTIF SORU SUCCESS';


export const SELECT_SORULAR_TUMU = '[SORULAR] SELECT SORULAR TUMU';
export const SORU_SECIMI_DEGISTIR = '[SORULAR] SORU SECIMI DEGISTIR';

export const SORULAR_SIFIRLA = '[SORULAR] SIFIRLA';

export const SELECT_SORULAR_PARAMETREYE_GORE = '[SORULAR] SELECT SORULAR PARAMETREYE GORE';
export const DESELECT_SORULAR_TUMU = '[SORULAR] DESELECT SORULAR TUMU';

export class SorulariSifirla implements Action {
    readonly type = SORULAR_SIFIRLA;
    constructor() {
    }
}

export class GetSorular implements Action {
    readonly type = GET_SORULAR;

    constructor() {
    }
}

export class GetSorularTamam implements Action {
    readonly type = GET_SORULAR_TAMAM;

    constructor(public payload: any) {
    }
}
export class GetSorularBasarisiz implements Action {
    readonly type = GET_SORULAR_BASARISIZ;

    constructor(public payload: string) {
    }
}
export class SetAktifSoru implements Action {
    readonly type = SET_AKTIF_SORU;

    constructor(public payload: string) {
    }
}
export class SetAktifSoruSuccess implements Action {
    readonly type = SET_AKTIF_SORU_SUCCESS;

    constructor(public payload: any) {
    }
}
export class SetSorularAramaCumlesi implements Action {
    readonly type = SET_SORULAR_ARAMA_CUMLESI;

    constructor(public payload: string) {
    }
}
export class SelectSorularTumu implements Action {
    readonly type = SELECT_SORULAR_TUMU;

    constructor() {
    }
}
export class SelectSorularParametreyeGore implements Action {
    readonly type = SELECT_SORULAR_PARAMETREYE_GORE;

    constructor(public payload: any) {
    }
}
export class DeselectSorularTumu implements Action {
    readonly type = DESELECT_SORULAR_TUMU;

    constructor() {
    }
}


export class UpdateSoru implements Action {
    readonly type = UPDATE_SORU;

    constructor(public payload: any) {
    }
}

export class SoruAcKapa implements Action {
    readonly type = SORU_AC_KAPA;

    constructor(public payload: { soruNo: number, ac: boolean }) {
    }
}


export class SoruFavoriDegistir implements Action {
    readonly type = SORU_FAVORI_DEGISTIR;

    constructor(public payload: { soruNo: number, favori: boolean }) {
    }
}

export class SorulariYenidenYukle implements Action {
    readonly type = SORULAR_YUKLENSIN;
    constructor() {
    }

}


export class UpdateSoruTamam implements Action {
    readonly type = UPDATE_SORU_TAMAM;
    constructor(public payload: SoruListe) {
    }

}
export class UpdateSorular implements Action {
    readonly type = UPDATE_SORULAR;

    constructor(public payload: SoruListe[]) {
    }
}

export class SoruSilindiIsaretle implements Action {
    readonly type = SORU_SIL;
    constructor(public payload: string[]) {
    }

}
export class SoruSilindi implements Action {
    readonly type = SORU_SIL_TAMAM;

    constructor(public payload: string[]) {
    }
}


export class UpdateSorularTamam implements Action {
    readonly type = UPDATE_SORULAR_TAMAM;

    constructor(public payload: SoruListe[]) {
    }
}

export class SoruSecimiDegistir implements Action {
    readonly type = SORU_SECIMI_DEGISTIR;

    constructor(public payload: string) {
    }
}

export type SorularActionsAll
    = SorulariSifirla
    | GetSorular
    | GetSorularTamam
    | GetSorularBasarisiz
    | SetSorularAramaCumlesi
    | SetAktifSoru
    | SetAktifSoruSuccess
    | SelectSorularTumu
    | SelectSorularParametreyeGore
    | DeselectSorularTumu
    | UpdateSoru
    | SoruAcKapa
    | SoruFavoriDegistir
    | UpdateSoruTamam
    | UpdateSorular
    | UpdateSorularTamam
    | SorulariYenidenYukle
    | SoruSilindi
    | SoruSilindiIsaretle
    | SoruSecimiDegistir;
