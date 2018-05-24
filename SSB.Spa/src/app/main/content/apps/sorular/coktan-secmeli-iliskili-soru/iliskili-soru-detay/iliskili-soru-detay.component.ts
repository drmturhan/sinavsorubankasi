import { Component, OnInit, OnDestroy } from '@angular/core';
import { SoruListe } from '../../models/soru';
import { Subscription } from 'rxjs';
import { IliskiliSoruService } from '../iliskili-soru.service';
import { fuseAnimations } from '@fuse/animations';
import { DersItem } from '../../models/birim-program-donem-ders';
import { SorularService } from '../../sorular.service';
import { MatDialog } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'fuse-iliskili-soru-detay',
  templateUrl: './iliskili-soru-detay.component.html',
  styleUrls: ['./iliskili-soru-detay.component.scss'],
  animations: fuseAnimations
})
export class IliskiliSoruDetayComponent implements OnInit, OnDestroy {

  soru: SoruListe;
  ayrintiyiGoster = false;
  onAktifSoruDegisti: Subscription;

  private ders: DersItem;
  public get Ders(): DersItem {
    if (this.soru && !this.ders) {
      this.ders = this.sorularService.dersBul(this.soru.dersNo);
      this._dersKonuAdi = undefined;
    }
    return this.ders;
  }

  private _dersKonuAdi: string;
  public get dersKonuAdi(): string {
    if (!this._dersKonuAdi) {
      this._dersKonuAdi = this.sorularService.dersKonuAdiniAl(this.soru.dersAdi, this.soru.konuAdi);
    }
    return this._dersKonuAdi;
  }

  dialogRef: any;
  constructor(
    public dialog: MatDialog,
    public sorularService: SorularService,
    private service: IliskiliSoruService
  ) { }

  ngOnInit() {
    this.onAktifSoruDegisti =
      this.service.onAktifSoruDegisti
        .subscribe(gelenSoru => {
          this.soru = gelenSoru;
        });
  }

  ngOnDestroy() {
    this.onAktifSoruDegisti.unsubscribe();
  }
  toggleStar(event) {
    event.stopPropagation();

    // this.soru.toggleStar();

    // this.service.updateMail(this.mail);
  }
  detayToogle() {
    this.ayrintiyiGoster = !this.ayrintiyiGoster;
  }
  soruyuDegistir() {

  }
  soruOnIzlemeGoster() {
  }
  soruyuAcKapat() {
    if (this.soru.aktif === true) {
      this.soruyuKapat();
    } else { this.soruyuAc(); }
  }
  soruyuKapat() {

  }
  soruyuAc() {

  }
  favoriToogle() {
    if (this.soru.favori) {
      this.soruyuSiradanYap();
    } else { this.soruyuFavoriYap(); }
  }
  soruyuFavoriYap() {

  }
  soruyuSiradanYap() {

  }
  soruyuSilindiYap() {

    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      width: '600px',
      height: '400px',
      data: {
        onaybasligi: 'Silme onayı',
        onaymesaji: '<p>Silinsin derseniz BU SORU sistemden tamamen silinecek!</p> Soru silinsin mi?',
        olumluButonYazisi: 'Silinsin',
        olumsuzButonYazisi: 'Vazgeçtim'
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {

      }
    });
  }
}
