import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';


import { Store } from '@ngrx/store';
import * as fromRootStore from '../../../../../store/index';
import { Router } from '@angular/router';
import { Sonuc } from '../../../../../models/sonuclar';
import { UyelikService } from '../uyelik.service';
import { SbMesajService } from '../../../../../core/services/sb-mesaj.service';

@Component({
    selector: 'fuse-sifre-kurtarma',
    templateUrl: './sifre-kurtarma-baslat.component.html',
    styleUrls: ['./sifre-kurtarma-baslat.component.scss'],
    animations: fuseAnimations
})
export class SifreKurtarmaBaslatComponent implements OnInit {

    forgotPasswordForm: FormGroup;
    forgotPasswordFormErrors: any;
    kurtarmaBasladi = false;

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private uyelikService: UyelikService,
        private mesajService: SbMesajService,
        private router: Router,
        private store: Store<fromRootStore.State>
    ) {
        this.fuseConfig.setConfig({
            layout: {
                navigation: 'none',
                footer: 'none'
            }
        });

        this.forgotPasswordFormErrors = {
            email: {}
        };
    }

    ngOnInit() {
        this.forgotPasswordForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });

        this.forgotPasswordForm.valueChanges.subscribe(() => {
            this.onForgotPasswordFormValuesChanged();
        });
    }

    onForgotPasswordFormValuesChanged() {
        for (const field in this.forgotPasswordFormErrors) {
            if (!this.forgotPasswordFormErrors.hasOwnProperty(field)) {
                continue;
            }

            // Clear previous errors
            this.forgotPasswordFormErrors[field] = {};

            // Get the control
            const control = this.forgotPasswordForm.get(field);

            if (control && control.dirty && !control.valid) {
                this.forgotPasswordFormErrors[field] = control.errors;
            }
        }
        
    }
    sifreKurtarmayiBaslat() {
        const sifreKurtar: string = this.forgotPasswordForm.get('email').value;
        this.kurtarmaBasladi = true;
        this.uyelikService.sifreKurtarBaslat(sifreKurtar).subscribe((sonuc: Sonuc) => {
            if (sonuc.basarili) {
                this.mesajService.goster('Lütfen eposta kutunuzu kontrol edin...');
                this.store.dispatch(new fromRootStore.SifreKurtarSuccess());
            } else {
                this.mesajService.hataStr('Şifre kurtarma epostası gönderilemedi. Lütfen sistem yöneticisine başvurun.');
            }
        }, hata => { this.mesajService.hataStr('Beklenmedik bir hata oluştu. Lütfen sistem tekrar deneyin. Sorun devam ederse sistem yöneticisine başvurun.'); },
            () => {
            this.kurtarmaBasladi = false;
                this.anaSayfayaGit();
            }
        );

    }
    girisEkraniniAc() {
        this.router.navigate(['/']);
        this.store.dispatch(new fromRootStore.LoginRequired());
    }
    anaSayfayaGit() {
        this.router.navigate(['/']);
    }
}
