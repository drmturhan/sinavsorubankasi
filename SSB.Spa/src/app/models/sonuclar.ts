export class Hata {
    kod?: string;
    tanim?: string;

}

export class Sonuc {
    basarili: boolean;
    hatalar?: Hata[];
    mesajlar?: string[];
}

export class KayitSonuc<T> extends Sonuc {
    donenNesne?: T;
    donenSekillenmisNesne?: any;
    static hataliSonucYarat(hataMesaji: string): KayitSonuc<any> {
        const donecek = new KayitSonuc<any>();
        donecek.basarili = false;
        if (hataMesaji && hataMesaji.length > 0) {
            donecek.hatalar = [{
                kod: '',
                tanim: hataMesaji
            }];
        }
        return donecek;
    }
}


export class ListeSonuc<T> extends Sonuc {
    donenListe: T[];
    donenSekillenmisListe: any[];
    kayitSayisi: number;
    sayfaSayisi: number;
    sayfaBuyuklugu: number;
    sayfa: number;
}
