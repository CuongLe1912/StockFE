import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'datex'
})

export class DatePipe implements PipeTransform {
    transform(value: Date): string {
        return this.dateString(value);
    }

    private dateString(date: Date): string {
        if (!date) return '';
        if (date == null) return '';
        if (typeof date == 'string')
            date = new Date(date);

        if (date.getFullYear() == 0) return '';
        if (date.getFullYear() == 1) return '';
        let message = '';
        let month = date.getMonth() + 1;
        message += (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
        message += '/' + (month < 10 ? '0' + month : month);
        message += '/' + date.getFullYear();
        return message;
    }
}