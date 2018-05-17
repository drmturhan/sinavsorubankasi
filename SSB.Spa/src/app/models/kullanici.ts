import { SorguBase } from './sorgu-base';


export class KullaniciBilgi {
    id?: number;
    tamAdi?: string;
    kullaniciAdi?: string;
    CinsiyetNo?: number;
    yasi?: number;
    eposta?: string;
    epostaOnaylandi?: boolean;
    telefonNumarasi?: string;
    telefonNumarasiOnaylandi?: boolean;
    profilFotoUrl?: string;
    yonetici?: boolean;
    sonrakiKontrolTarihi?: Date;
}
export class KisiFoto {
    id?: number;
    kisiNo: number;
    url?: string;
    aciklama?: string;
    eklenmeTarihi?: Date;
    profilFotografi?: boolean;
}
export class KullaniciDetay {
    id?: number;
    kullaniciAdi?: string;
    unvan?: string;
    ad?: string;
    digerAd?: string;
    soyad?: string;
    cinsiyetNo?: string;
    dogumTarihi: Date;
    eposta?: string;
    epostaOnaylandi?: boolean;
    telefonNumarasi?: string;
    telefonOnaylandi?: boolean;
    aktif?: boolean;
    profilFotoUrl?: string;
    yaratilmaTarihi?: Date;
    sonAktifOlma?: Date;
    tamAdi?: string;
    fotograflari?: KisiFoto[];
}

export class KullaniciYaz {
    id?: number;
    kullaniciAdi?: string;
    unvan?: string;
    ad?: string;
    digerAd?: string;
    soyad?: string;
    cinsiyetNo?: string;
    dogumTarihi: Date;
    eposta?: string;
    epostaOnaylandi?: boolean;
    telefonNumarasi?: string;
    telefonOnaylandi?: boolean;
    aktif?: boolean;
    profilFotoUrl?: string;
    yaratilmaTarihi?: Date;
    sonAktifOlma?: Date;
    tamAdi?: string;
    fotograflari?: KisiFoto[];
}

export class ProfilKaydet{
    id?: number;
    
    unvan?: string;
    ad?: string;
    digerAd?: string;
    soyad?: string;
    cinsiyetNo?: string;
    dogumTarihi: Date;
}

export class Cinsiyet {
    cinsiyetId: number;
    cinsiyetAdi: string;
}

export interface GirisBilgi {
    kullaniciAdi: string;
    sifre: string;
    returnUrl: string;
}

export class SifreKurtarBilgi {
    eposta: string;
    sifre: string;
    sifreKontrol: string;
    kod?: string;
}

export class KullaniciSorgusu extends SorguBase {
  
    constructor() {
        super();
        this.sayfa = 1;
        this.sayfaBuyuklugu = 10;

    }
}
export interface GuvenlikBilgi {
    tokenString?: string;
    kullanici?: KullaniciBilgi;
}
