
import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { OgrenimHedefItem } from '../models/birim-program-donem-ders';
import { CoktanSecmeliSoruSecenekService } from '../coktan-secmeli-soru-secenek.service';
import { MatCheckbox } from '@angular/material';

@Component({
  selector: 'fuse-ogrenim-hedefleri',
  templateUrl: './ogrenim-hedefleri.component.html',
  styleUrls: ['./ogrenim-hedefleri.component.scss']
})
export class OgrenimHedefleriComponent implements OnInit, OnDestroy {


  hasSelectedTodos: boolean;
  isIndeterminate: boolean;
  ogrenimHedefleri: OgrenimHedefItem[];
  onSelectedOgrenimHedefleriChanged: Subscription;
  onSecilebilirOgrenimHedefleriDegisti: Subscription;


  get soruHedefleri(): FormArray | null {
    return this.secenekService.soruForm.get('soruHedefleri') as FormArray;

  }
  constructor(
    private secenekService: CoktanSecmeliSoruSecenekService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder) {

  }

  ngOnInit() {
    this.onSecilebilirOgrenimHedefleriDegisti = this.secenekService
      .secilebilirOgrenimHedefleriDegisti.subscribe((hedefler: OgrenimHedefItem[]) => {
        this.ogrenimHedefleri = hedefler;
      });

    this.onSelectedOgrenimHedefleriChanged =
      this.soruHedefleri.valueChanges
        .subscribe(gelenSoruHedefleri => {

          setTimeout(() => {
            if (gelenSoruHedefleri) {
              this.hasSelectedTodos = gelenSoruHedefleri.length > 0;
              this.isIndeterminate = (gelenSoruHedefleri.length !== this.secenekService.secilebilirOgrenimHedefleri.length && gelenSoruHedefleri.length > 0);
            }
            else {
              this.hasSelectedTodos = false;
              this.isIndeterminate = false;
            }
          }, 0);

        });

  }


  ngOnDestroy() {

    this.onSelectedOgrenimHedefleriChanged.unsubscribe();
    this.cd.detach();
  }

  toggleselectAll(secim: MatCheckbox) {
    if (secim.checked) {
      this.deselectAll();
    }
    else { this.selectAll(); }
  }
  selectAll() {

    let degisensayi = 0;
    this.ogrenimHedefleri.forEach(hedef => {
      const zatenSecili = this.secenekService.ogrenimHedefIndeksiniBul(hedef.ogrenimHedefId) >= 0;
      if (!zatenSecili) {
        (this.secenekService.soruForm.get('soruHedefleri') as FormArray).push(this.fb.control(hedef.ogrenimHedefId));
        degisensayi++;
      }
    });
    if (degisensayi > 0) {
      this.secenekService.soruForm.markAsDirty();
    }
  }

  deselectAll() {
    while ((this.secenekService.soruForm.get('soruHedefleri') as FormArray).length !== 0) {
      (this.secenekService.soruForm.get('soruHedefleri') as FormArray).removeAt(0);
    }
  }


}
