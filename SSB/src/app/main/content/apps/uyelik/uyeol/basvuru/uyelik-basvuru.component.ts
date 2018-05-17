import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cinsiyet } from '../../../../../../models/kullanici';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/debounceTime';
import { FuseConfigService } from '@fuse/services/config.service';
import { UyelikValidatorleri } from '../uyelik-validators';
import * as fromRootStore from '../../../../../../store/index';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


import { Platform } from '@angular/cdk/platform';
import { GenericValidator } from '@fuse/validators/generic-validator';
import { UyelikBasvuruValidasyonMesajlariTr, UyelikBasvuruValidasyonMesajlariEn } from '../uyelik-mesajlari';
import { environment } from 'environments/environment';
import { UyelikBasvuruVeriSeti } from '../../models/uyelik-basvuru';
import { UyelikBasvuru } from '../../models/uyelik-basvuru';
import { Sonuc } from '../../../../../../models/sonuclar';

import { SbMesajService } from '../../../../../../core/services/sb-mesaj.service';
import { UyelikService } from '../../uyelik.service';

@Component({
  selector: 'fuse-uyelik-basvuru',
  templateUrl: './uyelik-basvuru.component.html',
  styleUrls: ['./uyelik-basvuru.component.scss'],
  animations: fuseAnimations
})
export class UyelikBasvuruComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: QueryList<any>;
  girisTamam: boolean;
  public validationMessages: any = {};
  public displayMessage: any = {};
  public genericValidator: GenericValidator;

  yukleniyor = false;

  uyelikFormu: FormGroup;
  public errorMessage: string;

  minDate = new Date(1900, 0, 1);
  maxDate = new Date();
  cinsiyetListesi: Cinsiyet[];
  kayitIstegiBasladi = false;

  unvanlarFiltrelenmis$: Observable<string[]>;
  unvanlar: string[] = [
    'Prof.Dr.',
    'Doç.Dr.',
    'Dr.Öğr.Gör.',
    'Arş.Gör.Dr.'
  ];
  uygulamaAdi: string;
  constructor(
    private fuseConfig: FuseConfigService,
    private formBuilder: FormBuilder,
    private uyelikValidatorlari: UyelikValidatorleri,
    private store: Store<fromRootStore.State>,
    private router: Router,
    private translate: TranslateService,
    private mesajService: SbMesajService,
    private uyelikService: UyelikService,
    private activatedRoute: ActivatedRoute,    
    public platform: Platform
  ) {
    this.fuseConfig.setConfig({
      layout: {
        navigation: 'none',
        toolbar: 'none',
        footer: 'none'
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
        this.displayMessage = this.genericValidator.processMessages(this.uyelikFormu);
      }
    });


  }

  filtreleUnvanlar(name: string) {
    return this.unvanlar.filter(unvan =>
      unvan.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  ngOnInit() {

    this.validationMessages = UyelikBasvuruValidasyonMesajlariTr();
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.store.select(fromRootStore.getAuthState).subscribe((authState) => {
      
      if (authState.kullaniciBilgi === null && authState.loaded) {
        this.girisTamam = false;
      } else {
        this.girisTamam = true;
      }
    });
    if (this.girisTamam) {
      this.store.dispatch(new fromRootStore.LogoutStart());
    }
    this.uyelikFormu = this.uyelikFromunuYarat(this.formBuilder);

    const unvanControl = this.uyelikFormu.get('unvan');
    this.unvanlarFiltrelenmis$ = unvanControl.valueChanges
      .startWith('')
      .map(unvan => unvan ? this.filtreleUnvanlar(unvan) : this.unvanlar.slice());

    if (environment.production === false) {
      this.denemeKullaniciYarat();
    }
    this.activatedRoute.data.subscribe(data => {
      const sonuc: UyelikBasvuruVeriSeti = data['data'];
      if (sonuc.cinsiyetler.basarili) {
        this.cinsiyetListesi = sonuc.cinsiyetler.donenListe;
      }
    });
  }

  public ngAfterViewInit(): void {

    const controlBlurs = this.formInputElements.map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.uyelikFormu.valueChanges, ...controlBlurs)
      .debounceTime(600)
      .subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.uyelikFormu);
        if (this.displayMessage['sartlariKabulEdiyorum']) {
          this.mesajService.hataStr('Şartları kabul etmeden üye olamazsınız!');
        }
      });
  }
  uyeol() {

    if (this.uyelikFormu.valid === false) {
      this.displayMessage = this.genericValidator.processMessages(this.uyelikFormu, true);
      return;
    }
    const gonderilecekBilgi: UyelikBasvuru = Object.assign({}, this.uyelikFormu.value);
    gonderilecekBilgi.sifre = this.uyelikFormu.get('sifreGrup.sifre').value;
    this.kayitIstegiBasladi = true;
    this.yukleniyor = true;
    this.uyelikService.register(gonderilecekBilgi).subscribe((sonuc: Sonuc) => {
      if (sonuc.basarili) {
        this.mesajService.yansit(sonuc.mesajlar);
        this.router.navigate(['basvuruyapildi']);
      } else {
        this.mesajService.hatalar(sonuc.hatalar);
      }
      this.kayitIstegiBasladi = false;
    }, error => {
      this.mesajService.hatalar(error.error);
    },
      () => {
        this.kayitIstegiBasladi = false;
        this.yukleniyor = false;
      });
  }

  uyelikFromunuYarat(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      kullaniciAdi: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        this.uyelikValidatorlari.boslukIceremez,
        this.uyelikValidatorlari.sadeceHarfRakamdanOlusabilir
      ], this.uyelikValidatorlari.isUserNameUnique.bind(this)],
      sifreGrup: formBuilder.group(
        {
          sifre: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(18), this.uyelikValidatorlari.isStrongPassword, Validators.maxLength(18)]],
          sifreKontrol: ['', [Validators.required]]
        },
        { validator: this.uyelikValidatorlari.sifreKontrol }
      ),
      unvan: ['', [Validators.minLength(2), Validators.maxLength(15)]],
      ad: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      digerAd: ['', [Validators.minLength(2), Validators.maxLength(50)]],

      soyad: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      cinsiyetNo: [null, [Validators.required]],
      dogumTarihi: ['', Validators.required],
      ePosta: ['', [Validators.required, Validators.email], [this.uyelikValidatorlari.isMailUnique.bind(this)]],
      // tslint:disable-next-line:max-line-length
      telefonNumarasi: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15), this.uyelikValidatorlari.phoneNumberValid, this.uyelikValidatorlari.telefonSifirlaBaslayamaz], [this.uyelikValidatorlari.isPhoneUnique.bind(this)]],
      sartlariKabulEdiyorum: ['', [Validators.required, this.uyelikValidatorlari.kullanimSartlariniKontrol]]
    });
  }

  denemeKullaniciYarat() {

    this.uyelikFormu.patchValue({
      kullaniciAdi: 'ozge',
      sifreGrup: {
        sifre: 'Akd34630.',
        sifreKontrol: 'Akd34630.'
      },
      unvan: 'Prof.Dr.',
      ad: 'Özge',
      soyad: 'Turhan',
      digerAd: '',
      cinsiyetNo: 2,
      ePosta: 'drmuratturhan@gmail.com',
      telefonNumarasi: 5332737353,
      dogumTarihi: new Date('01.16.1974')
    });
  }
  girisiBaslat() {
    
    this.router.navigate(['/']);
    this.store.dispatch(new fromRootStore.LoginRequired());
  }

}
