import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from '../../../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { SbMesajService } from '../../../../../core/services/sb-mesaj.service';

import * as fromRootStore from '../../../../../store/index';
import { environment } from 'environments/environment';
import { KayitSonuc, Sonuc } from '../../../../../models/sonuclar';
import { KullaniciDetay, KisiFoto, KullaniciBilgi, Cinsiyet, ProfilKaydet } from '../../../../../models/kullanici';
import { UyelikService } from '../uyelik.service';
import { ProfilimVeriSeti } from '../models/profilim';

@Component({
  selector: 'fuse-profilim',
  templateUrl: './profilim.component.html',
  styleUrls: ['./profilim.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProfilimComponent implements OnInit, OnDestroy {

  authState$: Subscription;
  kullanici: KullaniciDetay;
  suankiKullanici: KullaniciBilgi;
  cinsiyetListesi: Cinsiyet[];
  bosFotoUrl: any;
  profilFotoUrl: any;
  saveUrl = '';
  private kaydediliyor = false;

  constructor(
    private authService: AuthService,
    private mesajService: SbMesajService,
    private authStore: Store<fromRootStore.AuthState>,
    private uiStore: Store<fromRootStore.UIState>,
    private router: Router,
    private uyelikService: UyelikService,
    private activatedRoute: ActivatedRoute

  ) {
    this.saveUrl = `profilim/fotografEkle`;
    this.bosFotoUrl = environment.bosFotoUrl;
    this.authState$ = this.authStore.select(fromRootStore.getAuthState).subscribe(authDurum => {
      this.suankiKullanici = authDurum.kullaniciBilgi;
      if (!authDurum.tokenString) {
        this.router.navigate(['/']);
        return;
      }
      if (authDurum.kullaniciBilgi.profilFotoUrl) {
        this.profilFotoUrl = authDurum.kullaniciBilgi.profilFotoUrl;
      } else {
        this.profilFotoUrl = this.bosFotoUrl;
      }


    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      const sonuc: ProfilimVeriSeti = data['data'];
      if (sonuc.cinsiyetler.basarili) {
        this.cinsiyetListesi = sonuc.cinsiyetler.donenListe;

      }
      if (sonuc.kullanici.basarili) {
        this.kullanici = sonuc.kullanici.donenNesne;
      }
    });
  }
  ngOnDestroy() {
    this.authState$.unsubscribe();

  }
  profilFotografiYap(foto: KisiFoto) {


    this.authService.profilFotografiYap(foto.id)
      .subscribe((sonuc: Sonuc) => {
        if (sonuc.basarili) {
          if (this.kullanici.fotograflari) {
            const suankiProfilFoto = _.findWhere(this.kullanici.fotograflari, { profilFotografi: true });
            suankiProfilFoto.profilFotografi = false;
          }
          foto.profilFotografi = true;
          const yeniKullanici = Object.assign({}, this.suankiKullanici);
          yeniKullanici.profilFotoUrl = foto.url;
          localStorage.setItem('kullanici', JSON.stringify(yeniKullanici));
          this.suankiKullanici = yeniKullanici;
          this.authStore.dispatch(new fromRootStore.KullaniciBilgiDegisti(this.suankiKullanici));
        }
      });
  }
  fotografKaydedildi(foto: KisiFoto) {
    if (foto.profilFotografi) {
      const yeniKullanici = Object.assign({}, this.suankiKullanici);
      yeniKullanici.profilFotoUrl = foto.url;
      localStorage.setItem('kullanici', JSON.stringify(yeniKullanici));
      this.suankiKullanici = yeniKullanici;
      this.authStore.dispatch(new fromRootStore.KullaniciBilgiDegisti(this.suankiKullanici));
    }
  }
  fotografSil(id: number) {
    this.authService.fotografSil(id)
      .subscribe((sonuc: Sonuc) => {
        if (sonuc.basarili) {
          this.kullanici.fotograflari.splice(_.findIndex(this.kullanici.fotograflari, { id: id }), 1);
        } else {
          this.mesajService.hatalar(sonuc.hatalar);
        }
      },
        hata => this.mesajService.hataStr('Fotoğraf silinemedi!')
      );
  }
  profilimKaydedilsin(kayit: ProfilKaydet) {
    
    this.kaydediliyor = true;
    this.uyelikService.profilKaydet(this.suankiKullanici.id, kayit).subscribe((sonuc: Sonuc) => {
      if (sonuc.basarili) {
        const yeniBilgi: KullaniciBilgi = Object.assign({}, this.suankiKullanici);
        yeniBilgi.tamAdi = `${kayit.unvan !== null ? kayit.unvan : ''} ${kayit.ad}  ${kayit.digerAd !== '' ? kayit.digerAd : ''}  ${kayit.soyad}`.trimLeft();

        const degisenKullanici: KullaniciDetay = Object.assign({}, this.suankiKullanici, kayit, { tamAdi: yeniBilgi.tamAdi });

        this.kullanici = degisenKullanici;
        this.mesajService.goster('Profil bilgisi kaydedildi.');

        this.authStore.dispatch(new fromRootStore.KullaniciBilgiDegisti(yeniBilgi));
      } else {
        this.mesajService.hataStr('Profil bilgisi kaydedilemedi!');
      }
    }, () => this.mesajService.hataStr('Kaydedilemedi. Lütfen tekrar deneyin!'),
      () => this.kaydediliyor = false);
  }
}
