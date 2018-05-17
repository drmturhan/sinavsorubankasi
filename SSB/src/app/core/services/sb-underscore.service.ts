import { Injectable } from '@angular/core';
import * as _ from 'underscore';
@Injectable({
  providedIn: 'root'
})
export class SbUnderscoreService {

  constructor() { }
  public each(array, delegate) {
    return _.each(array, delegate);
  }

  public findWhere(list, properties) {
    return _.findWhere(list, properties);
  }
}
