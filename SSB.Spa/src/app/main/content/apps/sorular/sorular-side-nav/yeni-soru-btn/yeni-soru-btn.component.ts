import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
} from '@angular/animations';
import { DialMenuModel } from '../../../../../../models/dial-menu-model';

@Component({
  selector: 'fuse-yeni-soru-btn',
  templateUrl: './yeni-soru-btn.component.html',
  styleUrls: ['./yeni-soru-btn.component.scss'],
  animations: [
    trigger('spinInOut', [
      state('in', style({ transform: 'rotate(0)', opacity: '1' })),
      transition(':enter', [
        style({ transform: 'rotate(-180deg)', opacity: '0' }),
        animate('150ms ease')
      ]),
      transition(':leave', [
        animate('150ms ease', style({ transform: 'rotate(180deg)', opacity: '0' }))
      ]),
    ]),
    trigger('preventInitialAnimation', [
      transition(':enter', [
        query(':enter', [], { optional: true })
      ]),
    ]),
  ]
})
export class YeniSoruBtnComponent implements OnInit {
  @Output() islem = new EventEmitter();
  @Input() gecerli = true;
  @Input() menuItems: DialMenuModel[];
  @Input() ipucu: string;
  constructor() { }

  ngOnInit() {
  }

}
