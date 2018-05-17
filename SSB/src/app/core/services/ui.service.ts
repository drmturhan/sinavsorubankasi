import { Injectable } from '@angular/core';
import { Dil } from '../../models/dil';

@Injectable({
  providedIn: 'root'
})
export class UIService {

  constructor() { }
  sistemDilleriniAl(): Dil[] {

    return [
      {
        id: 'tr',
        title: 'Turkish',
        flag: 'tr',
        locale: 'tr-TR'
      },
      {
        id: 'en',
        title: 'English',
        flag: 'us',
        locale: 'en-US'
      }
    ];
  }
}

