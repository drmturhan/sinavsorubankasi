import { PipeTransform, Pipe } from '@angular/core';


@Pipe({
    name: 'ozet'
})
export class OzetPipe implements PipeTransform {


    transform(value: string, ...args: number[]) {
        if (!value) { return null; }
        let ozetUzunlugu: number;
        if (!args || args.length === 0) {
            ozetUzunlugu = 20;
        } else {
            ozetUzunlugu = +args[0];
        }
        if (value.length <= ozetUzunlugu) {
            return value;
        }
        const ozetKisim = value.substr(0, ozetUzunlugu - 3) + '...';
        return ozetKisim;
    }
}
