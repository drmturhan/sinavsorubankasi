
import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { OgrenimHedefItem } from '../models/birim-program-donem-ders';
import { CoktanSecmeliSoruSecenekService } from '../coktan-secmeli-soru-secenek.service';

@Component({
  selector: 'fuse-ogrenim-hedefleri',
  templateUrl: './ogrenim-hedefleri.component.html',
  styleUrls: ['./ogrenim-hedefleri.component.scss']
})
export class OgrenimHedefleriComponent implements OnInit, OnDestroy {

  @Input() soruForm: FormGroup;
  hasSelectedTodos: boolean;
  isIndeterminate: boolean;
  ogrenimHedefleri: OgrenimHedefItem[];
  onSelectedOgrenimHedefleriChanged: Subscription;
  onSecilebilirOgrenimHedefleriDegisti: Subscription;


  get soruHedefleri(): FormArray | null {
    return this.secenekService.soruForm.get('soruHedefleri') as FormArray;

  }
  constructor(private secenekService: CoktanSecmeliSoruSecenekService, private cd: ChangeDetectorRef) {

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

  secilileriSil() {
    // this.tekDogruluSecenekService.seciliOgrenimHedefleriniSil();
  }
  ngOnDestroy() {
    
    this.onSelectedOgrenimHedefleriChanged.unsubscribe();
    this.cd.detach();
  }
  toggleSelectAll() {
    // this.tekDogruluSecenekService.toggleOgrenimHedefleriSelectAll();
  }

  select(filterParameter?, filterValue?) {
    // this.tekDogruluSecenekService.selectOgrenimHedefleri(filterParameter, filterValue);
  }

  deselect() {
    // this.tekDogruluSecenekService.deselectOgrenimHedefleri();
  }


}
