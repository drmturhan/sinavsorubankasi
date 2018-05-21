
import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { SbMesajService } from '../../../../../core/services/sb-mesaj.service';

@Component({
  selector: 'fuse-anahtar-kelimeler',
  templateUrl: './anahtar-kelimeler.component.html',
  styleUrls: ['./anahtar-kelimeler.component.scss']
})
export class AnahtarKelimelerComponent {


  // tslint:disable-next-line:no-input-rename
  @Input('anahtar-kelimeler') anahtarKelimelerArr: FormArray;
  @Output() bosalt = new EventEmitter();

  @ViewChild('akInput')
  private elAnahtarKelime: ElementRef;
  yeniAnahtarKelime: FormControl;
  secimYapildi: boolean;

  constructor(
    private cdRef: ChangeDetectorRef,
    private mesajService: SbMesajService
  ) {
    this.yeniAnahtarKelime = new FormControl('', [Validators.required, Validators.minLength(3)]);
  }
  enterBasildi(event) {

    if (event && event.keyCode === 13) {
      event.stopPropagation();
      event.preventDefault();
      this.ekle();
    }
  }
  ekle() {

    if (this.yeniAnahtarKelime.valid) {
      if (this.anahtarKelimelerArr && this.anahtarKelimelerArr.length >= 5) {
        this.mesajService.hata({ kod: '', tanim: 'En fazla 5 anahtar kelime girebilirsiniz.' });
        return;
      }
      this.anahtarKelimelerArr.push(new FormControl(this.yeniAnahtarKelime.value));
      this.anahtarKelimelerArr.markAsDirty();
      this.cdRef.detectChanges();
      this.elAnahtarKelime.nativeElement.focus();
      this.elAnahtarKelime.nativeElement.value = '';
    }

  }
  sil(kontrol) {
    const indeks = this.anahtarKelimelerArr.controls.indexOf(kontrol);
    if (indeks >= 0) {
      this.anahtarKelimelerArr.removeAt(indeks);

    }
  }
  tumunuSil() {
    this.bosalt.emit();
  }

}
