import { AbstractControl, ValidationErrors, FormControl, ValidatorFn } from '@angular/forms';
import { parse, ParsedNumber, isValidNumber } from 'libphonenumber-js';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operator/switchMap';
import 'rxjs/add/operator/map';
import { Injectable, Inject, Injector } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRootStore from '../../../../../store/index';
import { Dil } from '../../../../../models/dil';
import { UyelikService } from '../uyelik.service';



@Injectable()
export class UyelikValidatorleri {
    seciliDil: Dil;
    constructor(private uyelikService: UyelikService,
        private store: Store<fromRootStore.State>) {
        this.store.select(fromRootStore.getUIState).pipe().subscribe((uiState) => {
            if (uiState.dil != null && uiState.dil !== undefined) {
                this.seciliDil = uiState.dil;
            }
        });

    }
    boslukIceremez(control: AbstractControl): ValidationErrors | null {
        if ((control.value as string).indexOf(' ') >= 0) {
            return { boslukIceremez: true };
        }
        return null;
    }

    kullanimSartlariniKontrol(control: AbstractControl): ValidationErrors | null {
        const kabulEdiyor = control.value && control.value !== undefined && (control.value as boolean) === true;

        if (kabulEdiyor) {
            return null;
        }
        return { kullanimSartlariniKabulEtmiyor: true };
    }



    sadeceHarfRakamdanOlusabilir(control: AbstractControl): ValidationErrors | null {
        const harfSayiDisiBilgiIceriyor: boolean = /[^\x00-\x7F]+/.test(control.value);
        const valid = !harfSayiDisiBilgiIceriyor;
        if (valid) {
            return null;

        } else {
            return { harfRakamDisiNesneVar: true };
        }
    }

    sifreKontrol(control: AbstractControl): ValidationErrors | null {
        const sifre = control.get('sifre');
        const sifreKontrol = control.get('sifreKontrol');
        if (sifre.pristine && sifreKontrol.pristine) {
            return null;
        }
        if (!sifre.valid) {
            return null;
        }
        if (!sifreKontrol.valid || sifreKontrol.value === null) {
            return null;
        }
        if (sifre.value === sifreKontrol.value) {
            return null;
        }
        return { sifreKontrolBasarisiz: true };
    }

    isStrongPassword(control: AbstractControl): ValidationErrors | null {
        const hasNumber: boolean = /\d/.test(control.value);
        const hasUpper: boolean = /[A-Z]/.test(control.value);
        const hasLower: boolean = /[a-z]/.test(control.value);
        const nonalphanumeric: boolean = /(?=.*\W)/.test(control.value);
        const valid = hasNumber && hasUpper && hasLower && nonalphanumeric;


        if (!valid) {
            return { sifreGucluDegil: true };

        } else {
            return null;
        }
    }
    telefonSifirlaBaslayamaz(control: AbstractControl): ValidationErrors | null {
        if (!control.value) {
            return null;
        }
        const numara: string = (control.value).toString();
        if (numara.startsWith('0') && numara.length === 11) {
            return { sifirlaBasliyor: true };
        }
        return null;
    }

    phoneNumberValid(control: AbstractControl): ValidationErrors | null {
        if (!control.value) {
            return null;
        }
        const numara = (control.value).toString();

        let parsedNumara: ParsedNumber;
        let dilKodu = 'TR';

        if (!dilKodu) {
            dilKodu = 'TR';
        }
        switch (dilKodu) {
            case 'EN':
                parsedNumara = parse(numara, 'US');
                break;

            default:
                parsedNumara = parse(numara, 'TR');
                break;
        }
        if (!parsedNumara.phone) {
            return { telefonNumarasiYanlis: true };
        }
        if (numara !== parsedNumara.phone.toString()) {
            return { telefonNumarasiYanlis: true };
        }
        const sonuc = isValidNumber(parsedNumara);

        if (sonuc === false) {
            return { telefonNumarasiYanlis: true };

        } else {
            return null;

        }
    }


    isUserNameUnique(control: FormControl) {

        const q = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.uyelikService.kullaniciAdiKullanilmis(control.value).subscribe(sonuc => {
                    if (sonuc) {
                        resolve({ 'kullaniciAdiKullaniliyor': true });
                    } else {
                        resolve(null);
                    }
                }, () => { resolve({ 'kullaniciAdiKullaniliyor': false }); });
            }, 500);
        });
        return q;
    }
    isMailUnique(control: FormControl) {

        const q = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.uyelikService.epostaAdresKullanilmis(control.value).subscribe(sonuc => {
                    if (sonuc) {
                        resolve({ epostaKullaniliyor: true });
                    } else {
                        resolve(null);
                    }
                }, () => { resolve({ epostaKullaniliyor: false }); });
            }, 1000);
        });
        return q;
    }
    isPhoneUnique(control: FormControl) {

        const q = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.uyelikService.telefonNumarasiKullanilmis(control.value).subscribe(sonuc => {
                    if (sonuc) {
                        resolve({ 'telefonKullaniliyor': true });
                    } else {
                        resolve(null);
                    }
                }, () => { resolve({ 'telefonKullaniliyor': false }); });
            }, 1000);
        });
        return q;
    }

    regExValidator(patern: RegExp, validatosyonSonucStr: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const deger = patern.test(control.value);
            return deger ? null : { validatosyonSonucStr: { value: true } };
        };
    }

}
