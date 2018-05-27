import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router/src/router_state';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/forkJoin';
import { map, switchMap, catchError, tap, take, filter } from 'rxjs/operators';
import { SoruDepoVeriService } from '../helpers/soru-depo-veri.service';
import { Store } from '@ngrx/store';
import * as fromSoruStore from '../index';
import * as fromRootStore from '../../../../../../store/index';

@Injectable()
export class SorularResolveGuard implements CanActivate {
    routerState: any;

    constructor(
        private helperService: SoruDepoVeriService,
        private store: Store<fromSoruStore.SoruDepoAppState>
    ) { 
        this.store.select(fromRootStore.getRouterState).subscribe(routerState => {
            if (routerState) {
                this.routerState = routerState.state;
            }
        });
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        
        return this.checkStore().pipe(
            switchMap(() => of(true)),
            catchError((error) =>
                of(error === 1))
        );
    }

    checkStore(): Observable<any> {
        return Observable
            .forkJoin(
                this.helperService.getBirimler(),
                this.helperService.getSoruTipleri(),
                this.helperService.getSoruBilisselDuzeyleri(),
                this.helperService.getSoruZorluklari()
            )
            .pipe(
                filter(([birimlerLoaded, soruTipleriLoaded, soruZorluklariLoaded, bilisselDuzeylerLoaded]) =>
                    birimlerLoaded && soruTipleriLoaded && soruZorluklariLoaded && bilisselDuzeylerLoaded),
                take(1),
                switchMap(() =>
                    this.helperService.getSorular()
                ),
                take(1),
                map(() => {
                    this.store.dispatch(new fromSoruStore.SetAktifSoru(this.routerState.params.soruId));
                })
            );
    }
}
