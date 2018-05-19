import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { CoktanSecmeliSoruSecenekService } from '../../../coktan-secmeli-soru-secenek.service';
import { SbMesajService } from '../../../../../../../core/services/sb-mesaj.service';


@Component({
  selector: 'fuse-tek-dogrulu-secenek-list',
  templateUrl: './tek-dogrulu-secenek-list.component.html',
  styleUrls: ['./tek-dogrulu-secenek-list.component.scss'],
  animations: fuseAnimations


})
export class TekDogruluSecenekListComponent implements OnInit {

  currentTodo: AbstractControl;
  onCurrentTodoChanged: Subscription;
  constructor(public tekDogruluSecenekService: CoktanSecmeliSoruSecenekService, private mesajService: SbMesajService) { }

  get secenekler(): FormArray {
    return (this.tekDogruluSecenekService.soruForm.get('secenekler') as FormArray);
  }

  ngOnInit() {

    // Subscribe to update current todo on changes
    this.onCurrentTodoChanged =
      this.tekDogruluSecenekService.onCurrentTodoChanged
        .subscribe(currentTodo => {
          if (!currentTodo) {
            this.currentTodo = null;
          }
          else {
            this.currentTodo = currentTodo;
          }
        });
    this.secenekler.valueChanges.subscribe(gelenler => {
      const dogruSecenekSayisi: any[] = gelenler.filter(s => s.dogruSecenek === true);
      if (dogruSecenekSayisi && dogruSecenekSayisi.length > 1) {
        this.mesajService.hataStr(`Bu soru için bir doğru seçenek belirlemeniz gerekli! Siz ${dogruSecenekSayisi.length} seçeneği doğrı olarak işaretlediniz.`);
      }

    });
  }


  readTodo(todoId) {
    // Set current todo
    this.tekDogruluSecenekService.setCurrentSecenek(todoId.value);

  }

  onDrop(ev) {

  }

}
