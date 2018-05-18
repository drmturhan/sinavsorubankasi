import { Directive, HostListener, EventEmitter, Output, Input } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';

@Directive({
  selector: '[fuseSubmitIfValid]'
})
export class SubmitIfValidDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('fuseSubmitIfValid') formRef: FormGroup;
  @Output() valid = new EventEmitter<void>();
  @Output() invalid = new EventEmitter<void>();

  constructor() { }

  @HostListener('click')
  handleClick() {

    this.markFieldAsDirty();
    this.emitIfValid();
  }

  private markFieldAsDirty() {
    Object.keys(this.formRef.controls)
      .forEach(fieldName => {
         this.formRef.controls[fieldName].markAsTouched();
        }
        );
  }
  private emitIfValid() {
    if (this.formRef.valid) {
      this.valid.emit();
    } else {

      this.invalid.emit();
    }
  }
}
