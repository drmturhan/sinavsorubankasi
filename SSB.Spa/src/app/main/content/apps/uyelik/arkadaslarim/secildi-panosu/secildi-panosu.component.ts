import { Component, OnInit } from '@angular/core';
import { UyelikService } from '../../uyelik.service';


@Component({
  selector: 'fuse-secildi-panosu',
  templateUrl: './secildi-panosu.component.html',
  styleUrls: ['./secildi-panosu.component.scss']
})
export class SecildiPanosuComponent implements OnInit {

  selectedContacts: string[];
  hasSelectedContacts: boolean;
  isIndeterminate: boolean;
  constructor(private temelService: UyelikService) {
    this.temelService.onArkadaslikSecimiDegisti.subscribe(secilenler => {

      this.selectedContacts = secilenler;
      setTimeout(() => {
        this.hasSelectedContacts = secilenler.length > 0;
        this.isIndeterminate = (secilenler.length !== this.temelService.arkadaslarim.kayitSayisi > 0 && secilenler.length > 0);
      }, 0);
    });

  }

  ngOnInit() {
  }
  tumunuSec() {
    this.temelService.teklifleriSec();
  }

  secimiAt() {
    this.temelService.deselectTeklifler();
  }

  secilmisTeklifleriSil() {

  }
}
