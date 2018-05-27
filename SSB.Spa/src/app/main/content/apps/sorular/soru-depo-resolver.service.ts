import { Injectable } from '@angular/core';
import { ResolveInfo } from '../../../../models/resolve-model';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class SoruDepoResolverService {

  history: ResolveInfo[] = [];

  constructor() {

  }
  bilgiKoy(bilgi: any, sayfa: string): ResolveInfo {
    const yeni: ResolveInfo = new ResolveInfo();
    yeni.id = Guid.create().toString();
    yeni.url = sayfa;
    yeni.sayfaBilgisi = bilgi;
    this.history.push(yeni);
    return yeni;
  }
  bilgiDegistir(key: String, sayfa: string, yeniBilgi: any) {
    let yaratilsin = false;
    if (this.history.length === 0) {
      yaratilsin = true;

    }
    const indeks = this.history.findIndex(el => el.id === key && el.url === sayfa);
    if (indeks === -1) {
      yaratilsin = true;
    }
    if (yaratilsin) {
      return this.bilgiKoy(yeniBilgi, sayfa);
    }
    else {
      this.history[indeks].sayfaBilgisi = yeniBilgi;
      return this.history[indeks];
    }

  }
  bilgiAl(key: string, sayfa: string): any {
    if (this.history.length === 0) { return null; }
    const sonuc: ResolveInfo[] = this.history.filter(el => el.id === key && el.url === sayfa);
    // console.log('sonuc:', sonuc);

    if (sonuc && sonuc.length === 1) {
      const donecek = Object.assign({}, sonuc[0]);
      sonuc[0].silinecek = true;
      // this.temizle();
      return donecek;
    }

  }
  temizle() {
    let i = this.history.length;
    while (i--) {
      if (this.history[i].silinecek === true) {
        this.history.splice(i, 1);
      }
    }
  }
  sil(sayfa: string) {
    let i = this.history.length;
    while (i--) {
      if (this.history[i].sayfaBilgisi === sayfa) {
        this.history.splice(i, 1);
      }
    }
  }
}
