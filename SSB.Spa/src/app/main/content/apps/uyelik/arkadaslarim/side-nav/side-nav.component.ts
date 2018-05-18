import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { ArkadaslikTeklif, ArkadaslikSorgusu } from '../../../../../../models/arkadaslik-teklif';
import { State } from '../../../../../../store';
import { UyelikService } from '../../uyelik.service';

import * as fromArkadaslikReducer from '../../../../../../store/reducers/arkadaslar.reducer';
import * as fromArkadaslikActions from '../../../../../../store/actions/arkadaslar.actions';

@Component({
  selector: 'fuse-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class ArkadaslarimSideNavComponent implements OnDestroy {

  arkadaslik: ArkadaslikTeklif;
  filterBy: string;
  onUserDataChangedSubscription: Subscription;
  sorgu: ArkadaslikSorgusu;
  constructor(private store: Store<State>, public profilimService: UyelikService) {

    store.select(fromArkadaslikReducer.getArkadaslikSorgusu).subscribe(sorgu => {
      this.sorgu = sorgu;
    });
  }

  changeFilter(filter) {
    const sorgu: ArkadaslikSorgusu = this.createSorguWithFilter(filter);
    this.store.dispatch(new fromArkadaslikActions.ArkadaslarSorguDegistir(sorgu));
  }
  createSorguWithFilter(filtre): ArkadaslikSorgusu {

    const yeniSorgu = new ArkadaslikSorgusu();
    switch (filtre) {
      case 'tekliflerim':
        yeniSorgu.teklifEdilenler = true;
        break;
      case 'aldigimTeklifler':
        yeniSorgu.teklifEdenler = true;
        break;
      case 'kabuledilenler':
        yeniSorgu.kabulEdilenler = true;
        break;
      case 'cevapbekleyenler':
        yeniSorgu.cevapBeklenenler = true;
        break;
      case 'cevaplananlar':
        yeniSorgu.cevaplananlar = true;
        break;
      case 'silinenler':
        yeniSorgu.silinenler = true;
        break;
    }
    yeniSorgu.filtreCumlesi = filtre;
    return yeniSorgu;

  }
  ngOnDestroy() {
    if (this.onUserDataChangedSubscription) {
      this.onUserDataChangedSubscription.unsubscribe();
    }
  }

}
