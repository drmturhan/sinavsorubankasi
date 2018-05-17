import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fuse-yukleniyor',
  templateUrl: './yukleniyor.component.html',
  styleUrls: ['./yukleniyor.component.scss']
})
export class YukleniyorComponent implements OnInit {
  @Input() yukleniyor: boolean;
  constructor() { }

  ngOnInit() {
  }

}
