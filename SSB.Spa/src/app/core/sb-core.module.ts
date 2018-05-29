import { NgModule } from '@angular/core';
import { YukleniyorComponent } from './components/yukleniyor/yukleniyor.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { LutfenBekleyinComponent } from './components/lutfen-bekleyin/lutfen-bekleyin.component';
import { TokenInterceptorProvider } from './interceptors/token.interceptor';

import { SubmitIfValidDirective } from './directives/submit-if-valid.directive';
import { OzetPipe } from './pipes/ozet.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';


@NgModule({
    imports: [
        
        FuseSharedModule
    ],
    declarations: [
        YukleniyorComponent,
        LutfenBekleyinComponent,
        SubmitIfValidDirective,
        OzetPipe,
        TimeAgoPipe
    ],
    exports: [
        YukleniyorComponent,
        LutfenBekleyinComponent,
        SubmitIfValidDirective,
        OzetPipe,
        TimeAgoPipe
    ],
    providers: [
        TokenInterceptorProvider
    ]

})
export class SbCoreModule { }


