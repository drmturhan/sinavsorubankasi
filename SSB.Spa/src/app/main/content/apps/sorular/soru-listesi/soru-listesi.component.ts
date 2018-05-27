
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { SoruListe } from '../models/soru';
import { Observable } from 'rxjs/Observable';
import * as fromSorularStore from '../soru-store';
import { Store } from '@ngrx/store';
@Component({
  selector: 'fuse-soru-listesi',
  templateUrl: './soru-listesi.component.html',
  styleUrls: ['./soru-listesi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoruListesiComponent {
  @Input() sorular: SoruListe[];
  @Input() aktifSoru: SoruListe;
  @Output() sorudegisti = new EventEmitter();

  yukleniyor: boolean;
  constructor(private store: Store<fromSorularStore.SoruDepoAppState>) {
    this.store.select(fromSorularStore.getSorularLoading).subscribe(loading => {
      this.yukleniyor = loading;
    });
  }
  readSoru(soru: SoruListe) {
    this.sorudegisti.emit(soru.soruId);
  }
}
