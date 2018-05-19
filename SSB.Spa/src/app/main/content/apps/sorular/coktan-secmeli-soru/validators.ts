import { AbstractControl, ValidationErrors, FormControl, ValidatorFn, FormArray } from '@angular/forms';
import { parse, ParsedNumber, isValidNumber } from 'libphonenumber-js';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operator/switchMap';
import 'rxjs/add/operator/map';
import { Injectable, Inject, Injector } from '@angular/core';


@Injectable()
export class CoktanSecmeliSoruValidatorleri {

    tekDogruluCoktanSecmeliSeceneklerValidator(control: AbstractControl): ValidationErrors | null {

        const array = <FormArray>control;
        if (!array) {
            return { tekDoguruluCoktanSecmeliSecenek: { value: true } };
        } else {
            const secenekSayisi = array.length;
            let dogruSecenekSayisi = 0;
            let eksikSatirSayisi = 0;

            if (array.length > 0) {
                array.controls.forEach(element => {
                    const secenekMetniValue = element.get('secenekMetni').value;
                    const dogruSecenekValue = element.get('dogruSecenek').value;
                    if (!secenekMetniValue || secenekMetniValue === '') {
                        eksikSatirSayisi++;
                    }
                    if (dogruSecenekValue === true) {
                        dogruSecenekSayisi++;
                    }
                });
            }
            if (secenekSayisi === 0) {
                return { hicSecenekGirilmemis: true };
            }
            if (eksikSatirSayisi > 0) {
                return { secenekMetniBos: true };
            }
            if (dogruSecenekSayisi === 0) {

                return { dogruSecenekGirilmemis: true };
            }
            if (dogruSecenekSayisi > 1) {
                return { tekDogruSecenekOlabilir: true };
            }

            return null;
        }
    }

    hemenElenebilirSecenekSayisi(control: AbstractControl): ValidationErrors | null {
        const tekDogruluSeceneklerArray = control.get('tekDogruluSecenekler') as FormArray;
        const hemenElenebiliSecenekSayisiControl = control.get('hemenElenebilirSecenekSayisi');
        if (tekDogruluSeceneklerArray == null || tekDogruluSeceneklerArray.length === 0 || hemenElenebiliSecenekSayisiControl == null) {

            return null;
        }

        if (tekDogruluSeceneklerArray.length < +hemenElenebiliSecenekSayisiControl.value) {
            return { hemenElenebilirSecenekSayisiYanlis: true };
        }
        return null;

    }

    public BitisBaslangictanOnceOlamaz(baslangicAdi: string = '', bitisAdi: string = ''): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            if (!baslangicAdi) {
                baslangicAdi = 'baslangic';
            }
            if (!bitisAdi) {
                bitisAdi = 'bitis';
            }
            const startControl = c.get(baslangicAdi);
            const endControl = c.get(bitisAdi);
            if (startControl != null && endControl != null) {
                if (startControl.pristine && endControl.pristine) {
                    return null;
                }
                if (startControl.value === '' || endControl.value === '') {
                    return null;
                }

                if (startControl.value < endControl.value) {
                    return null;
                }
            }
            return { 'bitisbaslangictanonceolamaz': true };
        }

    }


    regExValidator(patern: RegExp, validatosyonSonucStr: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const deger = patern.test(control.value);
            return deger ? null : { validatosyonSonucStr: { value: true } };
        };
    }

}
