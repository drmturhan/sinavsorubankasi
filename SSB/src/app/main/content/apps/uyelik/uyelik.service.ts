import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import { environment } from 'environments/environment';
import { Sonuc, KayitSonuc, ListeSonuc } from '../../../../models/sonuclar';
import { SifreKurtarBilgi, KullaniciDetay, Cinsiyet, KullaniciBilgi, ProfilKaydet } from '../../../../models/kullanici';

import { UyelikBasvuru } from './models/uyelik-basvuru';
import * as fromRootStore from '../../../../store/index';
import { Store } from '@ngrx/store';

@Injectable()
export class UyelikService {

    baseUrl = environment.apiUrl;
    guvenlikUrl = 'account';
    profilUrl = 'profilim';
    hesapUrl = 'account';
    cinsiyetUrl = 'cinsiyetler';
    externalauth = 'externalauth';

    kullanicilarUrl = 'kullanicilar';
    arkadaslarUrl = 'arkadasliklarim';
    private kb: KullaniciBilgi;



    constructor(
        private httpClient: HttpClient,
        private store: Store<fromRootStore.State>
    ) {
        this.store.select(fromRootStore.getAuthState).subscribe(authState => {
            this.kb = authState.kullaniciBilgi;
        });
    }

    listeGetirCinsiyetler(): Observable<ListeSonuc<Cinsiyet>> {
        return this.httpClient.get<ListeSonuc<Cinsiyet>>(`${this.baseUrl}/${this.cinsiyetUrl}`);
    }

    epostaAktiveEt(kullaniciNo: number, kod: string) {
        return this.httpClient.get(`${this.baseUrl}/${this.guvenlikUrl}/kullaniciepostasinionayla?userId=${kullaniciNo}&code=${kod}`);
    }
    hesapOnayKoduPostala(eposta: string): Observable<Sonuc> {
        const adres = `${this.baseUrl}/${this.guvenlikUrl}/hesaponaykodupostala?eposta=${eposta}`;
        return this.httpClient.get<Sonuc>(adres);
    }
    sifreKurtarBaslat(epostaAdresi: string) {
        return this.httpClient.post(`${this.baseUrl}/account/sifrekurtarbaslat`, { eposta: epostaAdresi });
    }
    sifreKurtar(bilgi: SifreKurtarBilgi): Observable<Sonuc> {
        const adres = `${this.baseUrl}/${this.hesapUrl}/sifrekurtar`;
        return this.httpClient.post<Sonuc>(adres, bilgi,
            {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            });
    }
    profilBilgisiAl(): Observable<KayitSonuc<KullaniciDetay>> {
        return this.httpClient.get<KayitSonuc<KullaniciDetay>>(`${environment.apiUrl}/${this.profilUrl}/${this.kb.id}?neden=yaz`)
            .map(response => {
                return <KayitSonuc<KullaniciDetay>>response;
            });
    }

    profilKaydet(id: number, kullanici: ProfilKaydet): Observable<Sonuc> {
        return this.httpClient.put<Sonuc>(`${environment.apiUrl}/${this.kullanicilarUrl}/${id}`, kullanici);
    }

    personelBilgisiniAl(): number {

        let personelNo = 0;
        const kullanici = localStorage.getItem('kullanici');
        if (kullanici) {
            personelNo = JSON.parse(kullanici).personelNo;
        }
        return personelNo;
    }


    kullaniciGuvenlikKoduDogrumu(kod: string): Observable<boolean> {
        return this.httpClient.get<boolean>(`${this.baseUrl}/${this.guvenlikUrl}/guvenlikkodudogrumu?kod=${kod}`);

    }

    profilFotografiYap(fotoId: number) {
        return this.httpClient.post<Sonuc>(`${this.baseUrl}/${this.profilUrl}/profilFotografiYap`, fotoId);
    }
    fotografSil(fotoId: number) {
        return this.httpClient.delete<Sonuc>(`${this.baseUrl}/${this.profilUrl}/fotografsil/${fotoId}`);
    }

    // getArkadaslar(): Observable<ListeSonuc<ArkadaslikTeklif>> {
    //     const adres = `${this.baseUrl}/${this.arkadaslarUrl}/`;
    //     return this.httpClient.get<ListeSonuc<ArkadaslikTeklif>>(adres);
    // }
    // arkadasliklariGetir(sorgu?: ArkadaslikSorgusu): Observable<ListeSonuc<ArkadaslikTeklif>> {
    //     if (sorgu == null) {
    //         sorgu = new ArkadaslikSorgusu();
    //         sorgu.aramaCumlesi = '';
    //         sorgu.sayfa = 1;
    //         sorgu.sayfaBuyuklugu = 10;

    //     }
    //     let params: HttpParams = new HttpParams();
    //     if (sorgu.teklifEdenler != null) {
    //         params = params.append('teklifEdenler', sorgu.teklifEdenler.toString());
    //     }
    //     if (sorgu.teklifEdilenler != null) {
    //         params = params.append('teklifEdilenler', sorgu.teklifEdilenler.toString());
    //     }
    //     if (sorgu.cevaplananlar != null) {
    //         params = params.append('cevaplananlar', sorgu.cevaplananlar.toString());
    //     }
    //     if (sorgu.cevapBeklenenler != null) {
    //         params = params.append('cevapBeklenenler', sorgu.cevapBeklenenler.toString());
    //     }
    //     if (sorgu.kabulEdilenler != null) {
    //         params = params.append('kabulEdilenler', sorgu.kabulEdilenler.toString());
    //     }
    //     if (sorgu.silinenler != null) {
    //         params = params.append('silinenler', sorgu.silinenler.toString());
    //     }
    //     if (sorgu.sayfa != null) {
    //         params = params.append('sayfa', sorgu.sayfa.toString());
    //     }
    //     if (sorgu.aramaCumlesi != null) {
    //         params = params.append('aramaCumlesi', sorgu.aramaCumlesi.toString());
    //     }
    //     if (sorgu.sayfaBuyuklugu != null) {
    //         params = params.append('sayfaBuyuklugu', sorgu.sayfaBuyuklugu.toString());
    //     }
    //     if (sorgu.siralamaCumlesi != null) {
    //         params = params.append('siralamaCumlesi', sorgu.siralamaCumlesi.toString());
    //     }
    //     return this.httpClient.get<ListeSonuc<ArkadaslikTeklif>>(`${environment.apiUrl}/arkadasliklarim`, { params });
    // }
    epostaAdresKullanilmis(eposta: string): Observable<boolean> {
        return this.httpClient.get<boolean>(`${this.baseUrl}/${this.hesapUrl}/epostakullanimda?eposta=${eposta}`);
    }
    kullaniciAdiKullanilmis(kullaniciAdi: string): Observable<boolean> {
        return this.httpClient.get<boolean>(`${this.baseUrl}/${this.hesapUrl}/kullaniciadikullanimda?kullaniciAdi=${kullaniciAdi}`);
    }
    telefonNumarasiKullanilmis(telefonno: string): Observable<boolean> {
        return this.httpClient.get<boolean>(`${this.baseUrl}/${this.hesapUrl}/telefonnumarasikullanimda?telefonno=${telefonno}`);
    }
    register(uyeBilgisi: UyelikBasvuru): Observable<Sonuc> {
        return this.httpClient.post<Sonuc>(`${this.baseUrl}/${this.hesapUrl}/uyelikbaslat`, uyeBilgisi,
            {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            });
    }


}
