
export class SoruBirimItem {
    birimId: number;
    birimAdi: string;
    programlari: SoruProgramItem[];
}

export class SoruProgramItem {
    programId: number;
    programAdi: string;
    donemleri: ProgramDonemItem[];
}

export class ProgramDonemItem {
    donemId: number;
    sinifi: number;
    donemNumarasi: number;
    donemAdi: string;
    dersGruplari?: DersGrupItem[];
}
export class DersGrupItem {
    dersGrupId: number;
    grupAdi: string;
    staj: boolean;
    dersKurulu: boolean;
    dersleri: DersItem[];
}

export class DersItem {
    dersId: number;
    dersAdi: string;
    birimNo?: number;
    birimAdi?: string;
    programNo?: number;
    programAdi: string;
    donemNo?: number;
    donemAdi?: string;
    dersGrubuNo?: number;
    dersGrubuAdi: string;
    stajDersi?: boolean;
    dersKuruluDersi?: boolean;
    konulari?: KonuItem[];
    ogrenimHedefleri?: OgrenimHedefItem[];
    anlatanHocalar?: HocaItem[];
}
export class KonuItem {
    konuId: number;
    ders: DersItem;
    konuAdi: string;
    ogrenimHedefleri?: OgrenimHedefItem[];
    hocalari?: HocaItem[];
}
export class SoruTipItem {
    soruTipId: number;
    soruTipAdi: string;
}


export class SoruZorlukItem {
    zorlukId: number;
    zorlukAdi: string;
}

export class SoruBilisselDuzeyItem {
    bilisselDuzeyId: number;
    duzeyAdi: string;
}

export class OgrenimHedefItem {
    ogrenimHedefId: number;
    ogrenimHedefAdi: String;

}
export class HocaItem {
    dersHocaId: number;
    personelNo: number;
    unvanAdSoyad: string;

}

export class AlanKoduItem {
    dersAlanKodId: number;
    dersAlanKodu: string;
}


