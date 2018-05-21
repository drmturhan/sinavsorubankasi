
import {
  Component,
  OnInit,
  Inject,
  ViewEncapsulation,
  ViewChildren,
  ElementRef,
  QueryList,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild,
  HostBinding
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { MediaMatcher } from '@angular/cdk/layout';
import { FormattedMessageChain } from '@angular/compiler';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectionList, MatListOption, MatTabGroup, MatSlider } from '@angular/material';
import { FormBuilder, FormGroup, FormControlName, FormArray, FormControl, AbstractControl, Validators, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { Observable, fromEvent, merge } from 'rxjs';

import { take, switchMap } from 'rxjs/operators';


import { Store } from '@ngrx/store';
import * as fromSoruStore from '../soru-store/index';

import { GenericValidator } from '@fuse/validators/generic-validator';

import { FuseConfigService } from '@fuse/services/config.service';
import { SoruTipItem, SoruZorlukItem, SoruBilisselDuzeyItem, KonuItem, OgrenimHedefItem } from '../models/birim-program-donem-ders';
import { SbMesajService } from '../../../../../core/services/sb-mesaj.service';
import { CoktanSecmeliSoruSecenekService } from '../coktan-secmeli-soru-secenek.service';
import { CoktanSecmeliSoruValidatorleri } from './validators';
import { SorularService } from '../sorular.service';
import { CoktanSecmeliSoruValidasyonMesajlari_tr } from './validasyon.mesajlari';
import { TekDogruluSoruSecenek } from '../models/soru';
import { timeout } from 'q';


@Component({
  selector: 'fuse-coktan-secmeli-soru',
  templateUrl: './coktan-secmeli-soru.component.html',
  styleUrls: ['./coktan-secmeli-soru.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None
})
export class CoktanSecmeliSoruComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: QueryList<any>;

  @ViewChild('hedefler') hedeflerSecimListesi: MatSelectionList;
  @ViewChild('defter') defter: MatTabGroup;
  @ViewChild('sureSlider') sureKulagi: MatSlider;

  @HostBinding('class.tam-ekran') tamEkran: boolean;
  anahtarKelimeler: FormArray;
  get seceneklerFormArray(): FormArray {
    return <FormArray>this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler');
  }

  onTanimBaslangicTarihi = new Date(2018, 0, 1);


  kabulEdilebilirlikIndeksi: number;
  public validationMessages: any = {};
  public displayMessage: any = {};
  public genericValidator: GenericValidator;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  soruTipleri$: Observable<SoruTipItem[]>;
  soruZorluklari$: Observable<SoruZorlukItem[]>;
  bilisselDuzeyler$: Observable<SoruBilisselDuzeyItem[]>;
  konu: KonuItem = null;


  public errorMessage: string;

  constructor(
    public dialogRef: MatDialogRef<CoktanSecmeliSoruComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private fuseConfig: FuseConfigService,
    private store: Store<fromSoruStore.SoruDepoAppState>,
    private translate: TranslateService,
    private mesajService: SbMesajService,

    private soruValidatorleri: CoktanSecmeliSoruValidatorleri,
    private activatedRoute: ActivatedRoute,
    public platform: Platform,
    private cd: ChangeDetectorRef,
    public coktanSecmeliSoruSecenekService: CoktanSecmeliSoruSecenekService,
    private sorularService: SorularService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 800px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);


    this.konu = this.konuBul();
    this.soruTipleri$ = this.store.select(fromSoruStore.getSoruTipleri);
    this.soruZorluklari$ = this.store.select(fromSoruStore.getSoruZorluklari);
    this.bilisselDuzeyler$ = this.store.select(fromSoruStore.getBilisselDuzeyler);

    this.translate.onLangChange.subscribe((aktifDil) => {
      if (aktifDil['lang']) {
        if (aktifDil['lang'] === 'tr') {
          this.validationMessages = CoktanSecmeliSoruValidasyonMesajlari_tr();
        } else if (aktifDil['lang'] === 'en') {
          this.validationMessages = CoktanSecmeliSoruValidasyonMesajlari_tr();
        }
      }
      if (this.validationMessages) {
        this.genericValidator = new GenericValidator(this.validationMessages);
        this.displayMessage = this.genericValidator.processMessages(this.coktanSecmeliSoruSecenekService.soruForm);
      }
    });
  }

  ngOnInit() {
    this.validationMessages = CoktanSecmeliSoruValidasyonMesajlari_tr();
    this.genericValidator = new GenericValidator(this.validationMessages);
    if (this.data.degisecekSoru === undefined) {

      // if (environment.production === false) {
      this.data.degisecekSoru = this.denemeSoruYarat();
      // }
    }
    this.coktanSecmeliSoruSecenekService.soruForm = this.formYarat();
    this.secilebilirOgrenimHedefleriniAyarla();
    if (this.data.degisecekSoru !== undefined) {
      this.formYukle(this.data.degisecekSoru);
    }

  }
  public ngAfterViewInit(): void {


    const controlBlurs = this.formInputElements.map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    // Merge the blur event observable with the valueChanges observable
    merge(this.coktanSecmeliSoruSecenekService.soruForm.valueChanges, ...controlBlurs)
      .debounceTime(600)
      .subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.coktanSecmeliSoruSecenekService.soruForm);
      });

    if (this.coktanSecmeliSoruSecenekService.soruForm) {
      this.coktanSecmeliSoruSecenekService.soruForm.get('anahtarKelimeler').valueChanges.subscribe(
        (anahtarlar) => {
          this.anahtarKelimeler = anahtarlar;
        }
      );


    }


  }

  secilebilirOgrenimHedefleriniAyarla() {
    const sonuc: OgrenimHedefItem[] = [];
    const konuNumarasi = this.coktanSecmeliSoruSecenekService.soruForm.get('konuNo').value;
    if (this.data.ders && this.data.ders.konulari.length > 0) {
      let konu = null;
      if (konuNumarasi > 0) {
        // tslint:disable-next-line:triple-equals
        konu = this.data.ders.konulari.find(d => d.konuId == konuNumarasi);
      }
      if (konu === null) {
        this.data.ders.konulari.forEach(k => {
          k.ogrenimHedefleri.forEach(hedef => {
            sonuc.push(hedef);
          });
        });
      } else {
        konu.ogrenimHedefleri.forEach(hedef => {
          sonuc.push(hedef);
        });
      }
    }
    this.coktanSecmeliSoruSecenekService.secilebilirOgrenimHedefleriDegisti.next(sonuc);
  }


  formYarat() {
    return this.formBuilder.group({
      birimNo: this.data.ders ? this.data.ders.birimNo : null,
      programNo: this.data.ders ? this.data.ders.programNo : null,
      donemNo: this.data.ders ? this.data.ders.donemNo : null,
      dersGrubuNo: this.data.ders ? this.data.ders.dersGrubuNo : null,
      dersNo: this.data.dersNo,
      konuNo: this.data.konuNo,
      soruTipNo: [null, [Validators.required]],
      soruZorlukNo: [null, [Validators.required]],
      kaynakca: [''],
      soruMetni: ['', [Validators.required]],
      gecerlilik: this.formBuilder.group(
        {
          baslangic: [null, [Validators.required]],
          bitis: [null]
        }, { validator: this.soruValidatorleri.BitisBaslangictanOnceOlamaz('baslangic', 'bitis') }),
      aciklama: [''],
      secenekler: this.formBuilder.array([], this.soruValidatorleri.tekDogruluCoktanSecmeliSeceneklerValidator),
      hemenElenebilirSecenekSayisi: 0,
      kabulEdilebilirlikIndeksi: [0],
      bilisselDuzeyNo: [0, [Validators.required]],
      cevaplamaSuresi: [0],
      anahtarKelimeler: this.formBuilder.array([], Validators.required),
      soruHedefleri: this.formBuilder.array([]),
    });
  }

  formYukle(soruBilgi: any) {

    this.coktanSecmeliSoruSecenekService.soruForm.patchValue({
      birimNo: soruBilgi.birimNo,
      programNo: soruBilgi.programNo,
      donemNo: soruBilgi.donemNo,
      dersGrubuNo: soruBilgi.dersGrubuNo,
      dersNo: soruBilgi.dersNo,
      konuNo: soruBilgi.konuNo,
      soruTipNo: soruBilgi.soruTipNo,
      sorusozNo: soruBilgi.soruZorlukNo,
      kaynakca: soruBilgi.kaynakca,
      soruMetni: soruBilgi.soruMetni,
      soruZorlukNo: soruBilgi.soruZorlukNo,
      gecerlilik: {
        baslangic: soruBilgi.baslangic,
        bitis: soruBilgi.bitis
      },
      aciklama: soruBilgi.aciklama,
      kabulEdilebilirlikIndeksi: soruBilgi.kabulEdilebilirlikIndeksi,
      bilisselDuzeyNo: soruBilgi.bilisselDuzeyNo,
      cevaplamaSuresi: soruBilgi.cevaplamaSuresi,

    });


    if (soruBilgi.tekDogruluSecenekleri != null && soruBilgi.tekDogruluSecenekleri.length > 0) {
      const secenekler = (this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler') as FormArray);
      soruBilgi.tekDogruluSecenekleri.forEach((elSecenek: TekDogruluSoruSecenek) => {
        secenekler.push(this.formBuilder.group({
          tekDogruluSoruSecenekId: elSecenek.tekDogruluSoruSecenekId,
          secenekMetni: elSecenek.secenekMetni,
          dogruSecenek: elSecenek.dogruSecenek,
          hemenElenebilir: elSecenek.hemenElenebilir,
        }));
      });
      const sonuc = this.coktanSecmeliSoruSecenekService.hesaplariYap(secenekler);

      this.coktanSecmeliSoruSecenekService.dogruSecenekSayisiDegisti.next(sonuc.dogruSecenekSayisi);
      this.coktanSecmeliSoruSecenekService.hemenElenebilirSecenekSayisiDegisti.next(sonuc.hess);
      this.coktanSecmeliSoruSecenekService.kabulEdilebilirkikIndeksiDegisti.next(sonuc.kei);
    }
    if (soruBilgi.soruHedefleri && soruBilgi.soruHedefleri.length > 0) {
      const hedefler = (this.coktanSecmeliSoruSecenekService.soruForm.get('soruHedefleri') as FormArray);
      soruBilgi.soruHedefleri.forEach(elHedef => {
        hedefler.push(this.formBuilder.control(elHedef));
      });
      // this.tekDogruluSecenekService.onSelectedOgrenimHedefleriChanged.next(seciliHedefler);
    }
    if (soruBilgi.anahtarKelimeler && soruBilgi.anahtarKelimeler.length > 0) {
      soruBilgi.anahtarKelimeler.forEach(keyword => {
        (this.coktanSecmeliSoruSecenekService.soruForm.get('anahtarKelimeler') as FormArray).push(this.formBuilder.control(keyword));
      });
    }

    this.sureKulagi.value = soruBilgi.cevaplamaSuresi;
    this.displayMessage = this.genericValidator.processMessages(this.coktanSecmeliSoruSecenekService.soruForm);
  }
  anahtarkelimeleriBosalt() {
    while ((this.coktanSecmeliSoruSecenekService.soruForm.get('anahtarKelimeler') as FormArray).length !== 0) {
      (this.coktanSecmeliSoruSecenekService.soruForm.get('anahtarKelimeler') as FormArray).removeAt(0);
    }

  }


  konuBul(): KonuItem {
    let donecekKonu = null;
    if (this.data.konuNo <= 0 || this.data.ders == null || !this.data.ders.konulari.length) {
      return donecekKonu;
    } else {

      // tslint:disable-next-line:triple-equals
      donecekKonu = this.data.ders.konulari.find(k => k.konuId == this.data.konuNo);
      return donecekKonu;
    }
  }

  cevaplamaSuresiDegisti(deger) {
    console.log(deger);
    this.coktanSecmeliSoruSecenekService.soruForm.patchValue({ cevaplamaSuresi: deger.value });
  }
  hessSuresiDegisti(deger) {

    this.coktanSecmeliSoruSecenekService.soruForm.patchValue({ hemenElenebilirSecenekSayisi: deger });
    this.refresh();
  }


  denemeSoruYarat(): any {
    this.mesajService.goster('Lütfen yeni soru bilgilerini doldurup kaydedin.');
    return {
      birimNo: this.data.ders.birimNo,
      programNo: this.data.ders.programNo,
      donemNo: this.data.ders.donemNo,
      dersGrubuNo: this.data.ders.dersGrubuNo,
      dersNo: this.data.dersNo,
      konuNo: this.data.konuNo,
      // kaynakca: 'Otoskleroz tanımı',
      soruTipNo: 1,
      soruMetni: 'Aşağıdakilerden hangisi .... değildir? ',
      tekDogruluSecenekleri: [{
        'tekDogruluSoruSecenekId': -1,
        'secenekMetni': '',
        'dogruSecenek': false,
        'hemenElenebilir': false
      },

      {
        'tekDogruluSoruSecenekId': -2,
        'secenekMetni': '',
        'dogruSecenek': false,
        'hemenElenebilir': false
      },
      {
        'tekDogruluSoruSecenekId': -3,
        'secenekMetni': '',
        'dogruSecenek': false,
        'hemenElenebilir': false
      },
      {
        'tekDogruluSoruSecenekId': -4,
        'secenekMetni': '',
        'dogruSecenek': false,
        'hemenElenebilir': false
      },
      {
        'tekDogruluSoruSecenekId': -5,
        'secenekMetni': '',
        'dogruSecenek': false,
        'hemenElenebilir': false
      }],
      // anahtarKelimeler: ['kelime ', 'işitme kaybı', 'genetik', 'çınlama'],
      kaynakca: '',
      aciklama: '',
      bilisselDuzeyNo: 2,
      soruZorlukNo: 1,
      cevaplamaSuresi: 80,
      baslangic: '2018-01-01T00:00:00.000Z',
      bitis: '2020-03-24T00:00:00.000Z'
    };

  }

  bosHedef(): FormGroup {
    return this.formBuilder.group({
      ogrenimHedefId: null,
      ogrenimHedefAdi: ''
    });
  }

  secenekFormuYarat(): FormGroup {
    return this.formBuilder.group([
      {
        tekDogruluSoruSecenekId: [0],
        secenekMetni: [''],
        dogruSecenek: [false]
      }
    ]);

  }

  ekle() {
    (this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler') as FormArray).push(this.formBuilder.group(new TekDogruluSoruSecenek({})));
  }

  tumSecenekleriSil() {

    if (this.coktanSecmeliSoruSecenekService.soruForm) {
      while ((this.coktanSecmeliSoruSecenekService.soruForm.get('tekDogruluSecenekleri') as FormArray).length !== 0) {
        (this.coktanSecmeliSoruSecenekService.soruForm.get('tekDogruluSecenekleri') as FormArray).removeAt(0);
      }
    }
  }



  secenekSil(indeks) {
    const secenekListesi = this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler') as FormArray;
    secenekListesi.removeAt(indeks);
  }

  tamam() {
    const secenekler = <FormArray>this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler');
    const seceneklerDeger: TekDogruluSoruSecenek[] = secenekler.value;
    const hemDogruHemdeElenebilirSorular: TekDogruluSoruSecenek[] = seceneklerDeger.filter(el => el.dogruSecenek && el.hemenElenebilir);
    if (hemDogruHemdeElenebilirSorular.length > 0) {
      this.mesajService.hataStr('Aynı zamanda hem doğru seçenek hem de hemen elenebilir seçenek olarak işaretlenmiş seçenek var!');
      return;
    }

    this.dialogRef.close(['kaydet', this.coktanSecmeliSoruSecenekService.soruForm, this.data.degisecekSoru]);
  }

  formEksik() {

    if (this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler').errors) {

      if (this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler').errors.hicSecenekGirilmemis) {
        this.mesajService.hataStr('Hiç seçenek girilmemiş!');
        this.defter.selectedIndex = 0;
        return;
      }
      if (this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler').errors.dogruSecenekGirilmemis) {
        this.mesajService.hataStr('Doğru seçenek belirtilmemiş.');
        this.defter.selectedIndex = 0;
        return;
      }

      if (this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler').errors.tekDogruSecenekOlabilir) {
        this.mesajService.hataStr('Bu soru tipi için sadece tek seçenek doğru olarak işaretlenebilir!');
        this.defter.selectedIndex = 0;
        return;
      }
      if (this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler').errors.secenekMetniBos) {
        this.mesajService.hataStr('Seçeneklerin biri veya daha fazlasında SEÇENEK METNİ boş!');
        this.defter.selectedIndex = 0;
        return;
      }

    }
    if (this.coktanSecmeliSoruSecenekService.soruForm.get('anahtarKelimeler').errors) {

      this.mesajService.hataStr('Anahtar kelimeler eksik!');
      this.defter.selectedIndex = 3;
      return;
    }



    this.displayMessage = this.genericValidator.processMessages(this.coktanSecmeliSoruSecenekService.soruForm, true);
    this.defter.selectedIndex = 1;
    this.mesajService.hataStr('Lütfen eksik bıraktığınız kırmızı alanları doldurun!');
  }
  getTekDogruluSecenekSayisi(): number {

    const tekDoguruluSecenekler = this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler') as FormArray;
    if (!tekDoguruluSecenekler) { return 0; }
    return tekDoguruluSecenekler.length;
  }



  refresh() {
    this.cd.markForCheck();
  }
  ngOnDestroy() {
    this.cd.detach();
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
