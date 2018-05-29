import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../material.module';


const routes: Routes = [
    {
        path: 'anasayfa',
        loadChildren: './anasayfa/anasayfa.module#AnasayfaModule'
    },

    {
        path: 'mail',
        loadChildren: './mail-ngrx/mail.module#FuseMailNgrxModule'
    },
    {
        path: 'sorudeposu',
        loadChildren: './sorular/sorular.module#SorularModule'
    },
    {
        path: 'uyelik',
        loadChildren: './uyelik/uyelik.module#UyelikModule'
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'anasayfa'
    }



];

@NgModule({
    imports: [
        FuseSharedModule,
        RouterModule.forChild(routes),
        MaterialModule
    ],
    declarations: []
})
export class FuseAppsModule {
}
