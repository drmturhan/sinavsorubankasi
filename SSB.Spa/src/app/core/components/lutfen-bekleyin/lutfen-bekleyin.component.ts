import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fuse-lutfen-bekleyin',
  templateUrl: './lutfen-bekleyin.component.html',
  styleUrls: ['./lutfen-bekleyin.component.scss']
})
export class LutfenBekleyinComponent implements OnInit {
  @Input() yukleniyor: boolean;
  @Input() mesaj: string;
  constructor() {
    if (!this.mesaj) {
      this.mesaj = 'Lütfen bekleyin...';
    }
  }

  ngOnInit() {
  }

}
