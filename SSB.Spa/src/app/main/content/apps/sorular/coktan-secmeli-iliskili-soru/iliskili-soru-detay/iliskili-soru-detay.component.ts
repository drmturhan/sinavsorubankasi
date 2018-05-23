import { Component, OnInit, OnDestroy } from '@angular/core';
import { SoruListe } from '../../models/soru';
import { Subscription } from 'rxjs';
import { IliskiliSoruService } from '../iliskili-soru.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'fuse-iliskili-soru-detay',
  templateUrl: './iliskili-soru-detay.component.html',
  styleUrls: ['./iliskili-soru-detay.component.scss'],
  animations : fuseAnimations
})
export class IliskiliSoruDetayComponent implements OnInit, OnDestroy {

  soru: SoruListe;

  ayrintiyiGoster = false;

  onAktifSoruDegisti: Subscription;
  constructor(
    private service: IliskiliSoruService
  ) { }

  ngOnInit() {
    this.onAktifSoruDegisti =
      this.service.onAktifSoruDegisti
        .subscribe(gelenSoru => {
          this.soru = gelenSoru;
        });
  }

  ngOnDestroy() {
    this.onAktifSoruDegisti.unsubscribe();
  }
  toggleStar(event) {
    event.stopPropagation();

    // this.soru.toggleStar();

    // this.service.updateMail(this.mail);
  }
}
