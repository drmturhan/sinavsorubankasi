import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router/src/router_state';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { switchMap, catchError } from 'rxjs/operators';
import 'rxjs/add/observable/forkJoin';
import { SoruDepoVeriService } from '../helpers/soru-depo-veri.service';


@Injectable()
export class SorularResolveGuard implements CanActivate {
    routerState: any;

    constructor(
        private helperService: SoruDepoVeriService,
    ) { 

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.helperService.checkStore().pipe(
            switchMap(() => of(true)),
            catchError((error) =>
                of(error === 1))
        );
    }


}
