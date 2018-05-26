import { OgrenimHedefItem } from './birim-program-donem-ders';

export class SoruKokuListe {

    soruKokuId: number;
    dersNo: number;
    desAdi?: string;
    konuNo: number;
    konuAdi?: String;
    soruKokuMetni: string;
    sorulari: SoruListe[];
}

export class SoruKokuYarat {
    soruKokuId: number;
    soruKokuMetni: string;
    sorulari: number[];
}
export class SoruKokuDuzenle extends SoruKokuYarat {
    soruKokuId: number;
}
export class SoruListe {
    soruId: number;
    birimNo: number;
    dersNo: number;
    dersAdi: string | null;
    konuNo?: number;
    konuAdi?: string;
    soruTipNo: number;
    soruTipAdi: string | null;
    soruZorlukNo: number;
    soruZorlukAdi: string | null;
    kaynakca: string;
    soruMetni: string;
    soruKokuMetni: String;
    soruKokuNo: number;
    soruKokuSorulariSayisi: number;
    tekDogruluSecenekleri: TekDogruluSoruSecenek[];
    secenekSayisi: number;
    baslangic: Date;
    bitis?: Date;
    aciklama?: string;
    hemenElenebilirSecenekSayisi?: number;
    kabulEdilebilirlikIndeksi?: number;
    bilisselDuzeyNo?: number;
    bilisselDuzeyAdi?: string;
    cevaplamaSuresi?: number;
    anahtarKelimeler?: string[];
    soruHedefleri?: OgrenimHedefItem[];
    aktif?: boolean;
    onaylandi?: boolean;
    favori?: boolean;
    silinemez?: boolean;

    constructor(soru) {
        this.soruId = soru.soruId;
        this.birimNo = soru.birimNo;
        this.dersNo = soru.dersNo;
        this.dersAdi = soru.dersAdi;
        this.konuNo = soru.konuNo;
        this.konuAdi = soru.konuAdi;
        this.soruTipNo = soru.soruTipNo;
        this.soruTipAdi = soru.soruTipAdi;
        this.soruZorlukNo = soru.soruZorlukNo;
        this.soruZorlukAdi = soru.soruZorlukAdi;
        this.kaynakca = soru.kaynakca;
        this.soruMetni = soru.soruMetni;
        this.soruKokuMetni = soru.soruKokuMetni;
        this.soruKokuNo = soru.soruKokuNo;
        this.soruKokuSorulariSayisi = soru.soruKokuSorulariSayisi;
        this.tekDogruluSecenekleri = soru.tekDogruluSecenekleri;
        this.secenekSayisi = soru.secenekSayisi;
        this.baslangic = soru.baslangic;
        this.bitis = soru.bitis;
        this.aciklama = soru.aciklama;
        this.hemenElenebilirSecenekSayisi = soru.hemenElenebilirSecenekSayisi;
        this.kabulEdilebilirlikIndeksi = soru.kabulEdilebilirlikIndeksi;
        this.bilisselDuzeyNo = soru.bilisselDuzeyNo;
        this.bilisselDuzeyAdi = soru.bilisselDuzeyAdi;
        this.cevaplamaSuresi = soru.cevaplamaSuresi;
        this.anahtarKelimeler = soru.anahtarKelimeler;
        this.soruHedefleri = soru.soruHedefleri;
        this.aktif = soru.aktif;
        this.onaylandi = soru.onaylandi;
        this.favori = soru.favori;
        this.silinemez = soru.silinemez;
        this.soruMetni = soru.soruMetni;
    }
}
export class SoruYarat {
    birimNo?: number;
    programNo?: number;
    donemNo?: number;
    dersGrubuNo?: number;
    dersNo: number;
    konuNo?: number;
    soruTipNo?: number;
    soruZorlukNo?: number;
    kaynakca: string;
    soruMetni?: string;
    soruKokuNo?: number;
    soruKokuMetni?: string;
    aktif?: boolean;
    onaylandi?: boolean;
    secenekSayisi?: number;
    baslangic?: Date;
    bitis?: Date;
    aciklama?: string;
    hemenElenebilirSecenekSayisi?: number;
    kabulEdilebilirlikIndeksi?: number;
    bilisselDuzeyNo?: number;
    cevaplamaSuresi?: number;
    anahtarKelimeler?: string[];
    soruHedefleri: number[];
    tekDogruluSecenekleri: TekDogruluSoruSecenek[];
}

export class SoruDegistir extends SoruYarat {
    soruId: number;
}


export class IliskiliSoruListe {
    soruKokuId: number;
    soruKokuMetni: string;
    sorulari: SoruListe[];
}

export class IliskiliSoruYarat {
    soruKokuMetni: string;
    sorulari: SoruYarat[];
}

export class IliskiliSoruDegistir {
    soruKokuId: number;
    soruKokuMetni: string;
    sorulari: SoruDegistir[];
}

export class OgrenimHedef {
    ogrenimHedefNo: number;
    ogrenimHedefAdi: string;
}

export class TekDogruluSoruSecenek {
    tekDogruluSoruSecenekId: number;
    secenekMetni: string;
    dogruSecenek: boolean;
    hemenElenebilir: boolean;
    constructor(secenek) {
        this.tekDogruluSoruSecenekId = secenek.tekDogruluSoruSecenekId;
        this.secenekMetni = secenek.secenekMetni;
        this.dogruSecenek = secenek.dogruSecenek;
        this.hemenElenebilir = secenek.hemenElenebilir;
    }
    toogleDogruSecenek() {
        this.dogruSecenek = !this.dogruSecenek;
    }
    tooglehemenElenebilir() {
        this.hemenElenebilir = !this.hemenElenebilir;
    }
}
