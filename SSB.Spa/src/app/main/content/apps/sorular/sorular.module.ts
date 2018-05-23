import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SorularComponent } from './sorular.component';
import { SorularService } from './sorular.service';
import { SoruStoreModule } from './soru-store/soru-store.module';
import { SorularEffectsService } from './soru-store/effects/sorular-effects.service';
import { CoktanSecmeliSoruComponent } from './coktan-secmeli-soru/coktan-secmeli-soru.component';
import { AnahtarKelimelerComponent } from './anahtar-kelimeler/anahtar-kelimeler.component';
import { MaterialModule } from '../../../../material.module';
import { SbCoreModule } from '../../../../core/sb-core.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { OgrenimHedefleriComponent } from './ogrenim-hedefleri/ogrenim-hedefleri.component';
import { OgrenimHedefListComponent } from './ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-list.component';
import { OgrenimHedefSatirComponent } from './ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-satir/ogrenim-hedef-satir.component';
import { TekDogruluSecenekComponent } from './coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek.component';
import { TekDogruluSecenekDetayComponent } from './coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-detay/tek-dogrulu-secenek-detay.component';
import { SbHtmlEditorComponent } from './sb-html-editor/sb-html-editor.component';
import { FuseWidgetModule, FuseNavigationModule, FuseConfirmDialogModule } from '@fuse/components';
import { TekDogruluSecenekListComponent } from './coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-list.component';
import { TekDogruluSecenekItemComponent } from './coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-item/tek-dogrulu-secenek-item.component';
import { SoruDetayComponent } from './soru-detay/soru-detay.component';
import { SorularSideNavComponent } from './sorular-side-nav/sorular-side-nav.component';
import { RouterModule, Routes } from '@angular/router';
import { SoruListesiComponent } from './soru-listesi/soru-listesi.component';
import { SoruListesiSatiriComponent } from './soru-listesi/soru-listesi-satiri/soru-listesi-satiri.component';
import { SoruDepoVeriService } from './soru-store/helpers/soru-depo-veri.service';
import { SorularResolveGuard } from './soru-store/guards/sorular-resolve.guard';
import { SoruOnizlemeComponent } from './soru-onizleme/soru-onizleme.component';
import { CoktanSecmeliSoruValidatorleri } from './coktan-secmeli-soru/validators';
import { YeniSoruBtnComponent } from './sorular-side-nav/yeni-soru-btn/yeni-soru-btn.component';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { CoktanSecmeliIliskiliSoruComponent } from './coktan-secmeli-iliskili-soru/coktan-secmeli-iliskili-soru.component';
import { IliskiliSoruListesiComponent } from './coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-listesi.component';
import { IliskiliSoruItemComponent } from './coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-item/iliskili-soru-item.component';
import { IliskiliSoruDetayComponent } from './coktan-secmeli-iliskili-soru/iliskili-soru-detay/iliskili-soru-detay.component';
import { IliskiliSoruService } from './coktan-secmeli-iliskili-soru/iliskili-soru.service';




const routes: Routes = [
  {
    path: '',
    component: SorularComponent,
    canActivate: [SorularResolveGuard]
  },
  {
    path: 'birim/:birimNo',
    component: SorularComponent,
    canActivate: [SorularResolveGuard]
  },
  {
    path: 'program/:programNo',
    component: SorularComponent,
    canActivate: [SorularResolveGuard]
  },
  {
    path: 'program/:programNo/donem/:donemNo',
    component: SorularComponent,
    canActivate: [SorularResolveGuard]
  },
  {
    path: 'program/:programNo/donem/:donemNo/ders/:dersNo',

    component: SorularComponent,
    canActivate: [SorularResolveGuard]
  },
  {
    path: 'program/:programNo/donem/:donemNo/ders/:dersNo/konu/:konuNo',
    component: SorularComponent,
    canActivate: [SorularResolveGuard]
  },
  {
    path: 'ders/:dersNo/konu/:konuNo/soru/:soruId',
    component: SorularComponent,
    canActivate: [SorularResolveGuard]
  },
  {
    path: 'iliskilisoru/:soruKokuNo',
    component: CoktanSecmeliIliskiliSoruComponent,
    resolve: {
      mail: IliskiliSoruService
    }
  },
  {
    path: 'ders/:dersNo/soru/:soruId',
    component: SorularComponent,
    canActivate: [SorularResolveGuard]
  },
  {
    path: 'soru/:soruId',
    component: SorularComponent,
    canActivate: [SorularResolveGuard]
  },
  {
    path: '**',
    redirectTo: ''
  },

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SoruStoreModule,
    MaterialModule,
    FuseSharedModule,
    SbCoreModule,
    SatPopoverModule,
    FuseWidgetModule,
    FuseConfirmDialogModule,
    FuseNavigationModule
  ],
  declarations: [
    SorularComponent,
    CoktanSecmeliSoruComponent,
    AnahtarKelimelerComponent,
    OgrenimHedefleriComponent,
    OgrenimHedefListComponent,
    OgrenimHedefSatirComponent,
    TekDogruluSecenekComponent,
    TekDogruluSecenekDetayComponent,
    SbHtmlEditorComponent,
    TekDogruluSecenekListComponent,
    TekDogruluSecenekItemComponent,
    SoruDetayComponent,
    SorularSideNavComponent,
    SoruListesiComponent,
    SoruListesiSatiriComponent,
    SoruOnizlemeComponent,
    YeniSoruBtnComponent,
    CoktanSecmeliIliskiliSoruComponent,
    IliskiliSoruListesiComponent,
    IliskiliSoruItemComponent,
    IliskiliSoruDetayComponent
  ],
  providers: [
    SorularEffectsService,
    SoruDepoVeriService,
    SorularService,
    CoktanSecmeliSoruValidatorleri,
    SorularResolveGuard],
  entryComponents: [SoruOnizlemeComponent, CoktanSecmeliSoruComponent]
})
export class SorularModule { }
