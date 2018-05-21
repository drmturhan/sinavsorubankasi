import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Hata } from '../../models/sonuclar';



@Injectable({
    providedIn: 'root'
})
export class SbMesajService {

    constructor(private snackBar: MatSnackBar) { }

    goster(mesaj: string, action?: string, sure?: number): MatSnackBarRef<SimpleSnackBar> | null {
        const mesajlar: string[] = [mesaj];
        return this.yansit(mesajlar, action);
    }
    yansit(mesajlar: string[], action?: string, sure?: number): MatSnackBarRef<SimpleSnackBar> | null {
        if (mesajlar && mesajlar.length > 0) {
            if (sure == null) {
                sure = 4000;
            }
            setTimeout(() => {
                return this.snackBar.open(mesajlar[0], action,
                    {
                        duration: sure,
                        verticalPosition: 'top',
                        horizontalPosition: 'center',
                        panelClass: ['snack-basari']
                    });
            });

        }
        return null;
    }
    hataStr(hataStr: string, action?: string, sure?: number): MatSnackBarRef<SimpleSnackBar> | null {
        const hatalar: Hata[] = [{ kod: '', tanim: hataStr }];
        return this.hatalar(hatalar, action, sure);
    }
    hata(hata: Hata): MatSnackBarRef<SimpleSnackBar> | null {
        const hatalar: Hata[] = [hata];
        return this.hatalar(hatalar);
    }
    hatalar(hatalar: Hata[], action?: string, sure?: number): MatSnackBarRef<SimpleSnackBar> | null {
        if (sure == null) {
            sure = 4000;
        }
        if (hatalar && hatalar.length > 0) {
            setTimeout(() => {
                return this.snackBar.open(hatalar[0].tanim, action,
                    {
                        duration: sure,
                        verticalPosition: 'top',
                        horizontalPosition: 'center',
                        panelClass: ['snack-hata'],
                    });
            });
        }
        return null;
    }
}
