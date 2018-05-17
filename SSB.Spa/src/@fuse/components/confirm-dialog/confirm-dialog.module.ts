import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        FuseConfirmDialogComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule
    ],
    exports: [
        FuseConfirmDialogComponent
    ],
    entryComponents: [
        FuseConfirmDialogComponent
    ],
})
export class FuseConfirmDialogModule {
}
