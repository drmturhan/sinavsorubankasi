import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';

import { Store } from '@ngrx/store';
import * as fromRootStore from '../../../../../../store/index';
import { Sonuc } from '../../../../../../models/sonuclar';
import { Router } from '@angular/router';
import { UyelikService } from '../../uyelik.service';
import { fuseAnimations } from '@fuse/animations';
import { SbMesajService } from '../../../../../../core/services/sb-mesaj.service';


@Component({
  selector: 'fuse-aktivasyon-epostasi',
  templateUrl: './aktivasyon-epostasi.component.html',
  styleUrls: ['./aktivasyon-epostasi.component.scss'],
  animations: fuseAnimations
})
export class AktivasyonEpostasiComponent implements OnInit, OnDestroy {

  ePostaForm: FormGroup;
  resetPasswordFormErrors: any;
  istekGonderildi = false;
  yukleniyor = false;
  
  constructor(
    private fuseConfig: FuseConfigService,
    private formBuilder: FormBuilder,
    private mesajService: SbMesajService,
    private uyelikService: UyelikService,
    private router: Router,
    private store: Store<fromRootStore.State>

  ) {
    // this.layout = this.fuseConfig.config;
    this.fuseConfig.setConfig({
      layout: {
        navigation: 'none',
        footer: 'none'
      }
    });

    this.resetPasswordFormErrors = {
      email: {}

    };
  }

  ngOnInit() {
    this.ePostaForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.ePostaForm.valueChanges.subscribe(() => {
      this.onResetPasswordFormValuesChanged();
    });
  }
  ngOnDestroy() {
    // this.fuseConfig.setConfig(this.layout);
  }
  onResetPasswordFormValuesChanged() {
    for (const field in this.resetPasswordFormErrors) {
      if (!this.resetPasswordFormErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.resetPasswordFormErrors[field] = {};

      // Get the control
      const control = this.ePostaForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.resetPasswordFormErrors[field] = control.errors;
      }
    }
  }

  girisEkraniniAc() {

    this.router.navigate(['/']);
    this.store.dispatch(new fromRootStore.LoginRequired());
  }
  anaSayfayaGit() {

    this.router.navigate(['/']);
  }
  yenidenAktivasyonKoduPostala() {

    this.yukleniyor = true;
    const eposta = this.ePostaForm.get('email').value;
    this.uyelikService.hesapOnayKoduPostala(eposta).subscribe((sonuc: Sonuc) => {
      this.istekGonderildi = sonuc.basarili;
      if (sonuc.basarili) {
        this.mesajService.goster('Eposta gönderildi!');
      } else {
        this.mesajService.hataStr('Eposta yanlış veya hesapta sorun var. Lütfen yetkililere başvurun!');
      }
    },
      () => this.mesajService.goster('İşlem gerçekleşirken bir hata oluştu. Lütfen kısa bir süre sonra tekrar deneyin!'),
      () => this.yukleniyor = false);

  }
}
