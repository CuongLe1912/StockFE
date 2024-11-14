import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberx',
})
export class NumberPipe implements PipeTransform {
    transform(
        value: any,
        digitsInfo: string = '1.0-2',
        locale: string = 'en',
    ): string | null {
        if (!value) value = 0;
        try {
            let number = typeof value === 'number' 
                ? value
                : parseFloat(value);
            return number.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        } catch {
            return value;
        }
    }
}