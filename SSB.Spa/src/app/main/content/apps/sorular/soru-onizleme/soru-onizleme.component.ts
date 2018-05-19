import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'fuse-soru-onizleme',
  templateUrl: './soru-onizleme.component.html',
  styleUrls: ['./soru-onizleme.component.scss']
})
export class SoruOnizlemeComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit() {
  }

}
