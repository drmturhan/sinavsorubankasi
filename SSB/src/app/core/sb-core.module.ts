import { NgModule } from '@angular/core';
import { YukleniyorComponent } from './components/yukleniyor/yukleniyor.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { LutfenBekleyinComponent } from './components/lutfen-bekleyin/lutfen-bekleyin.component';
import { TokenInterceptorProvider } from './interceptors/token.interceptor';


@NgModule({
    imports: [
        FuseSharedModule
    ],
    declarations: [
        YukleniyorComponent,
        LutfenBekleyinComponent
    ],
    exports: [
        YukleniyorComponent,
        LutfenBekleyinComponent
    ],
    providers: [
        TokenInterceptorProvider
    ]

})
export class SbCoreModule { }


