import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { AktivasyonEpostasiComponent } from './hesap-aktivasyon/aktivasyon-epostasi/aktivasyon-epostasi.component';
import { SifreKurtarmaBaslatComponent } from './sifre-kurtarma-baslat/sifre-kurtarma-baslat.component';
import { UyelikBasvuruComponent } from './uyeol/basvuru/uyelik-basvuru.component';
import { UyelikBasvuruResolver } from './uyeol/uyelik-basvuru-resolver';
import { UyelikValidatorleri } from './uyeol/uyelik-validators';
import { SurecBasladiComponent } from './uyeol/surec-basladi/surec-basladi.component';
import { BrowserModule } from '@angular/platform-browser';
import { UyelikService } from './uyelik.service';
import { MaterialModule } from '../../../../material.module';
import { SbCoreModule } from '../../../../core/sb-core.module';
import { SifreSifirlaComponent } from './sifre-sifirla/sifre-sifirla.component';
import { ProfilimComponent } from './profilim/profilim.component';
import { FuseConfirmDialogModule } from '@fuse/components';
import { KullaniciFotograflariComponent } from './profilim/kullanici-fotograflari/kullanici-fotograflari.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ProfilimDegistirComponent } from './profilim/profilim-degistir/profilim-degistir.component';
import { ProfilimResolver } from './profilim/profilim-resolver';


const routes = [

    {
        path: 'basvurusu',
        component: UyelikBasvuruComponent,
        resolve: { data: UyelikBasvuruResolver }
    },
    {
        path: 'aktivasyonbaslat',
        component: AktivasyonEpostasiComponent

    },
    {
        path: 'sifrekurtar',
        component: SifreKurtarmaBaslatComponent
    },
    {
        path: 'sifresifirla',
        component: SifreSifirlaComponent
    },
    {
        path: 'profilim',
        component: ProfilimComponent,
        resolve: { data: ProfilimResolver }
    }

];
@NgModule({
    declarations: [
        AktivasyonEpostasiComponent,
        SifreKurtarmaBaslatComponent,
        UyelikBasvuruComponent,
        SurecBasladiComponent,
        SifreSifirlaComponent,
        ProfilimComponent,
        KullaniciFotograflariComponent,
        ProfilimDegistirComponent
    ],
    imports: [
        CommonModule,
        FileUploadModule,
        FuseConfirmDialogModule,
        FuseSharedModule,
        RouterModule.forChild(routes),
        SbCoreModule,
        TranslateModule,
        MaterialModule,

    ],

    providers: [
        UyelikService,
        UyelikBasvuruResolver,
        ProfilimResolver,
        UyelikValidatorleri
    ]

})
export class UyelikModule {

}
