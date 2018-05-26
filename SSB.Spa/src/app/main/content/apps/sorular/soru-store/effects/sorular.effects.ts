import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { exhaustMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import * as fromSorularActions from '../actions/sorular.actions';
import * as fromBirimlerActions from '../actions/birimler.actions';

// import * as fromUIActions from '../../../../../_store/actions/ui.actions';
import { SoruListe } from '../../models/soru';
import { getSorularState, getAktifBirim } from '../selectors';
import { SoruBirimItem } from '../../models/birim-program-donem-ders';
import { SbMesajService } from '../../../../../../core/services/sb-mesaj.service';

import { KayitSonuc, Sonuc } from '../../../../../../models/sonuclar';
import * as fromRootStore from '../../../../../../store/index';
import { SorularEffectsService } from './sorular-effects.service';
import { SoruDepoResolverService } from '../../soru-depo-resolver.service';
import { ResolveInfo } from '../../../../../../models/resolve-model';

@Injectable()
export class SorularEffect {
    routerState: any;
    aktifBirim: SoruBirimItem;
    bilgi: ResolveInfo;
    constructor(
        private actions: Actions,
        private service: SorularEffectsService,
        private store: Store<fromRootStore.State>,
        private mesajService: SbMesajService,
        private resolverBilgi: SoruDepoResolverService
    ) {
        this.store.select(fromRootStore.getRouterState).subscribe(routerState => {
            if (routerState) {
                this.routerState = routerState.state;
                // this.bilgi = resolverBilgi.bilgiAl(routerState.state.bilgi)
            }
        });
        this.store.select(getAktifBirim).subscribe((birim: SoruBirimItem) => this.aktifBirim = birim);
    }
    // @Effect({dispatch: false})
    @Effect()
    getSorular: Observable<fromSorularActions.SorularActionsAll> =
        this.actions
            .ofType<fromSorularActions.GetSorular>(fromSorularActions.GET_SORULAR)
            .pipe(
                exhaustMap((action) => {
                    const handle: any[] = this.service.soruHandleYarat(this.routerState);
                    if (this.aktifBirim !== null && this.aktifBirim.programlari && this.aktifBirim.programlari.length > 0) {
                        handle.push({ id: 'birimNo', value: this.aktifBirim.birimId });
                        this.store.dispatch(new fromRootStore.StartLoading());
                        return this.service.getKullanicininSorulari(handle)
                            .map((sorular: SoruListe[]) => {

                                this.store.dispatch(new fromRootStore.StopLoading());
                                this.mesajService.goster('Soru listesi alındı.');

                                return new fromSorularActions.GetSorularTamam({
                                    loaded: handle,
                                    sorular: sorular
                                });

                            })
                            .catch((err) => of(new fromSorularActions.GetSorularBasarisiz(err)));
                    }
                    else {
                        return of(new fromSorularActions.GetSorularBasarisiz('Birim seçilmemiş'));
                    }
                })
            );


    @Effect()
    setAktifSoru: Observable<Action> =
        this.actions
            .ofType<fromSorularActions.SetAktifSoru>(fromSorularActions.SET_AKTIF_SORU)
            .pipe(
                withLatestFrom(this.store.select(getSorularState)),
                map(([action, state]) => {
                    return new fromSorularActions.SetAktifSoruSuccess(state.entities[action.payload]);
                })
            );
    @Effect()
    updateSoru: Observable<fromSorularActions.SorularActionsAll> =
        this.actions
            .ofType<fromSorularActions.UpdateSoru>(fromSorularActions.UPDATE_SORU)
            .pipe(
                exhaustMap((action) => {
                    this.store.dispatch(new fromRootStore.StartLoading());
                    return this.service.updateSoru(action.payload)
                        .map((sonuc: KayitSonuc<SoruListe>) => {
                            this.store.dispatch(new fromRootStore.StopLoading());
                            if (sonuc.basarili) {
                                this.mesajService.goster('Soru kaydedildi.');
                                return new fromSorularActions.UpdateSoruTamam(sonuc.donenNesne);
                            } else {
                                this.mesajService.hatalar(sonuc.hatalar);
                            }

                        }).catch(err => of(new fromSorularActions.GetSorularBasarisiz(err)));
                })
            );

    @Effect()
    soruAcKapa: Observable<fromSorularActions.SorularActionsAll> =
        this.actions
            .ofType<fromSorularActions.SoruAcKapa>(fromSorularActions.SORU_AC_KAPA)
            .pipe(
                exhaustMap((action) => {
                    this.store.dispatch(new fromRootStore.StartLoading());
                    return this.service.soruAcKapaDegistir(action.payload)
                        .map((sonuc: KayitSonuc<SoruListe>) => {
                            this.store.dispatch(new fromRootStore.StopLoading());
                            if (sonuc.basarili) {
                                this.mesajService.goster('İşlem başarılı');
                                return new fromSorularActions.UpdateSoruTamam(sonuc.donenNesne);
                            } else {
                                this.mesajService.hatalar(sonuc.hatalar);
                            }

                        });
                })
            );
    @Effect()
    soruFavoriDegistir: Observable<fromSorularActions.SorularActionsAll> =
        this.actions
            .ofType<fromSorularActions.SoruFavoriDegistir>(fromSorularActions.SORU_FAVORI_DEGISTIR)
            .pipe(
                exhaustMap((action) => {
                    this.store.dispatch(new fromRootStore.StartLoading());
                    return this.service.soruFavoriDegistir(action.payload)
                        .map((sonuc: KayitSonuc<SoruListe>) => {
                            this.store.dispatch(new fromRootStore.StopLoading());
                            if (sonuc.basarili) {
                                this.mesajService.goster('İşlem başarılı');

                                return new fromSorularActions.UpdateSoruTamam(sonuc.donenNesne);
                            } else {
                                this.mesajService.hatalar(sonuc.hatalar);
                            }

                        });
                })
            );

    @Effect()
    soruyuSilindiOlarakIsaretle: Observable<fromSorularActions.SorularActionsAll> =
        this.actions
            .ofType<fromSorularActions.SoruSilindiIsaretle>(fromSorularActions.SORU_SIL)
            .pipe(
                exhaustMap((action) => {
                    this.store.dispatch(new fromRootStore.StartLoading());
                    return this.service.soruSilindiOlarakIsaretle(action.payload)
                        .map((sonuc: Sonuc) => {
                            this.store.dispatch(new fromRootStore.StopLoading());
                            if (sonuc.basarili) {
                                this.mesajService.goster('İşlem başarılı');
                                return new fromSorularActions.SoruSilindi(action.payload);
                            } else {
                                this.mesajService.hatalar(sonuc.hatalar);
                            }

                        });
                })
            );

    @Effect()
    updateSorularTamam: Observable<fromSorularActions.SorularActionsAll> =
        this.actions
            .ofType<fromSorularActions.UpdateSorularTamam>(fromSorularActions.UPDATE_SORULAR_TAMAM)
            .pipe(
                mergeMap(() =>
                    [
                        new fromSorularActions.DeselectSorularTumu(),
                        new fromSorularActions.GetSorular()
                    ])
            );

}
