import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatProgressBarModule, MatToolbarModule, MatDialogModule, MatFormFieldModule, MatCheckboxModule, MatInputModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { FuseToolbarComponent } from 'app/main/toolbar/toolbar.component';
import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../../material.module';
import { SbCoreModule } from '../../core/sb-core.module';

@NgModule({
    declarations: [
        FuseToolbarComponent,
        LoginComponent
    ],
    imports: [
        RouterModule,

        MaterialModule,

        SbCoreModule,

        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule
    ],
    exports: [
        FuseToolbarComponent
    ],
    entryComponents: [LoginComponent]
})
export class FuseToolbarModule {
}
