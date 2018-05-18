import { Component, ChangeDetectorRef, AfterViewInit, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation } from 'app/navigation/navigation';
import { Dil } from '../../models/dil';
import { KullaniciBilgi, GirisBilgi } from '../../models/kullanici';
import { MatDialog, DateAdapter } from '@angular/material';

import { Store } from '@ngrx/store';

import * as fromRootStore from '../../store/index';

import { environment } from 'environments/environment';
import { AuthState } from '../../store/index';

import { Platform } from '@angular/cdk/platform';
import { FormGroup } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { SbMesajService } from '../../core/services/sb-mesaj.service';
import { UIService } from '../../core/services/ui.service';
@Component({
    selector: 'fuse-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})

export class FuseToolbarComponent implements OnInit, AfterViewInit {
    userStatusOptions: any[];
    languages: Dil[];
    selectedLanguage: Dil | null;
    showLoadingBar: boolean;
    horizontalNav: boolean;
    noNav: boolean;
    navigation: any;


    loginDialogRef: any;
    aktivasyonPostasiDialogRef: any;
    sifreKurtarDialogRef: any;
    aktifKullanici: KullaniciBilgi;
    girisTamam: boolean;
    bosFotoUrl: any;


    constructor(
        private router: Router,
        private fuseConfig: FuseConfigService,
        private sidebarService: FuseSidebarService,
        private translate: TranslateService,

        private dialog: MatDialog,
        private mesajService: SbMesajService,

        private store: Store<fromRootStore.State>,
        private adapter: DateAdapter<any>,
        private uiService: UIService,
        private cd: ChangeDetectorRef,
        private platform: Platform,

    ) {
        // this.userStatusOptions = [
        //     {
        //         'title': 'Online',
        //         'icon' : 'icon-checkbox-marked-circle',
        //         'color': '#4CAF50'
        //     },
        //     {
        //         'title': 'Away',
        //         'icon' : 'icon-clock',
        //         'color': '#FFC107'
        //     },
        //     {
        //         'title': 'Do not Disturb',
        //         'icon' : 'icon-minus-circle',
        //         'color': '#F44336'
        //     },
        //     {
        //         'title': 'Invisible',
        //         'icon' : 'icon-checkbox-blank-circle-outline',
        //         'color': '#BDBDBD'
        //     },
        //     {
        //         'title': 'Offline',
        //         'icon' : 'icon-checkbox-blank-circle-outline',
        //         'color': '#616161'
        //     }
        // ];

        this.languages = this.uiService.sistemDilleriniAl();
        this.store.select(fromRootStore.getUIState).subscribe(uiState => {
            if (uiState) {

                this.showLoadingBar = uiState.calisanKomutSayisi > 0 || uiState.loading;

                if (uiState.dil != null && uiState.dil !== undefined) {
                    if ((this.selectedLanguage == null || this.selectedLanguage === undefined)) {
                        this.selectedLanguage = uiState.dil;
                    } else if (this.selectedLanguage.id !== uiState.dil.id) {
                        this.selectedLanguage = uiState.dil;
                    }
                }
            }
            this.bosFotoUrl = environment.bosFotoUrl;
        });

        this.selectedLanguage = this.languages[0];

        router.events.subscribe(
            (event) => {
                if (event instanceof NavigationStart) {
                    this.showLoadingBar = true;
                }
                if (event instanceof NavigationEnd) {
                    this.showLoadingBar = false;
                }
            });

        this.fuseConfig.onConfigChanged.subscribe((settings) => {
            this.horizontalNav = settings.layout.navigation === 'top';
            this.noNav = settings.layout.navigation === 'none';
        });

        this.navigation = navigation;
    }
    private girisEkraniAcik = false;
    ngOnInit(): void {

        this.store.select(fromRootStore.getAuthState).subscribe((authState: AuthState) => {

            if (authState.girisGerekli) {
                this.girisYap(authState.kullaniciAdi);
            }
            if (authState.loaded && (!authState.girisGerekli || authState.kullaniciBilgi != null)) {
                this.girisEkraniniKapat();
            }

            this.aktifKullanici = authState.kullaniciBilgi;
            this.girisTamam = this.aktifKullanici !== null;
            if (this.girisTamam) {

                this.fuseConfig.setConfig(this.fuseConfig.defaultConfig);
            }
            if (authState.sifreKurtarmaEkraniniAc === true) {
                this.sifreKurtarAc();
            }
            else {
                this.sifreKurtarAcKapat();
            }
        });
    }
    ngAfterViewInit() {

        this.cd.detectChanges();
    }

    toggleSidebarOpened(key) {
        this.sidebarService.getSidebar(key).toggleOpen();
    }

    search(value) {
        // Do your search here...
        console.log(value);
    }

    setLanguage(lang) {
        // Set the selected language for toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this.translate.use(lang.id);
    }
    dilDegistir(dil: Dil) {
        if (dil && dil !== undefined) {
            this.store.dispatch(new fromRootStore.ChangeLanguage(dil));
        }
    }
    girisEkraniniKapat() {

        this.dialog.closeAll();

    }

    girisEkraniniAc(kullaniciAdi: string) {

        this.store.dispatch(new fromRootStore.LoginRequired());

    }
    girisYap(kullaniciAdi: string) {


        let en = '500px';
        let boy = '95vh';
        let sinif = 'popup-masaustu';
        if (this.platform.ANDROID || this.platform.IOS) {
            en = '99vw';
            boy = '95vh';
            sinif = 'popup-mobil';
        }

        if (this.loginDialogRef) {
            this.dialog.closeAll();
        }
        this.loginDialogRef = this.dialog.open(LoginComponent,
            {
                data: { kullaniciAdi: kullaniciAdi },
                hasBackdrop: false,
                width: en,
                panelClass: sinif
            });
    }
    hesapAktivasyonPostasiGonderiAc() {

        this.router.navigate(['uyelik/aktivasyonbaslat']);
    }

    sifreKurtarAc() {
        this.router.navigate(['uyelik/sifrekurtar']);

    }
    sifreKurtarAcKapat() {
        setTimeout(() => {
            if (this.sifreKurtarDialogRef) {
                this.sifreKurtarDialogRef.close();
            }
        });
    }

    cikisYap() {
        if (localStorage.getItem('access_token')) {
            localStorage.removeItem('access_token');
        }
        if (localStorage.getItem('kullanici')) {
            localStorage.removeItem('kullanici');
        }
        this.store.dispatch(new fromRootStore.LogoutSuccess());
    }
    profileGit() {
        this.router.navigate(['uyelik/profilim']);

    }
    arkadaslarimaGit() {
        this.router.navigate(['uyelik/arkadaslarim']);
    }
}
