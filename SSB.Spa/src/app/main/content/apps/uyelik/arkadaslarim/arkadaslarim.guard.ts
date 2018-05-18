import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { RouterStateSnapshot } from '@angular/router/src/router_state';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { switchMap, catchError } from 'rxjs/operators';
import 'rxjs/add/observable/forkJoin';
import * as _ from 'underscore';

import { getRouterState, State } from '../../../../../store';
import { UyelikService } from '../uyelik.service';


@Injectable()
export class ArkadaslarimGuard implements CanActivate {
    routerState: any;

    constructor(
        private store: Store<State>,
        private helperService: UyelikService
    ) {
        this.store.select(getRouterState).subscribe(routerState => {
            if (routerState) {
                this.routerState = routerState.state;
            }
        });
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.helperService.checkArkadaslarStore().pipe(
            switchMap(() => of(true)),
            catchError((error) =>
                of(error === 1))
        );
    }


}
