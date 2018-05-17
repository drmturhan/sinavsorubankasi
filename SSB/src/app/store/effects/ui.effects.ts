import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { Actions, Effect } from '@ngrx/effects';

import { TranslateService } from '@ngx-translate/core';

import * as fromUIActions from '../actions/ui.actions';
@Injectable()
export class UIEffects {

    constructor(
        private actions: Actions,
        private translate: TranslateService) {

    }
    @Effect()
    loginRead: Observable<fromUIActions.UIActionsTypes> = this.actions
        .ofType<fromUIActions.ChangeLanguage>(fromUIActions.UI_LANGUAGE_CHANGE)
        .pipe(
            map((action) => {
                localStorage.setItem('dil', JSON.stringify(action.payload));
                this.translate.setDefaultLang(action.payload.id);
                this.translate.use(action.payload.id);
                return new fromUIActions.LanguageChanged(action.payload);

            }, catchError(err => of(new fromUIActions.LanguageChangedFailed()))
            ));

}
