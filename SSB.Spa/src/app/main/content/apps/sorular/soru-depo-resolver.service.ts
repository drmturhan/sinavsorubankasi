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
  bilgiKoy(bilgi: any): string {
    const yeni: ResolveInfo = new ResolveInfo();
    yeni.id = Guid.create().toString();
    yeni.bilgi = bilgi;
    this.history.push(yeni);
    return yeni.id;
  }
  bilgiAl(key: string): any {
    if (this.history.length === 0) { return null; }
    const sonuc: ResolveInfo[] = this.history.filter(el => el.id === key);
    // console.log('sonuc:', sonuc);

    if (sonuc && sonuc.length === 1) {
      const donecek = Object.assign({}, sonuc[0].bilgi);
      sonuc[0].silinecek = true;
      //this.temizle();
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
}
