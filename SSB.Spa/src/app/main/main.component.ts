import { Component, ElementRef, HostBinding, Inject, OnDestroy, Renderer2, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { Subscription } from 'rxjs';

import { FuseConfigService } from '@fuse/services/config.service';

import { navigation } from 'app/navigation/navigation';
import { Store } from '@ngrx/store';
import * as fromRootStore from '../store/index';
import { timeout } from 'q';
@Component({
    selector: 'fuse-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FuseMainComponent implements OnDestroy, AfterViewInit {
    onConfigChanged: Subscription;
    fuseSettings: any;
    navigation: any;

    private kullaniciTakip$: Subscription;
    kullaniciVar: boolean;


    @HostBinding('attr.fuse-layout-mode') layoutMode;

    constructor(
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private fuseConfig: FuseConfigService,
        private platform: Platform,
        private rootStore: Store<fromRootStore.UIState>,
        @Inject(DOCUMENT) private document: any
    ) {
        this.onConfigChanged =
            this.fuseConfig.onConfigChanged
                .subscribe(
                    (newSettings) => {
                        this.fuseSettings = newSettings;
                        this.layoutMode = this.fuseSettings.layout.mode;
                    }
                );

        if (this.platform.ANDROID || this.platform.IOS) {
            this.document.body.className += ' is-mobile';
        }

        this.navigation = navigation;
    }
    ngAfterViewInit() {
        this.kullaniciTakip$ = this.rootStore.select(fromRootStore.getAuthState).subscribe((authBilgi: fromRootStore.AuthState) => {
            setTimeout(() => {
                this.kullaniciVar = authBilgi.kullaniciBilgi != null;    
            });

        });
    }

    ngOnDestroy() {
        this.onConfigChanged.unsubscribe();
        this.kullaniciTakip$.unsubscribe();
    }

    addClass(className: string) {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }

    removeClass(className: string) {
        this._renderer.removeClass(this._elementRef.nativeElement, className);
    }
}
