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
    return yeni.id;
  }
  bilgiAl(key: string) {
    this.history.forEach(element => {
      if (element.id === key) {
        const donecek = Object.assign({}, element.bilgi);
        element.silinecek = true;
        return donecek;
      }
    });
    return null;
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
