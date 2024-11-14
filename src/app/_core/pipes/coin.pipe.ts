import { formatNumber } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'coinx',
})
export class CoinPipe implements PipeTransform {
    transform(
        value: number,
        digitsInfo: string = '1.0-6',
        locale: string = 'en',
    ): string | null {
        if (!value) value = 0;

        if (value > 1e10) {
            return value.toPrecision(3);
        } else {
            return formatNumber(
                value,
                locale,
                digitsInfo,
            );
        }
    }
}