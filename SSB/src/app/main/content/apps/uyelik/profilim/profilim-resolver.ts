import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { catchError } from 'rxjs/Operators';
import { of } from 'rxjs/observable/of';
import { UyelikService } from '../uyelik.service';
import { ProfilimVeriSeti } from '../models/profilim';
import { KayitSonuc, ListeSonuc } from '../../../../../models/sonuclar';
import { KullaniciDetay, Cinsiyet } from '../../../../../models/kullanici';



@Injectable()
export class ProfilimResolver implements Resolve<ProfilimVeriSeti> {

    constructor(
        private uyelikService: UyelikService,
        private router: Router
    ) {

    }
    private aktifKullaniciNo = 0;
    donecekVeriSeti: ProfilimVeriSeti = new ProfilimVeriSeti();
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProfilimVeriSeti> {

        const cinsiyetler = this.uyelikService.listeGetirCinsiyetler();
        const profilBilgisi = this.uyelikService.profilBilgisiAl();

        const veriler = forkJoin([cinsiyetler, profilBilgisi]).pipe(catchError(error => of(error)));
        return veriler.map(gelenSonuc => {
            if (gelenSonuc[0].basarili) {
                this.donecekVeriSeti.cinsiyetler = gelenSonuc[0];
            }
            if (gelenSonuc[1].basarili) {
                this.donecekVeriSeti.kullanici = gelenSonuc[1];
            }
            return this.donecekVeriSeti;
        });

    }
}




