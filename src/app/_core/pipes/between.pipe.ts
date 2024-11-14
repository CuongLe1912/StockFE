import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'betweenx',
})
export class BetweenPipe implements PipeTransform {
    transform(value: any): string | null {
        if (!value) value = '';
        try {
            return Array(value) || value.indexOf('-') >= 0
                ? this.updateValueText(value)
                : value;
        } catch {
            return value;
        }
    }

    private formatNumber(value: any) {
        if (typeof value == 'string') {
            let val = (value || 0).toString();
            while (val.indexOf('.') >= 0) val = val.replace('.', '');
            while (val.indexOf(',') >= 0) val = val.replace(',', '.');
            let num = Number(val);
            return num;
        } return value;
    }
    private formatString(value: number) {
        if (value == null || value == undefined)
            return '';
        return value.toLocaleString('vi-VN');
    }
    private updateValueText(value: any) {
        let valueText = '';
        let values = Array.isArray(value)
            ? value as []
            : value.toString().split('-');
        let valueTo = values && values[1],
            valueFrom = values && values[0];
        if (valueFrom && valueTo) {
            valueTo = this.formatNumber(valueTo);
            valueFrom = this.formatNumber(valueFrom);
            valueText += this.formatString(valueFrom);
            valueText += ' - ';
            valueText += this.formatString(valueTo);
        } else if (valueFrom) {
            valueText += 'Trên ';
            valueFrom = this.formatNumber(valueFrom);
            valueText += this.formatString(valueFrom);
        } else if (valueTo) {
            valueText += 'Dưới ';
            valueTo = this.formatNumber(valueTo);
            valueText += this.formatString(valueTo);
        }
        return valueText;
    }
}