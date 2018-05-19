import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'fuse-sb-html-editor',
  templateUrl: './sb-html-editor.component.html',
  styleUrls: ['./sb-html-editor.component.scss']
})
export class SbHtmlEditorComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() parentFormGroupName: string;
  @Input() parentFormControlName: string;
  @Input() metinPlaceholder: string;
  @Input() gerekli = false;
  @Input() minSatir = 2;
  @Input() maksSatir = 10;


  @ViewChild('metinAlani') metinAlani;
  @ViewChild('editorum') ckeditor: any;


  constructor() { }

  ngOnInit() {

  }

}
