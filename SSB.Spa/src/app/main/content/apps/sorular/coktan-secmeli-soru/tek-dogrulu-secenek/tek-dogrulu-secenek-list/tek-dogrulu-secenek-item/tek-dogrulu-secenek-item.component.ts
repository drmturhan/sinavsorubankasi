import { Component, OnInit, ViewEncapsulation, Input, HostBinding, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormControl } from '@angular/forms';
import { CoktanSecmeliSoruSecenekService } from '../../../../coktan-secmeli-soru-secenek.service';

@Component({
    selector: 'fuse-tek-dogrulu-secenek-item',
    templateUrl: './tek-dogrulu-secenek-item.component.html',
    styleUrls: ['./tek-dogrulu-secenek-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    
})
export class TekDogruluSecenekItemComponent implements OnInit, OnDestroy {

    @Input() secenekCtrl: FormControl;
    @Input() indeks: number;
    @HostBinding('class.selected') selected: boolean;
    @HostBinding('class.aktif') aktif: boolean;
    @HostBinding('class.dogru') dogruSecenek: boolean;
    @HostBinding('class.yanlis') yanlisSecenek: boolean;
    hemenElenebilirSecenek: boolean;
    onSelectedTodosChanged: Subscription;
    onAktifSecenekChanged: Subscription;

    constructor(private tekDogruluSecenekService: CoktanSecmeliSoruSecenekService) {

    }

    ngOnInit() {

       
        // Subscribe to update on selected todo change
        this.onSelectedTodosChanged =
            this.tekDogruluSecenekService.onSelectedTodosChanged
                .subscribe(selectedTodos => {

                    this.selected = false;

                    if (selectedTodos && selectedTodos.length > 0) {
                        for (const todo of selectedTodos) {
                            if (todo.get('tekDogruluSoruSecenekId').value === this.secenekCtrl.get('tekDogruluSoruSecenekId').value) {
                                this.selected = true;

                                break;
                            }
                        }
                    }
                });

        this.onAktifSecenekChanged = this.tekDogruluSecenekService.onCurrentTodoChanged.subscribe((suanki) => {
            this.aktif = false;
            this.dogruSecenek = false;
            if (suanki) {
                this.aktif = (suanki.get('tekDogruluSoruSecenekId').value === this.secenekCtrl.get('tekDogruluSoruSecenekId').value);
                if (this.aktif) {
                    this.secenekCtrl = suanki;
                    this.dogruSecenek = this.secenekCtrl.get('dogruSecenek').value;
                    this.hemenElenebilirSecenek = this.secenekCtrl.get('hemenElenebilir').value;
                }
            }
            
        });
    }
    secenekSil(event) {
        event.stopPropagation();
        this.tekDogruluSecenekService.silTekDogruluSecenek(this.secenekCtrl);
    }
    toggleHemenElenebilir(event) {
        event.stopPropagation();
        const hemenElenebilirSecenek = this.secenekCtrl.get('hemenElenebilir').value;
        this.secenekCtrl.patchValue({ hemenElenebilir: !hemenElenebilirSecenek });
        this.tekDogruluSecenekService.onCurrentTodoChanged.next(this.secenekCtrl);
    }
    ngOnDestroy() {
        this.onSelectedTodosChanged.unsubscribe();
        this.onAktifSecenekChanged.unsubscribe();

    }
    onSelectedChange() {
        const id = this.secenekCtrl.get('tekDogruluSoruSecenekId').value;
        this.tekDogruluSecenekService.toggleSelectedtekDogruluSecenek(id);
    }

    toggleDogruSecenek(event) {
        event.stopPropagation();
        const id = this.secenekCtrl.get('tekDogruluSoruSecenekId').value;
        this.tekDogruluSecenekService.toogleDogruSecenek(id);


    }

}
