import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';

@Pipe({
    pure: false,
    name: 'currencyx',
})
export class CurrencyPipe implements PipeTransform {

    constructor() {
    }

    transform(value: number): string | null {
        if (!value) value = 0;
        return value.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
    }
}