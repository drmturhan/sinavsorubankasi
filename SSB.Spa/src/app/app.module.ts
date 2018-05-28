import { LOCALE_ID, NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { SatPopoverModule } from '@ncstate/sat-popover';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';

import { fuseConfig } from './fuse-config';

import { AppComponent } from './app.component';
import { FuseFakeDbService } from './fuse-fake-db/fuse-fake-db.service';
import { FuseMainModule } from './main/main.module';
import { AppStoreModule } from './store/store.module';
import { MaterialModule } from './material.module';
import { environment } from 'environments/environment';
import { JwtModule } from '@auth0/angular-jwt';
import { SbCoreModule } from './core/sb-core.module';

import localeTr from '@angular/common/locales/tr';
import localeTrExtra from '@angular/common/locales/extra/tr';

import { registerLocaleData } from '@angular/common';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

registerLocaleData(localeTr, 'tr');
registerLocaleData(localeTr, 'tr-TR', localeTrExtra);

export function GetAccessToken(): string {
    return localStorage.getItem('access_token');
}

export const authConfig = {
    tokenGetter: GetAccessToken,
    whitelistedDomains: environment.whitelistedDomains,
    skipWhenExpired: true
};



const appRoutes: Routes = [
    {
        path: '',
        loadChildren: './main/content/apps/apps.module#FuseAppsModule'
    }
];

@NgModule({
    declarations: [
        AppComponent

    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
        HttpClientModule,
        MaterialModule,
        RouterModule.forRoot(appRoutes),
        SbCoreModule,
        JwtModule.forRoot({
            config: authConfig
        }),
        SatPopoverModule,
        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FuseFakeDbService, {
            delay: 0,
            passThruUnknownUrl: true
        }),

        // Fuse Main and Shared modules
        FuseModule.forRoot(fuseConfig),
        FuseSharedModule,

        AppStoreModule,
        FuseMainModule

    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'tr' }
    ],

    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
