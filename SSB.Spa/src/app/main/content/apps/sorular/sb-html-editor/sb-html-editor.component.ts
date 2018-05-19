import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'fuse-sb-html-editor',
  templateUrl: './sb-html-editor.component.html',
  styleUrls: ['./sb-html-editor.component.scss']
})
export class SbHtmlEditorComponent implements OnInit {

  @Input() secenekFormu: FormGroup;
  @ViewChild('editorum') ckeditor: any;
  ckeConfig: any;
  constructor() { }

  ngOnInit() {
    this.ckeConfig = {
      allowedContent: true
    
    };
  }

}
