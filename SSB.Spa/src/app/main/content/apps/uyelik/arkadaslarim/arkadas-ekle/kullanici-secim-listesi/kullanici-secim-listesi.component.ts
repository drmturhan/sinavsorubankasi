import { Component, OnInit, Input, ViewChild, OnDestroy, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { fuseAnimations } from '@fuse/animations';
import { KullaniciDetay } from '../../../../../../../models/kullanici';
import { ListeSonuc } from '../../../../../../../models/sonuclar';
import { UyelikService } from '../../../uyelik.service';
import { SbMesajService } from '../../../../../../../core/services/sb-mesaj.service';
import { State } from '../../../../../../../store';
import * as fromArkadaslarActions from '../../../../../../../store/actions/arkadaslar.actions';

@Component({
  selector: 'fuse-kullanici-secim-listesi',
  templateUrl: './kullanici-secim-listesi.component.html',
  styleUrls: ['./kullanici-secim-listesi.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class KullaniciSecimListesiComponent implements OnInit, OnDestroy {

  @Input() kullaniciNo: number;
  @Output() sayfaDegissin = new EventEmitter();


  dataSource: MatTableDataSource<KullaniciDetay> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  kullanicilar: ListeSonuc<KullaniciDetay>;


  gosterilenKolonlar = ['avatar', 'ad', 'eposta', 'telefon', 'butonlar'];

  onBulunanKullanicilarDegisti$: Subscription;

  constructor(
    
    private profilimService: UyelikService,
    private mesajService: SbMesajService,
    private rootStore: Store<State>) {
    this.onBulunanKullanicilarDegisti$ = profilimService.onBulunanKullanicilarDegisti.subscribe(listeSonuc => {
      if (listeSonuc && listeSonuc.basarili) {
        this.kullanicilar = listeSonuc;
        this.dataSource.data = this.kullanicilar.donenListe;
      }
    });

  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.onBulunanKullanicilarDegisti$.unsubscribe();
  }
  sayfaDegisti(bilgi) {
    this.sayfaDegissin.emit(bilgi);
  }
  teklifEt(kullanici) {

    this.profilimService.arkadaslikteklifEt(this.kullaniciNo, kullanici.id).subscribe(sonuc => {
      if (sonuc.basarili) {
        this.mesajService.goster('Arkadaş olma isteği gönderildi. Cevap bekleyenler filtresiyle sonucu takip edebilirsiniz.');
        this.rootStore.dispatch(new fromArkadaslarActions.ArkadaslarListesiDegisti(sonuc.donenNesne));
      }
    },
      hata => this.mesajService.hataStr(hata.error));
  }
}
