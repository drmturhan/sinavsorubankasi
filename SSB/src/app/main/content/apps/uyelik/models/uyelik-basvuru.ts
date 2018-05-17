import { ListeSonuc } from '../../../../../models/sonuclar';
import { Cinsiyet, KullaniciDetay } from '../../../../../models/kullanici';

export class UyelikBasvuruVeriSeti {
    cinsiyetler: ListeSonuc<Cinsiyet>;
}





export class UyelikBasvuru {

    constructor() {
        this.sifre = '';
    }
    kullaniciAdi?: string;
    sifre?: string;
    unvan?: string;
    ad?: string;
    digerAd?: string;
    soyad?: string;
    cinsiyetNo?: string;
    dogumTarihi: Date;
    eposta?: string;
    telefonNumarasi?: string;
}
