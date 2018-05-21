import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { FormControl, FormArray, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { OgrenimHedefItem } from '../../../models/birim-program-donem-ders';
import { CoktanSecmeliSoruSecenekService } from '../../../coktan-secmeli-soru-secenek.service';


@Component({
  selector: 'fuse-ogrenim-hedef-satir',
  templateUrl: './ogrenim-hedef-satir.component.html',
  styleUrls: ['./ogrenim-hedef-satir.component.scss']
})
export class OgrenimHedefSatirComponent implements OnInit {

  @Input() hedef: OgrenimHedefItem;
  @Input() indeks: number;
  @HostBinding('class.selected') selected: boolean;

  onSelectedChanged: Subscription;

  constructor(private tekDogruluSecenekService: CoktanSecmeliSoruSecenekService, private fb: FormBuilder) { }

  ngOnInit() {

    // Set the initial values
    this.selected = this.isSelected((this.tekDogruluSecenekService.soruForm.get('soruHedefleri') as FormArray));
    // Subscribe to update on selected todo change
    (this.tekDogruluSecenekService.soruForm.get('soruHedefleri') as FormArray).valueChanges.subscribe(gelenHedefler => {
      this.selected = this.isSelected((this.tekDogruluSecenekService.soruForm.get('soruHedefleri') as FormArray));
    });
  }
  isSelected(hedefArray: FormArray) {
    if (hedefArray && hedefArray.length > 0) {
      for (const ctrl of hedefArray.controls) {
        if (ctrl.value === this.hedef.ogrenimHedefId) {
          return true;
        }
      }
    }
    return false;
  }

  onSelectedChange() {
    if (!this.hedef) {
      return -1;
    }
    const indeks = this.tekDogruluSecenekService.ogrenimHedefIndeksiniBul(this.hedef.ogrenimHedefId);
    if (indeks >= 0) {
      (this.tekDogruluSecenekService.soruForm.get('soruHedefleri') as FormArray).removeAt(indeks);
    } else {
      (this.tekDogruluSecenekService.soruForm.get('soruHedefleri') as FormArray).push(this.fb.control(this.hedef.ogrenimHedefId));
    }
    this.tekDogruluSecenekService.soruForm.markAsDirty();
  }

}
