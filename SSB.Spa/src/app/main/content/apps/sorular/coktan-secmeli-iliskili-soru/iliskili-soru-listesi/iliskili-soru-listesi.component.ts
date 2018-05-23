import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { SoruListe } from '../../models/soru';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IliskiliSoruService } from '../iliskili-soru.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'fuse-iliskili-soru-listesi',
  templateUrl: './iliskili-soru-listesi.component.html',
  styleUrls: ['./iliskili-soru-listesi.component.scss'],
  animations : fuseAnimations
})
export class IliskiliSoruListesiComponent implements OnInit, OnDestroy {

  sorular: SoruListe[];
  aktifSoru: SoruListe;
  onSorularDegisti: Subscription;
  onAktifSoruDegisti: Subscription;

  constructor(private route: ActivatedRoute,
    private service: IliskiliSoruService,
    private location: Location) { }

  ngOnInit() {
    this.onSorularDegisti =
      this.service.onSorularDegisti
        .subscribe(sorular => {
          this.sorular = sorular;
        });

    this.onAktifSoruDegisti =
      this.service.onAktifSoruDegisti
        .subscribe(gelenAktifSoru => {
          if (!gelenAktifSoru) {
            // Set the current mail id to null to deselect the current mail
            this.aktifSoru = null;

            // Handle the location changes
            const labelHandle = this.route.snapshot.params.labelHandle,
              filterHandle = this.route.snapshot.params.filterHandle,
              folderHandle = this.route.snapshot.params.folderHandle;

            if (labelHandle) {
              this.location.go('apps/mail/label/' + labelHandle);
            }
            else if (filterHandle) {
              this.location.go('apps/mail/filter/' + filterHandle);
            }
            else {
              this.location.go('apps/mail/' + folderHandle);
            }
          }
          else {
            this.aktifSoru = gelenAktifSoru;
          }
        });
  }
  ngOnDestroy() {
    this.onAktifSoruDegisti.unsubscribe();
    this.onSorularDegisti.unsubscribe();
  }
  soruyuOku(soruId)
  {
      const labelHandle  = this.route.snapshot.params.labelHandle,
            filterHandle = this.route.snapshot.params.filterHandle,
            folderHandle = this.route.snapshot.params.folderHandle;

      if ( labelHandle )
      {
          this.location.go('apps/mail/label/' + labelHandle + '/' + soruId);
      }
      else if ( filterHandle )
      {
          this.location.go('apps/mail/filter/' + filterHandle + '/' + soruId);
      }
      else
      {
          this.location.go('apps/mail/' + folderHandle + '/' + soruId);
      }

      
      this.service.aktiSoruyuOlarakIsaretle(soruId);
  }
}
