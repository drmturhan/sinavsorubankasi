import { Component, Input } from '@angular/core';

@Component({
    selector: 'fuse-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FuseFooterComponent {
    @Input() kullaniciVar: boolean;
    constructor() {
    }
}
