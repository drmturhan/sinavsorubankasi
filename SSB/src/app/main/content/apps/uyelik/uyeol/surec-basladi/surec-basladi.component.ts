import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'sb-surec-basladi',
  templateUrl: './surec-basladi.component.html',
  styleUrls: ['./surec-basladi.component.scss']
})
export class SurecBasladiComponent implements OnInit {

  constructor(
    private fuseConfig: FuseConfigService,
    ) { 

      this.fuseConfig.setConfig({
        layout: {
          navigation: 'none',
          footer: 'none'
        }
      });
    }
    ngOnInit() {
    }

}
