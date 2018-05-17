import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';


import * as fromRootStore from '../../../store/index';
import { GirisBilgi } from '../../../models/kullanici';
import { SbMesajService } from '../../../core/services/sb-mesaj.service';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'fuse-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: fuseAnimations
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginFormErrors: any;


  private authWindow: Window;

  girisKitli: boolean;
  yukleniyor: boolean;
  isRequesting: boolean;

  constructor(
    private fuseConfig: FuseConfigService,
    private formBuilder: FormBuilder,
    private store: Store<fromRootStore.State>,
    private mesajService: SbMesajService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.fuseConfig.setConfig({
      layout: {
        navigation: 'none',
        footer: 'none'
      }
    });

    this.loginFormErrors = {
      kullaniciAdi: {},
      sifre: {}
    };
    
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      kullaniciAdi: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      sifre: ['', Validators.required]
    });

    // if (environment.production === false) {
    //     this.loginForm.patchValue({ kullaniciAdi: 'mturhan', sifre: 'Akd34630.' });
    // }
    if (this.data.kullaniciAdi) {
      this.loginForm.patchValue({ kullaniciAdi: this.data.kullaniciAdi });
    }
    this.loginForm.valueChanges.subscribe(() => {
      this.onLoginFormValuesChanged();
    });
    this.store.select(fromRootStore.getAuthState).subscribe((authState: fromRootStore.AuthState) => {
      this.girisKitli = authState.hataliDenemeSayisi >= 5;
      this.yukleniyor = authState.loading;

      if (authState.kullaniciBilgi === null || !authState.kullaniciBilgi.id) {

        if (authState.hataliDenemeSayisi >= 5) {
          setTimeout(() => {
            this.mesajService.hataStr('Beş kere hatalı giriş yaptınız. Hesabınız kilitlendi. 10 dk. sonra tekrar deneyebilirsiniz.');
          });
          setTimeout(() => {
            this.mesajService.goster('Tekrar giriş yapmayı deneyebilirsiniz');
            this.store.dispatch(new fromRootStore.LoginResetCounter());
          }, 10 * 60 * 1000);
        }
      } 

    });
  }
  onLoginFormValuesChanged() {
    for (const field in this.loginFormErrors) {
      if (!this.loginFormErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.loginFormErrors[field] = {};

      // Get the control
      const control = this.loginForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.loginFormErrors[field] = control.errors;
      }
    }
  }
  girisiBaslat() {
    const girisBilgi: GirisBilgi = Object.assign({}, this.loginForm.value);
    this.store.dispatch(new fromRootStore.StartLogin(girisBilgi));
  }
  sifreKurtarmayiBaslat() {
    this.store.dispatch(new fromRootStore.LoginCancelled());
    this.store.dispatch(new fromRootStore.SifreKurtarRequired());
  }

  launchFbLogin() {
    this.fuseConfig.setConfig(this.fuseConfig.defaultConfig);
    // tslint:disable-next-line:max-line-length
    this.authWindow = window.open(`https://www.facebook.com/v2.11/dialog/oauth?&response_type=token&display=popup&client_id=390963621353858&display=popup&redirect_uri=${environment.fbRedirectUri}/anasayfa&scope=email', '_self', 'width=600,height=400`);

  }
  kapat(){
    this.store.dispatch(new fromRootStore.LoginCancelled());
  }
  uyelikBasvurusunuAc() {
    this.store.dispatch(new fromRootStore.LoginCancelled());
    this.router.navigate(['uyelik/basvurusu']);
  }
}
