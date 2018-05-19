import { Action } from '@ngrx/store';
import { SoruZorlukItem, SoruBilisselDuzeyItem, SoruTipItem } from '../../models/birim-program-donem-ders';


export const GET_BILISSEL_DUZEYLER = '[GEREKLILISTELER] GET BILISSEL DUZEYLER';
export const GET_BILISSEL_DUZEYLER_TAMAM = '[GEREKLILISTELER] GET BILISSEL DUZEYLER TAMAM';
export const GET_BILISSEL_DUZEYLER_HATA = '[GEREKLILISTELER] GET BILISSEL DUZEYLER HATA';



export const GET_SORU_TIPLERI = '[GEREKLILISTELER] GET SORU TIPLERI';
export const GET_SORU_TIPLERI_TAMAM = '[GEREKLILISTELER] GET SORU TIPLERI TAMAM';
export const GET_SORU_TIPLERI_HATA = '[GEREKLILISTELER] GET SORU TIPLERI HATA';



export const GET_SORU_ZORLUKLARI = '[GEREKLILISTELER] GET SORU ZORLUKLARI';
export const GET_SORU_ZORLUKLARI_TAMAM = '[GEREKLILISTELER] GET SORU ZORLUKLARI TAMAM';
export const GET_SORU_ZORLUKLARI_HATA = '[GEREKLILISTELER] GET SORU ZORLUKLARI HATA';




export class GetBilisselDuzeyler implements Action {
    readonly type = GET_BILISSEL_DUZEYLER;
    constructor() {
    }
}


export class GetBilisselDuzeylerTamam implements Action {
    readonly type = GET_BILISSEL_DUZEYLER_TAMAM;
    constructor(public payload: SoruBilisselDuzeyItem[]) {
    }
}


export class GetBilisselDuzeylerHata implements Action {
    readonly type = GET_BILISSEL_DUZEYLER_HATA;
    constructor() {
    }
}



export class GetSoruTipleri implements Action {
    readonly type = GET_SORU_TIPLERI;
    constructor() {
    }
}


export class GetSoruTipleriTamam implements Action {
    readonly type = GET_SORU_TIPLERI_TAMAM;
    constructor(public payload: SoruTipItem[]) {
    }
}


export class GetSoruTipleriHata implements Action {
    readonly type = GET_SORU_TIPLERI_HATA;
    constructor() {
    }
}



export class GetSoruZorluklari implements Action {
    readonly type = GET_SORU_ZORLUKLARI;
    constructor() {
    }
}


export class GetSoruZorluklariTamam implements Action {
    readonly type = GET_SORU_ZORLUKLARI_TAMAM;
    constructor(public payload: SoruZorlukItem[]) {
    }
}


export class GetSoruZorluklariHata implements Action {
    readonly type = GET_SORU_ZORLUKLARI_HATA;
    constructor() {
    }
}


export type GerekliListelerActionsAll
    = GetBilisselDuzeyler
    | GetBilisselDuzeylerTamam
    | GetBilisselDuzeylerHata
    | GetSoruTipleri
    | GetSoruTipleriTamam
    | GetSoruTipleriHata
    | GetSoruZorluklari
    | GetSoruZorluklariTamam
    | GetSoruZorluklariHata;
