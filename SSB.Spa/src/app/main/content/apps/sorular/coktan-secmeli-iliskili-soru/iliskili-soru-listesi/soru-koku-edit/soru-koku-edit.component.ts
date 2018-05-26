import { Component, OnInit, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SatPopover } from '@ncstate/sat-popover';

@Component({
  selector: 'fuse-soru-koku-edit',
  templateUrl: './soru-koku-edit.component.html',
  styleUrls: ['./soru-koku-edit.component.scss']
})
export class SoruKokuEditComponent implements OnInit {

  @Input() form: FormGroup;
  soruKokuMetni: string;
  constructor() {
  }

  ngOnInit() {
    this.update();
    this.form.valueChanges.subscribe(form => {
      this.update();
    });
  }

  update() {
    this.soruKokuMetni = this.form.get('soruKokuMetni').value;
  }
}
