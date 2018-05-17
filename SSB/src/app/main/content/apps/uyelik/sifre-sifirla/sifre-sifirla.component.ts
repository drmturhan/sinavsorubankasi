
import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@angular/cdk/platform';

import { Observable } from 'rxjs/Observable';
import { fuseAnimations } from '@fuse/animations';
import { GenericValidator } from '@fuse/validators/generic-validator';
import { FuseConfigService } from '@fuse/services/config.service';
import { UyelikValidatorleri } from '../uyeol/uyelik-validators';
import { SbMesajService } from '../../../../../core/services/sb-mesaj.service';
import * as fromRootStore from '../../../../../store/index';
import { UyelikService } from '../uyelik.service';
import { UyelikBasvuruValidasyonMesajlariTr, UyelikBasvuruValidasyonMesajlariEn } from '../uyeol/uyelik-mesajlari';
import { SifreKurtarBilgi } from '../../../../../models/kullanici';
import { Sonuc } from '../../../../../models/sonuclar';
import { Subscription } from 'rxjs';
@Component({
  selector: 'fuse-sifre-sifirla',
  templateUrl: './sifre-sifirla.component.html',
  styleUrls: ['./sifre-sifirla.component.scss'],
  animations: fuseAnimations
})

export class SifreSifirlaComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: QueryList<any>;

  routerState: any;

  kayitIstegiBasladi = false;

  public validationMessages: any = {};
  public displayMessage: any = {};
  public genericValidator: GenericValidator;

  sifirlamaFormu: FormGroup;
  public errorMessage: string;
  private kurtarmaKodu: string;
  private yukleniyor = false;
  constructor(
    private fuseConfig: FuseConfigService,
    private formBuilder: FormBuilder,
    private uyelikValidatorlari: UyelikValidatorleri,
    private mesajService: SbMesajService,
    private store: Store<fromRootStore.State>,
    private router: Router,
    private translate: TranslateService,
    private uyelikService: UyelikService,
    private activatedRoute: ActivatedRoute,
    public platform: Platform

  ) {
    this.store.select(fromRootStore.getRouterState).subscribe(routerState => {
      if (routerState) {
        this.routerState = routerState.state;
      }
    });
    this.translate.onLangChange.subscribe((aktifDil) => {
      if (aktifDil['lang']) {
        if (aktifDil['lang'] === 'tr') {
          this.validationMessages = UyelikBasvuruValidasyonMesajlariTr();
        } else if (aktifDil['lang'] === 'en') {
          this.validationMessages = UyelikBasvuruValidasyonMesajlariEn();
        }
      }
      if (this.validationMessages) {
        this.genericValidator = new GenericValidator(this.validationMessages);
        this.displayMessage = this.genericValidator.processMessages(this.sifirlamaFormu);
      }
    });

    this.fuseConfig.setConfig({
      layout: {
        navigation: 'none',
        footer: 'none'
      }
    });
    this.sifirlamaFormu = this.sifirlamaFormunuYarat(this.formBuilder);
  }

  ngOnInit() {
    this.validationMessages = UyelikBasvuruValidasyonMesajlariTr();
    this.genericValidator = new GenericValidator(this.validationMessages);

    this.kurtarmaKodu = this.routerState.queryParams['code'];

  }
  ngAfterViewInit(): void {
    this.formOlaylariniBagla();
  }
  private formOlaylariniBagla() {
    const controlBlurs = this.formInputElements.map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(this.sifirlamaFormu.valueChanges, ...controlBlurs)
      .debounceTime(600)
      .subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.sifirlamaFormu);
      });
  }
  sifirlamaFormunuYarat(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({

      sifreGrup: formBuilder.group(
        {
          sifre: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(18), this.uyelikValidatorlari.isStrongPassword, Validators.maxLength(18)]],
          sifreKontrol: ['', [Validators.required]]
        },
        { validator: this.uyelikValidatorlari.sifreKontrol }
      ),
      ePosta: ['', [Validators.required, Validators.email]],
      // tslint:disable-next-line:max-line-length
    });
  }
  sifreKurtar() {

    if (this.sifirlamaFormu.valid === false) {
      this.displayMessage = this.genericValidator.processMessages(this.sifirlamaFormu, true);
      return;
    }

    const gonderilecekBilgi: SifreKurtarBilgi = Object.assign({}, this.sifirlamaFormu.value);
    gonderilecekBilgi.eposta = this.sifirlamaFormu.get('ePosta').value;
    gonderilecekBilgi.sifre = this.sifirlamaFormu.get('sifreGrup.sifre').value;
    gonderilecekBilgi.sifreKontrol = this.sifirlamaFormu.get('sifreGrup.sifreKontrol').value;
    gonderilecekBilgi.kod = this.kurtarmaKodu;
    this.kayitIstegiBasladi = true;
    this.uyelikService.sifreKurtar(gonderilecekBilgi).subscribe((sonuc: Sonuc) => {
      if (sonuc.basarili) {
        const girisAction = this.mesajService.goster('Şifreniz sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz.', 'Giriş yap', 7000);
        girisAction.onAction().subscribe(data => {
          this.store.dispatch(new fromRootStore.LoginRequired());
        });
        this.router.navigate(['/']);

      } else {
        const sifreKurtarAction = this.mesajService.hatalar(sonuc.hatalar, 'Şifre kurtar', 7000);
        sifreKurtarAction.onAction().subscribe(data => {
          this.router.navigate(['uyelik/sifrekurtar']);
        });

      }
    }, error => {
      this.sifirlamaFormu = this.sifirlamaFormunuYarat(this.formBuilder);
      this.formOlaylariniBagla();
      this.mesajService.hatalar(error.error);
    },
      () => {
        this.kayitIstegiBasladi = false;

      });
  }
  girisiBaslat() {
    this.router.navigate(['/']);
    this.store.dispatch(new fromRootStore.LoginRequired());
  }
}


