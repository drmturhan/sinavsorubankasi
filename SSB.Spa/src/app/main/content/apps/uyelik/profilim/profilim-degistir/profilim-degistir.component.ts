
import { Component, OnInit, ViewChildren, ElementRef, QueryList, AfterViewInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, FormControlName, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Platform } from '@angular/cdk/platform';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/Observable/forkJoin';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { fuseAnimations } from '@fuse/animations';
import { GenericValidator } from '@fuse/validators/generic-validator';
import { Cinsiyet, KullaniciDetay } from '../../../../../../models/kullanici';

import * as fromRootStore from '../../../../../../store/index';
import { SbMesajService } from '../../../../../../core/services/sb-mesaj.service';
import { UyelikService } from '../../uyelik.service';
import { ProfilimValidasyonMesajlariTr, ProfilimValidasyonMesajlariEn } from '../profilim-validator-messages';
import { environment } from 'environments/environment';
import { ProfilimVeriSeti } from '../../models/profilim';
import { Sonuc } from '../../../../../../models/sonuclar';

@Component({
  selector: 'fuse-profilim-degistir',
  templateUrl: './profilim-degistir.component.html',
  styleUrls: ['./profilim-degistir.component.scss'],
  animations: fuseAnimations
})
export class ProfilimDegistirComponent implements OnInit, AfterViewInit {

  @Input() kullanici: KullaniciDetay;
  @Input() cinsiyetler: Cinsiyet[];
  @Input() kaydediliyor: boolean;

  @Output() kaydet = new EventEmitter();

  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: QueryList<any>;
  girisTamam: boolean;
  public validationMessages: any = {};
  public displayMessage: any = {};
  public genericValidator: GenericValidator;

  profilimFormu: FormGroup;
  public errorMessage: string;

  minDate = new Date(1900, 0, 1);
  maxDate = new Date();

  kayitIstegiBasladi = false;

  unvanlarFiltrelenmis$: Observable<string[]>;
  unvanlar: string[] = [
    'Prof.Dr.',
    'Doç.Dr.',
    'Dr.Öğr.Gör.'
  ];
  uygulamaAdi: string;
  constructor(

    private formBuilder: FormBuilder,
    private store: Store<fromRootStore.State>,
    private router: Router,
    private translate: TranslateService,
    private mesajService: SbMesajService,
    private uyelikService: UyelikService,
    private activatedRoute: ActivatedRoute,
    public platform: Platform
  ) {


    this.translate.onLangChange.subscribe((aktifDil) => {
      if (aktifDil['lang']) {
        if (aktifDil['lang'] === 'tr') {
          this.validationMessages = ProfilimValidasyonMesajlariTr();
        } else if (aktifDil['lang'] === 'en') {
          this.validationMessages = ProfilimValidasyonMesajlariEn();
        }
      }
      if (this.validationMessages) {
        this.genericValidator = new GenericValidator(this.validationMessages);
        this.displayMessage = this.genericValidator.processMessages(this.profilimFormu);
      }
    });


  }

  filtreleUnvanlar(name: string) {
    return this.unvanlar.filter(unvan =>
      unvan.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  ngOnInit() {

    this.validationMessages = ProfilimValidasyonMesajlariTr();
    this.genericValidator = new GenericValidator(this.validationMessages);

    this.profilimFormu = this.profilimFormunuYarat(this.formBuilder);

    const unvanControl = this.profilimFormu.get('unvan');
    this.unvanlarFiltrelenmis$ = unvanControl.valueChanges
      .startWith('')
      .map(unvan => unvan ? this.filtreleUnvanlar(unvan) : this.unvanlar.slice());

  }

  public ngAfterViewInit(): void {

    const controlBlurs = this.formInputElements.map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.profilimFormu.valueChanges, ...controlBlurs)
      .debounceTime(600)
      .subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.profilimFormu);
        if (this.displayMessage['sartlariKabulEdiyorum']) {
          this.mesajService.hataStr('Şartları kabul etmeden üye olamazsınız!');
        }
      });
  }
  kaydedilsin() {
    if (this.profilimFormu.valid === false) {
      this.displayMessage = this.genericValidator.processMessages(this.profilimFormu, true);
      return;
    }
    if (!this.profilimFormu.dirty) {
      this.mesajService.goster('Değişiklik olmadığı için kaydedilmedi.');
      return;
    }
    const kullaniciDetay = Object.assign({}, this.kullanici, this.profilimFormu.value);
    this.kaydet.emit(kullaniciDetay);

  }

  profilimFormunuYarat(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      unvan: [this.kullanici.unvan, [Validators.minLength(2), Validators.maxLength(10)]],
      ad: [this.kullanici.ad, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      digerAd: [this.kullanici.digerAd, [Validators.minLength(2), Validators.maxLength(50)]],
      soyad: [this.kullanici.soyad, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      cinsiyetNo: [this.kullanici.cinsiyetNo, [Validators.required]],
      dogumTarihi: [this.kullanici.dogumTarihi, Validators.required],
    });
  }
}
