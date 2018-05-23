
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Subject } from 'rxjs/Subject';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { noComponentFactoryError } from '@angular/core/src/linker/component_factory_resolver';
import { OgrenimHedefItem } from './models/birim-program-donem-ders';


@Injectable({
  providedIn: 'root'
})
export class CoktanSecmeliSoruSecenekService {
  
  soruForm: FormGroup;
  selectedTodos: AbstractControl[];
  currentTodo: AbstractControl;
  searchText = '';

  secilebilirOgrenimHedefleri: OgrenimHedefItem[];
  secilebilirOgrenimHedefleriDegisti: BehaviorSubject<OgrenimHedefItem[]> = new BehaviorSubject([]);

  formDegisti: BehaviorSubject<any> = new BehaviorSubject(null);
  dogruSecenekSayisiDegisti: BehaviorSubject<number> = new BehaviorSubject(0);

  hemenElenebilirSecenekSayisiDegisti: BehaviorSubject<number> = new BehaviorSubject(0);
  kabulEdilebilirkikIndeksiDegisti: BehaviorSubject<number> = new BehaviorSubject(0);

  ogrenimHedefleri: OgrenimHedefItem[];

  get seceneklerFormArray(): FormArray {

    return this.soruForm ? <FormArray>this.soruForm.get('secenekler') : null;
  }

  onSelectedTodosChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onCurrentTodoChanged: BehaviorSubject<any> = new BehaviorSubject(null);

  // onSelectedOgrenimHedefleriChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  onFiltersChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onTagsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSearchTextChanged: BehaviorSubject<any> = new BehaviorSubject('');
  onNewTodoClicked: Subject<any> = new Subject();

  private yeniSecenekNumarasi = 0;

  constructor(private formBuilder: FormBuilder) {

    this.selectedTodos = [];
    // this.selectedOgrenimHedefleri = [];
    this.onNewTodoClicked.subscribe(() => {
      this.yeniSenecekNumarasiniBelirle();
      this.yeniSecenegiFormaKoy();
    });
    this.secilebilirOgrenimHedefleriDegisti.subscribe((hedefler: OgrenimHedefItem[]) => {
      this.secilebilirOgrenimHedefleri = hedefler;

    });
  }

  yeniSecenegiFormaKoy() {
    if (this.soruForm) {
      const yeniForm = this.yeniSecenekFormuYarat();
      (<FormArray>this.soruForm.get('secenekler')).push(yeniForm);
      this.onCurrentTodoChanged.next(yeniForm);
    }
  }
  yeniSenecekNumarasiniBelirle() {
    if (this.seceneklerFormArray) {
      this.seceneklerFormArray.controls.forEach(ctrl => {
        const deger = ctrl.get('tekDogruluSoruSecenekId').value;
        let enKucukDeger = 0;
        if (deger < enKucukDeger) {
          enKucukDeger = deger;
        }
        if (this.yeniSecenekNumarasi > enKucukDeger) {
          this.yeniSecenekNumarasi = enKucukDeger;
        }
      });
    }
  }

  yeniSecenekFormuYarat() {
    this.yeniSecenekNumarasi = this.yeniSecenekNumarasi - 1;
    return this.formBuilder.group(
      {
        tekDogruluSoruSecenekId: this.yeniSecenekNumarasi,
        secenekMetni: [''],
        dogruSecenek: [false],
        hemenElenebilir: [false]
      }
    );
  }

  toogleDogruSecenek(id) {

    if (this.soruForm) {
      for (let index = 0; index < (this.soruForm.get('secenekler') as FormArray).controls.length; index++) {
        const element = (this.soruForm.get('secenekler') as FormArray).controls[index];
        if (element.get('tekDogruluSoruSecenekId').value === id) {
          const deger = element.get('dogruSecenek').value;
          element.patchValue({ dogruSecenek: !deger });
          this.onCurrentTodoChanged.next(element);
        }
      }
    }
  }
  seciliSoruSecenekleriniSil() {
    if (this.soruForm) {
      const silinecekNolar: number[] = [];
      this.selectedTodos.forEach(element => {
        const silinecekIndeks = this.secenekIndeksiBul(element.get('tekDogruluSoruSecenekId').value);
        if (silinecekIndeks >= 0) {
          silinecekNolar.push(silinecekIndeks);
        }
      });
      if (silinecekNolar.length > 0) {
        const seceneklerArray = this.soruForm.get('secenekler') as FormArray;
        silinecekNolar.forEach(no => {
          seceneklerArray.removeAt(no);
        });
      }
    }
  }
  silTekDogruluSecenek(secenek) {
    if (this.soruForm) {
      const indis = this.secenekIndeksiBul(secenek.get('tekDogruluSoruSecenekId').value);
      if (indis >= 0) {
        (this.soruForm.get('secenekler') as FormArray).removeAt(indis);
        this.onCurrentTodoChanged.next(null);
      }
    }
  }
  secenekIndeksiBul(id): number {
    for (let index = 0; index < (this.soruForm.get('secenekler') as FormArray).controls.length; index++) {
      const element = (this.soruForm.get('secenekler') as FormArray).controls[index];
      if (element.get('tekDogruluSoruSecenekId').value === id) {
        return index;
      }
    }
    return -1;
  }

  setCurrentSecenek(id) {
    this.currentTodo = (this.soruForm.get('secenekler') as FormArray).controls.find(todo => {
      return todo.get('tekDogruluSoruSecenekId').value === id;
    });

    this.onCurrentTodoChanged.next(this.currentTodo);

  }
  toggleSelectedtekDogruluSecenek(id) {
    // First, check if we already have that todo as selected...
    if (this.selectedTodos.length > 0) {
      for (const todo of this.selectedTodos) {
        // ...delete the selected todo
        if (todo.get('tekDogruluSoruSecenekId').value === id) {
          const index = this.selectedTodos.indexOf(todo);

          if (index !== -1) {
            this.selectedTodos.splice(index, 1);

            // Trigger the next event
            this.onSelectedTodosChanged.next(this.selectedTodos);

            // Return
            return;
          }
        }
      }
    }

    // If we don't have it, push as selected
    this.selectedTodos.push(
      (this.soruForm.get('secenekler') as FormArray).controls.find(todo => {
        return todo.get('tekDogruluSoruSecenekId').value === id;
      })
    );

    // Trigger the next event
    this.onSelectedTodosChanged.next(this.selectedTodos);
  }
  toggleSelectAll() {
    if (this.selectedTodos.length > 0) {
      this.deselectTodos();
    }
    else {
      this.selectTodos();
    }

  }
  selectTodos(filterParameter?, filterValue?) {
    this.selectedTodos = [];

    // If there is no filter, select all todos


    if (filterParameter === undefined || filterValue === undefined) {
      (this.soruForm.get('secenekler') as FormArray).controls.forEach(element => {
        this.selectedTodos.push(element);
      });

    }
    else {
      this.selectedTodos.push(...
        (this.soruForm.get('secenekler') as FormArray).controls.filter(todo => {
          return todo.get(filterParameter).value === filterValue;
        })
      );
    }

    // Trigger the next event
    this.onSelectedTodosChanged.next(this.selectedTodos);
  }
  deselectTodos() {
    this.selectedTodos = [];
    // Trigger the next event
    this.onSelectedTodosChanged.next(this.selectedTodos);
  }
  oncekiSonrakiSecenegeGit(adim: number) {
    const indeks = this.secenekIndeksiBul(this.currentTodo.get('tekDogruluSoruSecenekId').value);
    const seceneklerArray: FormArray = <FormArray>this.soruForm.get('secenekler');
    let sonrakiSecenek: AbstractControl;
    if (!this.secenekIndeksiBul) { return; }
    if (indeks === -1 || indeks + adim >= 5) {
      sonrakiSecenek = seceneklerArray.controls[0];
    } else {
      if (indeks + adim < 0) {
        sonrakiSecenek = seceneklerArray.controls[seceneklerArray.length - 1];
      } else {
        sonrakiSecenek = seceneklerArray.controls[indeks + adim];
      }
    }
    if (sonrakiSecenek) {
      this.currentTodo = sonrakiSecenek;
      this.onCurrentTodoChanged.next(sonrakiSecenek);
    }
  }


  ogrenimHedefIndeksiniBul(hedefId): number {
    if (hedefId < 1) {
      return -1;
    }
    else {
      const kontroller = (this.soruForm.get('soruHedefleri') as FormArray).controls;
      for (let index = 0; index < kontroller.length; index++) {
        const element = kontroller[index];
        if (element.value === hedefId) {
          return index;
        }
      }
      return -1;
    }
  }


  hesaplariYap(secenekler?: FormArray): { dogruSecenekSayisi: number, hess: number, kei: number } {

    if (!secenekler) { secenekler = <FormArray>this.soruForm.get('secenekler'); }

    const dogruSecenekSayisi = secenekler.controls.filter(el => el.get('dogruSecenek').value === true).length;
    const hessGuncelDegeri = secenekler.controls.filter(el => el.get('hemenElenebilir').value === true).length;
    const kei = this.kabulEdilebilirlikIndeksiniHesapla(secenekler.length, hessGuncelDegeri);
    this.soruForm.patchValue(
      {
        kabulEdilebilirlikIndeksi: kei,
        hemenElenebilirSecenekSayisi: hessGuncelDegeri
      });
    this.hemenElenebilirSecenekSayisiDegisti.next(hessGuncelDegeri);
    this.dogruSecenekSayisiDegisti.next(dogruSecenekSayisi);
    this.kabulEdilebilirkikIndeksiDegisti.next(kei);
    return { dogruSecenekSayisi: dogruSecenekSayisi, hess: hessGuncelDegeri, kei: kei };

  }
  kabulEdilebilirlikIndeksiniHesapla(seceneksayisi: number, hemenElenebilirSecenekSayisi: number): number {

    if (seceneksayisi <= 0) { return 0; }
    if (seceneksayisi - hemenElenebilirSecenekSayisi !== 0) {
      return (1 / (seceneksayisi - hemenElenebilirSecenekSayisi));
    } else {
      return 0;
    }

  }
}
