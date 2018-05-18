import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from 'environments/environment';

import { Sonuc, KayitSonuc, ListeSonuc } from '../../models/sonuclar';
import { GuvenlikBilgi, GirisBilgi, SifreKurtarBilgi, KullaniciDetay } from '../../models/kullanici';
import { ArkadaslikTeklif, ArkadaslikSorgusu } from '../../models/arkadaslik-teklif';



@Injectable({
    providedIn: 'root'
})
export class AuthService {

    baseUrl = environment.apiUrl;
    guvenlikUrl = 'account';
    profilUrl = 'profilim';
    hesapUrl = 'account';
    cinsiyetUrl = 'cinsiyetler';
    externalauth = 'externalauth';

    kullanicilarUrl = 'kullanicilar';
    arkadaslarUrl = 'arkadasliklarim';

    constructor(
        private httpClient: HttpClient,
        private jwtHelperService: JwtHelperService
    ) { }



    login(model: GirisBilgi): Observable<KayitSonuc<GuvenlikBilgi>> {
        const adres = `${this.baseUrl}/${this.guvenlikUrl}/girisyap`;
        // this.rootStore.dispatch(new fromRootStore.StartLoading());
        return this.httpClient.post<KayitSonuc<GuvenlikBilgi>>(adres, model,
            { headers: new HttpHeaders().set('Content-Type', 'application/json') });
    }
    facebookLogin(token: string): Observable<KayitSonuc<GuvenlikBilgi>> {
        const adres = `${this.baseUrl}/${this.externalauth}/facebook`;
        return this.httpClient.post<KayitSonuc<GuvenlikBilgi>>(adres, { accessToken: token },
            { headers: new HttpHeaders().set('Content-Type', 'application/json') });
    }
    logout(): Observable<Sonuc> {
        const adres = `${this.baseUrl}/${this.guvenlikUrl}/cikisyap`;
        return this.httpClient.post<Sonuc>(adres, {});
    }
    sifreKurtar(bilgi: SifreKurtarBilgi): Observable<Sonuc> {
        const adres = `${this.baseUrl}/${this.hesapUrl}/sifrekurtar`;
        return this.httpClient.post<Sonuc>(adres, bilgi,
            {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            });
    }

    profilBilgisiAl(kullaniciNo: number) {
        return this.httpClient.get<KayitSonuc<KullaniciDetay>>(`${environment.apiUrl}/${this.profilUrl}/${kullaniciNo}?neden=yaz`)
            .map(response => {
                return <KayitSonuc<KullaniciDetay>>response;
            });
    }
    profilFotografiYap(fotoId: number) {
        return this.httpClient.post<Sonuc>(`${this.baseUrl}/${this.profilUrl}/profilFotografiYap`, fotoId);
    }
    fotografSil(fotoId: number) {
        return this.httpClient.delete<Sonuc>(`${this.baseUrl}/${this.profilUrl}/fotografsil/${fotoId}`);
    }
    getArkadaslar(): Observable<ListeSonuc<ArkadaslikTeklif>> {
        const adres = `${this.baseUrl}/${this.arkadaslarUrl}/`;
        return this.httpClient.get<ListeSonuc<ArkadaslikTeklif>>(adres);
    }
    arkadasliklariGetir(sorgu?: ArkadaslikSorgusu): Observable<ListeSonuc<ArkadaslikTeklif>> {
        if (sorgu == null) {
            sorgu = new ArkadaslikSorgusu();
            sorgu.aramaCumlesi = '';
            sorgu.sayfa = 1;
            sorgu.sayfaBuyuklugu = 10;

        }
        let params: HttpParams = new HttpParams();
        if (sorgu.teklifEdenler != null) {
            params = params.append('teklifEdenler', sorgu.teklifEdenler.toString());
        }
        if (sorgu.teklifEdilenler != null) {
            params = params.append('teklifEdilenler', sorgu.teklifEdilenler.toString());
        }
        if (sorgu.cevaplananlar != null) {
            params = params.append('cevaplananlar', sorgu.cevaplananlar.toString());
        }
        if (sorgu.cevapBeklenenler != null) {
            params = params.append('cevapBeklenenler', sorgu.cevapBeklenenler.toString());
        }
        if (sorgu.kabulEdilenler != null) {
            params = params.append('kabulEdilenler', sorgu.kabulEdilenler.toString());
        }
        if (sorgu.silinenler != null) {
            params = params.append('silinenler', sorgu.silinenler.toString());
        }
        if (sorgu.sayfa != null) {
            params = params.append('sayfa', sorgu.sayfa.toString());
        }
        if (sorgu.aramaCumlesi != null) {
            params = params.append('aramaCumlesi', sorgu.aramaCumlesi.toString());
        }
        if (sorgu.sayfaBuyuklugu != null) {
            params = params.append('sayfaBuyuklugu', sorgu.sayfaBuyuklugu.toString());
        }
        if (sorgu.siralamaCumlesi != null) {
            params = params.append('siralamaCumlesi', sorgu.siralamaCumlesi.toString());
        }
        return this.httpClient.get<ListeSonuc<ArkadaslikTeklif>>(`${environment.apiUrl}/arkadasliklarim`, { params });
    }
}
