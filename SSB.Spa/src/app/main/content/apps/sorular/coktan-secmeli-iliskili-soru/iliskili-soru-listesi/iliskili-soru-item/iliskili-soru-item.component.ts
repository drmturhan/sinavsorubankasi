import { Component, OnInit, Input, HostBinding, OnDestroy } from '@angular/core';
import { SoruListe } from '../../../models/soru';
import { Subscription } from 'rxjs';
import { IliskiliSoruService } from '../../iliskili-soru.service';

@Component({
  selector: 'fuse-iliskili-soru-item',
  templateUrl: './iliskili-soru-item.component.html',
  styleUrls: ['./iliskili-soru-item.component.scss']
})
export class IliskiliSoruItemComponent implements OnInit, OnDestroy {

  @Input() soru: SoruListe;

  @HostBinding('class.selected') selected: boolean;

  onSecilmisSorularDegisti: Subscription;

  constructor(
    private service: IliskiliSoruService

  ) { }

  ngOnInit() {
    this.soru = new SoruListe(this.soru);

    this.onSecilmisSorularDegisti =
      this.service.onSecilmisSorularDegisti
        .subscribe(secilmisSorular => {
          this.selected = false;

          if (secilmisSorular.length > 0) {
            for (const soruItem of secilmisSorular) {
              if (soruItem.id === this.soru.soruId) {
                this.selected = true;
                break;
              }
            }
          }
        });


  }
  ngOnDestroy() {
    this.onSecilmisSorularDegisti.unsubscribe();
  }
  onSelectedChange()
  {
      this.service.toggleSoruSec(this.soru.soruId);
  }

  toggleStar(event)
    {
        event.stopPropagation();

        // this.soru.toggleStar();

        // this.service.updateMail(this.soru);
    }
}
