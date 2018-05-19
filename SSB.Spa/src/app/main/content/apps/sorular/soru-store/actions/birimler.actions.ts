import { Action } from '@ngrx/store';
import { SoruBirimItem, DersItem, KonuItem } from '../../models/birim-program-donem-ders';

export const BIRIMLER_SIFIRLA = '[BIRIMLER] SIFIRLA';

export const GET_BIRIMLER = '[BIRIMLER] GET BIRIMLER';
export const GET_BIRIMLER_SUCCESS = '[BIRIMLER] GET BIRIMLER SUCCESS';
export const GET_BIRIMLER_FAILED = '[BIRIMLER] GET BIRIMLER FAILED';

export const GET_DERSLER = '[DERSLER] GET DERSLER';
export const GET_DERSLER_SUCCESS = '[DERSLER] GET BIRIMLER SUCCESS';

export const SEC_AKTIF_BIRIM = '[BIRIMLER] SEC AKTIF BIRIM';
export const SEC_AKTIF_DERS = '[BIRIMLER] SEC AKTIF DERS';
export const SEC_AKTIF_KONU = '[BIRIMLER] SEC AKTIF KONU';
export const KONTROL_ET_AKTIF_BIRIM = '[BIRIMLER] KONTROL ET AKTIF BIRIM';
export const BIRIM_ILKINI_SEC = '[BIRIMLER] BIRIM ILKINI SEC';


export class BirimleriSifirla implements Action {
    readonly type = BIRIMLER_SIFIRLA;
    constructor() {
    }
}

export class GetBirimler implements Action {
    readonly type = GET_BIRIMLER;
    constructor(public payload: any) {
    }
}
export class GetBirimlerSuccess implements Action {
    readonly type = GET_BIRIMLER_SUCCESS;
    constructor(public payload: SoruBirimItem[]) {
    }
}
export class GetDersler implements Action {
    readonly type = GET_DERSLER;

}
export class GetDerslerSuccess implements Action {

    readonly type = GET_DERSLER_SUCCESS;
    constructor(public payload: DersItem[]) { }
}

export class GetBirimlerFailed implements Action {
    readonly type = GET_BIRIMLER_FAILED;

    constructor(public payload: string) {
    }
}


export class SecAktifBirim implements Action {
    readonly type = SEC_AKTIF_BIRIM;
    constructor(public payload: SoruBirimItem) {
    }
}


export class SecAktifDers implements Action {
    readonly type = SEC_AKTIF_DERS;
    constructor(public payload: DersItem) {
    }
}

export class SecAktifKonu implements Action {
    readonly type = SEC_AKTIF_KONU;
    constructor(public payload: { ders: DersItem, konu: KonuItem }) {
    }
}

export class KontrolEtAktifBirim implements Action {
    readonly type = KONTROL_ET_AKTIF_BIRIM;
    constructor() { }
}
export class IlkBirimiSec implements Action {
    readonly type = BIRIM_ILKINI_SEC;
    constructor(public payload: boolean) { }
}


export type BirimlerActionsAll
    = BirimleriSifirla
    | GetBirimler
    | GetBirimlerSuccess
    | GetDerslerSuccess
    | GetDersler
    | GetBirimlerFailed
    | SecAktifBirim
    | SecAktifDers
    | SecAktifKonu
    | KontrolEtAktifBirim
    | IlkBirimiSec;
