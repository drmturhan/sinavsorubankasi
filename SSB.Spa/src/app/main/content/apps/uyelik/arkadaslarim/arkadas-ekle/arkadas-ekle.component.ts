import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { KullaniciSorgusu } from '../../../../../../models/kullanici';
import { UyelikService } from '../../uyelik.service';
import { SbMesajService } from '../../../../../../core/services/sb-mesaj.service';
 
@Component({
  selector: 'fuse-arkadas-ekle',
  templateUrl: './arkadas-ekle.component.html',
  styleUrls: ['./arkadas-ekle.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArkadasEkleComponent implements OnInit {
  dialogTitle: string;
  searchInput: FormControl;
  yukleniyor = false;
  guncelSorgu: KullaniciSorgusu;

  constructor(
    public dialogRef: MatDialogRef<ArkadasEkleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private uyelikService: UyelikService,
    private mesajService: SbMesajService) {
    this.guncelSorgu = new KullaniciSorgusu();
    this.searchInput = new FormControl('');

    this.dialogTitle = 'Yeni arkadaş ekleme ekranı';
    this.searchInput.valueChanges
      .debounceTime(800)
      .distinctUntilChanged()
      .subscribe(searchText => {
        if (searchText.length < 3 && searchText.length > 0) {
          return;
        }
        if (this.guncelSorgu && this.guncelSorgu.aramaCumlesi !== searchText) {
          const yeniSorgu = Object.assign({}, this.guncelSorgu);
          yeniSorgu.aramaCumlesi = searchText;
          this.guncelSorgu = yeniSorgu;
          this.bul(this.guncelSorgu);
        }
      });
  }
  bul(yeniSorgu: KullaniciSorgusu) {
    this.yukleniyor = true;
    this.uyelikService.listeGetirKullanicilar(yeniSorgu).subscribe(listeSonuc => {
      if (listeSonuc.basarili) {
        if (listeSonuc.kayitSayisi === 0) {
          this.mesajService.goster('Hiç kayıt bulunamadı. Lütfen başka bir anahtar kelime yazın. ');
        }
        this.uyelikService.onBulunanKullanicilarDegisti.next(listeSonuc);
      } else {
        this.mesajService.hatalar(listeSonuc.hatalar);
      }
    }, () => this.mesajService.hataStr('Beklenmedik bir hata oluştu. Tekrar deneyin...'), () => this.yukleniyor = false
    );
  }

  ngOnInit() {
  }
  sayfaDegistir(sayfaBilgi) {
    const yeniSorgu = Object.assign({}, this.guncelSorgu, { sayfa: sayfaBilgi.pageIndex + 1, sayfaBuyuklugu: sayfaBilgi.pageSize });
    this.guncelSorgu = yeniSorgu;
    this.bul(this.guncelSorgu);
  }
  
}
