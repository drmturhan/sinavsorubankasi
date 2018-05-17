import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from 'environments/environment';

import { Sonuc, KayitSonuc } from '../../models/sonuclar';
import { GuvenlikBilgi, GirisBilgi, SifreKurtarBilgi, KullaniciDetay } from '../../models/kullanici';



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
}
