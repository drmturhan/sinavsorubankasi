import { Cinsiyet, KullaniciDetay } from '../../../../../models/kullanici';
import { KayitSonuc, ListeSonuc } from '../../../../../models/sonuclar';

export class ProfilimVeriSeti {
    cinsiyetler: ListeSonuc<Cinsiyet>;
    kullanici: KayitSonuc<KullaniciDetay>;

}
