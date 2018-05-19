import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromReducers from './reducers/index';
import * as fromEffects from './effects/index';

@NgModule({
    imports: [
        StoreModule.forFeature('soru-depo-app', fromReducers.reducers),
        EffectsModule.forFeature(fromEffects.effects)
    ],
    providers: []
})
export class SoruStoreModule { }
