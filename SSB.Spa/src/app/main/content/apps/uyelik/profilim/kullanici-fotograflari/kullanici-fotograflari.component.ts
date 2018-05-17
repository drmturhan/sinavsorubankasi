
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { KisiFoto } from '../../../../../../models/kullanici';
import { environment } from 'environments/environment';
import { SbMesajService } from '../../../../../../core/services/sb-mesaj.service';

import * as fromRootStore from '../../../../../../store/index';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'fuse-kullanici-fotograflari', 
  templateUrl: './kullanici-fotograflari.component.html',
  styleUrls: ['./kullanici-fotograflari.component.scss']
})
export class KullaniciFotograflariComponent implements OnInit {
  @Input() fotograflar: KisiFoto[];
  @Input() url: string;
  @Output() profilFotografiYap = new EventEmitter<KisiFoto>();
  @Output() fotoSil = new EventEmitter<number>();
  @Output() fotografKaydedildi = new EventEmitter<KisiFoto>();

  public uploader: FileUploader = new FileUploader({});
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;
  baseUrl = environment.apiUrl;
  authState$: Subscription;
  kullaniciNo = 0;
  token = '';
  constructor(
    private dialog: MatDialog,
    private mesajService: SbMesajService,
    private authStore: Store<fromRootStore.AuthState>) {
    this.authState$ = this.authStore.select(fromRootStore.getAuthState).subscribe(authDurum => {
      if (authDurum.kullaniciAdi) {
        this.kullaniciNo = authDurum.kullaniciBilgi.id;
      } else {
        this.kullaniciNo = 0;
      }
      this.token = authDurum ? authDurum.tokenString : '';
    });
  }

  ngOnInit() {
    this.initializeUploader();
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  initializeUploader() {
    const maxFileSize = 10 * 1024 * 1024;
    const queueLimit = 5;
    const jeton = 'Bearer ' + this.token;
    if (this.url == null) {
      console.log('Url yok');
      return;
    }
    this.uploader = new FileUploader({
      url: `${this.baseUrl}/${this.url}`,
      authToken: jeton,
      isHTML5: true,
      queueLimit: queueLimit,
      allowedFileType: ['image'],
      removeAfterUpload: false,
      autoUpload: false,
      maxFileSize: maxFileSize

    });

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: KisiFoto = JSON.parse(response);
        const foto = {
          id: res.id,
          url: res.url,
          kisiNo: res.kisiNo,
          aciklama: res.aciklama,
          eklemeTarihi: res.eklenmeTarihi,
          profilFotografi: res.profilFotografi
        };
        this.fotograflar.push(foto);
        this.fotografKaydedildi.emit(foto);
      }
    };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      this.uploader.cancelItem(item);
      this.mesajService.hataStr('Fotoğraf yüklenemedi!');
    };
    this.uploader.onWhenAddingFileFailed = (item, filter, options) => {
      let message = '';
      switch (filter.name) {
        case 'queueLimit':
          message = 'Aynı anda en fazla 5 resim yükleyebilirsiniz!';
          break;
        case 'fileSize':
          message = item.name + ' adlı resim ' +
            this.formatBytes(item.size) + ' boyutunda enfazla ' + this.formatBytes(maxFileSize) + ' büyüklüğündeki resmlere izin verilmektedir.';
          break;
        default:
          message = 'Resim yüklenirken bir hata oluştu!';
          break;
      }
      this.mesajService.hataStr(message);
    };
    this.uploader.onCompleteAll = () => {
      this.uploader.clearQueue();

    };
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
  }
  private formatBytes(bytes, decimals?) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024,
      dm = decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  asilFotoYap(foto: KisiFoto) {
    this.profilFotografiYap.emit(foto);
  }
  silmeOnayiIste(foto: KisiFoto) {

    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      width: '600px',
      height: '400',
      data: {
        onaybasligi: 'Silme onayı!',
        onaymesaji: `<p>Bu fotoğrafı silmek istediğinizden emin misiniz?`,
        olumluButonYazisi: 'Evet Silinsin',
        olumsuzButonYazisi: 'Vazgeçtim'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fotoSil.emit(foto.id);
      }
    });
  }
}
