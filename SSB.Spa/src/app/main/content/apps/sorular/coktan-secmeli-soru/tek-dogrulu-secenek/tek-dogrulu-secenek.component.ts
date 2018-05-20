import { Component, OnInit, OnDestroy, ViewChild, Input, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatSidenav } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { CoktanSecmeliSoruSecenekService } from '../../coktan-secmeli-soru-secenek.service';

@Component({
  selector: 'fuse-tek-dogrulu-secenek',
  templateUrl: './tek-dogrulu-secenek.component.html',
  styleUrls: ['./tek-dogrulu-secenek.component.scss'],
  animations: fuseAnimations
})
export class TekDogruluSecenekComponent implements OnInit, OnDestroy {


  @ViewChild(MatSidenav) navigasyon: MatSidenav;
  @Input() soruForm: FormGroup;
  hasSelectedTodos: boolean;
  isIndeterminate: boolean;
  hemenElenebilirSecenekSayisi = 0;
  hemenElenebilirSecenekSayisiDegisti: Subscription;
  dogruSeceneksayisi = 0;
  dogruSeceneksayisiDegisti: Subscription;

  searchInput: FormControl;
  currentTodo: FormGroup;
  onSelectedTodosChanged: Subscription;
  onCurrentTodoChanged: Subscription;



  constructor(public tekDogruluSecenekService: CoktanSecmeliSoruSecenekService, private cd: ChangeDetectorRef) {
    this.searchInput = new FormControl('');

  }

  ngOnInit() {
    this.onSelectedTodosChanged =
      this.tekDogruluSecenekService.onSelectedTodosChanged
        .subscribe(selectedTodos => {

          setTimeout(() => {
            if (selectedTodos) {
              this.hasSelectedTodos = selectedTodos.length > 0;
              this.isIndeterminate = (selectedTodos.length !== this.tekDogruluSecenekService.selectedTodos.length && selectedTodos.length > 0);
            }
            else {
              this.hasSelectedTodos = false;
              this.isIndeterminate = false;
            }
          }, 0);

        });

    this.dogruSeceneksayisiDegisti = this.tekDogruluSecenekService
      .dogruSecenekSayisiDegisti.subscribe(
        gelensayi => this.dogruSeceneksayisi = gelensayi);

    this.hemenElenebilirSecenekSayisiDegisti = this.tekDogruluSecenekService
      .hemenElenebilirSecenekSayisiDegisti.subscribe(
        gelensayi => this.hemenElenebilirSecenekSayisi = gelensayi);



    this.searchInput.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(searchText => {
        this.tekDogruluSecenekService.onSearchTextChanged.next(searchText);
      });

    this.onCurrentTodoChanged =
      this.tekDogruluSecenekService.onCurrentTodoChanged
        .subscribe((currentTodo) => {
          if (!currentTodo) {
            this.currentTodo = null;
          }
          else {
            this.currentTodo = currentTodo;
          }
          
        });

  }
  deSelectCurrentTodo() {
    this.tekDogruluSecenekService.onCurrentTodoChanged.next(null);
  }
  seciliSecenekleriSil() {
    this.tekDogruluSecenekService.seciliSoruSecenekleriniSil();
  }
  ngOnDestroy() {
    this.onSelectedTodosChanged.unsubscribe();
    this.onCurrentTodoChanged.unsubscribe();
    this.cd.detach();
  }
  toggleSelectAll() {
    this.tekDogruluSecenekService.toggleSelectAll();
  }

  selectTodos(filterParameter?, filterValue?) {
    this.tekDogruluSecenekService.selectTodos(filterParameter, filterValue);
  }

  deselectTodos() {
    this.tekDogruluSecenekService.deselectTodos();
  }

  addTekDogruluSecenek(event) {
    event.stopPropagation();
    this.tekDogruluSecenekService.onNewTodoClicked.next('');
  }
  toggleSecenekSil(event) {
    event.stopPropagation();
    this.tekDogruluSecenekService.silTekDogruluSecenek(this.currentTodo);
  }

}
