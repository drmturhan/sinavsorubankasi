import { Component, OnInit, ViewChild, OnDestroy, HostBinding } from '@angular/core';


import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { fuseAnimations } from '@fuse/animations';
import { CoktanSecmeliSoruSecenekService } from '../../../coktan-secmeli-soru-secenek.service';
@Component({
  selector: 'fuse-tek-dogrulu-secenek-detay',
  templateUrl: './tek-dogrulu-secenek-detay.component.html',
  styleUrls: ['./tek-dogrulu-secenek-detay.component.scss'],
  animations: fuseAnimations
})
export class TekDogruluSecenekDetayComponent implements OnInit, OnDestroy {

  secenekFormu: FormGroup;

  @HostBinding('class.selected') selected: boolean;
  @HostBinding('class.aktif') aktif: boolean;
  @HostBinding('class.dogru') dogruSecenek: boolean;
  @HostBinding('class.yanlis') yanlisSecenek: boolean;

  hemenElenebilirSecenek: boolean;
  onSelectedTodosChanged: Subscription;
  onAktifSecenekChanged: Subscription;


  onFormChange: any;
  onCurrentTodoChanged: Subscription;

  constructor(
    private tekDogruluSecenekService: CoktanSecmeliSoruSecenekService,
    private formBuilder: FormBuilder
  ) {

  }
  ngOnInit() {
    // Subscribe to update the current todo
    this.onCurrentTodoChanged =
      this.tekDogruluSecenekService.onCurrentTodoChanged
        .subscribe((todo) => {

          if (todo && this.secenekFormu) {
            this.dogruSecenek = this.secenekFormu.get('dogruSecenek').value;
            this.yanlisSecenek = !this.dogruSecenek;
            this.hemenElenebilirSecenek = this.secenekFormu.get('hemenElenebilir').value;
          }
          this.secenekFormu = todo;
        });

  }

  toggleDogruSecenek(event) {
    event.stopPropagation();
    const dogruSecenek = this.secenekFormu.get('dogruSecenek').value;
    this.secenekFormu.patchValue({ dogruSecenek: !dogruSecenek });
    this.tekDogruluSecenekService.onCurrentTodoChanged.next(this.secenekFormu);
  }

  toggleHemenElenebilir(event) {
    event.stopPropagation();
    const hemenElenebilirSecenek = this.secenekFormu.get('hemenElenebilir').value;
    this.secenekFormu.patchValue({ hemenElenebilir: !hemenElenebilirSecenek });
    this.tekDogruluSecenekService.onCurrentTodoChanged.next(this.secenekFormu);
  }

  toggleSecenekSil(event) {
    event.stopPropagation();
    this.tekDogruluSecenekService.silTekDogruluSecenek(this.secenekFormu);
  }

  addTekDogruluSecenek() {
    this.tekDogruluSecenekService.onNewTodoClicked.next('');
  }

  ngOnDestroy() {
    if (this.onFormChange) {
      this.onFormChange.unsubscribe();
    }
    this.onCurrentTodoChanged.unsubscribe();
  }

}
