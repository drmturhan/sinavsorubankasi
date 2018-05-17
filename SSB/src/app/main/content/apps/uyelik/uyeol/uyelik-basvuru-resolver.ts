import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { UyelikBasvuruVeriSeti } from '../models/uyelik-basvuru';
import { UyelikService } from '../uyelik.service';


@Injectable()
export class UyelikBasvuruResolver implements Resolve<UyelikBasvuruVeriSeti> {

    constructor(
        private uyelikService: UyelikService,
        private router: Router
    ) { }
    private aktifKullaniciNo = 0;
    donecekVeriSeti: UyelikBasvuruVeriSeti = new UyelikBasvuruVeriSeti();
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UyelikBasvuruVeriSeti> {

        const veriKaynaklari = [
            this.uyelikService.listeGetirCinsiyetler()
        ];
        return forkJoin(veriKaynaklari).map(data => {
            this.donecekVeriSeti.cinsiyetler = data[0];
            if (this.donecekVeriSeti) {
                return this.donecekVeriSeti;
            }
            return null;
        });
    }
}




