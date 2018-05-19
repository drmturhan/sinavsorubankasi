import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { fuseAnimations } from '@fuse/animations';
import { OgrenimHedefItem } from '../../models/birim-program-donem-ders';
import { CoktanSecmeliSoruSecenekService } from '../../coktan-secmeli-soru-secenek.service';

@Component({
  selector: 'fuse-ogrenim-hedef-list',
  templateUrl: './ogrenim-hedef-list.component.html',
  styleUrls: ['./ogrenim-hedef-list.component.scss'],
  animations: fuseAnimations
})
export class OgrenimHedefListComponent implements OnInit {

  secilebilirOgrenimHedefleri: OgrenimHedefItem[];
  onSecilebilirOgrenimHedefleriDegisti: Subscription;
  constructor(public tekDogruluSecenekService: CoktanSecmeliSoruSecenekService) { }


  ngOnInit() {
    this.onSecilebilirOgrenimHedefleriDegisti = this.tekDogruluSecenekService
      .secilebilirOgrenimHedefleriDegisti.subscribe((hedefler) => {
        this.secilebilirOgrenimHedefleri = hedefler;
      }
      );
  }

}
