import { Pipe, PipeTransform } from '@angular/core';
import { UtilityExHelper } from '../helpers/utility.helper';
import { DateTimeFormat } from '../decorators/datetime.decorator';

@Pipe({
    name: 'datetimex'
})
export class DateTimePipe implements PipeTransform {
    transform(value: Date): string {
        return this.dateTimeString(value);
    }

    private dateTimeString(date: Date): string {
        return UtilityExHelper.dateTimeToString(date, DateTimeFormat.DMYHMS);
    }
}