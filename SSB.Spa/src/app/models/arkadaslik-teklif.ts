

export class ArkadaslikTeklif {
    id: string;
    arkadas: Arkadas;
    teklifEden: Arkadas;
    teklifEdilen: Arkadas;
    istekTarihi?: Date;
    cevapTarihi?: Date;
    karar?: boolean;
    iptalTarihi?: Date;
    iptalEdenKullaniciNo?: number;
    iptalEdildi?: boolean;
}

export class Arkadas {
    id: number;
    tamAdi: string;
    profilFotoUrl: string;
    sonMesajZamani: Date;
    eposta: string;
    epostaOnaylandi: boolean;
    telefonNumarasi?: string;
    telefonOnaylandi?: boolean;
    yasi: number;
}

import { SorguBase } from './sorgu-base';

export class ArkadaslikSorgusu extends SorguBase {
    constructor() {
        super();
        this.sayfa = 1;
        this.sayfaBuyuklugu = 10;
        this.kullaniciNo = true;
        this.filtreCumlesi = 'hepsi';
    }
    filtreCumlesi?: string;
    teklifEdilenler?: boolean;
    teklifEdenler?: boolean;
    kabulEdilenler?: boolean;
    cevapBeklenenler?: boolean;
    cevaplananlar?: boolean;
    silinenler?: boolean;
    kullaniciNo?: boolean;
}
