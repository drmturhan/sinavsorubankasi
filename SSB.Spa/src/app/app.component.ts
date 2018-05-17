import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

import { locale as navigationEnglish } from './navigation/i18n/en';
import { locale as navigationTurkish } from './navigation/i18n/tr';

import * as fromRootStore from './store/index';
import { Dil } from './models/dil';
import { Store } from '@ngrx/store';
import { UIService } from './core/services/ui.service';
import { SbUnderscoreService } from './core/services/sb-underscore.service';

@Component({
    selector: 'fuse-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    seciliDil: Dil = null;

    constructor(
        private translate: TranslateService,
        private fuseNavigationService: FuseNavigationService,
        private fuseSplashScreen: FuseSplashScreenService,
        private fuseTranslationLoader: FuseTranslationLoaderService,

        private store: Store<fromRootStore.State>,
        private uiService: UIService,
        private usService: SbUnderscoreService
    ) {
        this.store.dispatch(new fromRootStore.LoginRead());
        this.dilAyarlariniUygula();
    }
    dilAyarlariniUygula() {
        const sistemDilleri = this.uiService.sistemDilleriniAl();
        if (sistemDilleri) {
            const dilTanimlari: string[] = [];
            sistemDilleri.forEach(function (k) {
                dilTanimlari.push(k.id);
            });
            // Add languages
            this.translate.addLangs(dilTanimlari);
        }
        let dil: Dil = null;

        if (this.seciliDil == null) {
            const tercihEdilenDil: Dil = JSON.parse(localStorage.getItem('dil'));
            if (tercihEdilenDil) {
                dil = tercihEdilenDil;
            }
        }
        if (this.seciliDil === null) {
            dil = <Dil>this.usService.findWhere(sistemDilleri, { id: 'tr' });
        }
        if (dil != null) {
            this.store.dispatch(new fromRootStore.ChangeLanguage(dil));
        }
        this.store.select(fromRootStore.getUIState).subscribe(uiState => {
            if (uiState.dil != null && uiState.dil !== undefined) {
                this.seciliDil = uiState.dil;
                // Set the default language
                this.translate.setDefaultLang(this.seciliDil.id);
                // Use a language
                this.translate.use(this.seciliDil.id);
            }
        });

        // Set the navigation translations
        this.fuseTranslationLoader.loadTranslations(navigationEnglish, navigationTurkish);
    }
}
