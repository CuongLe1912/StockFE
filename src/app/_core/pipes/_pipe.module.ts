import { NgModule } from '@angular/core';
import { FilterPipe } from './filter.pipe';
import { BetweenPipe } from './between.pipe';
import { DatePipe } from '../pipes/date.pipe';
import { CoinPipe } from '../pipes/coin.pipe';
import { NumberPipe } from '../pipes/number.pipe';
import { CoordinatesPipe } from './coordinates.pipe';
import { DateTimePipe } from '../pipes/datetime.pipe';
import { CurrencyPipe } from '../pipes/currency.pipe';
import { SanitizeUrlPipe } from '../pipes/sanitizeurl.pipe';
import { SanitizeHtmlPipe } from '../pipes/sanitizehtml.pipe';
import { DateMinutePipe } from './dateminute.pipe';


@NgModule({
    declarations: [
        CoinPipe,
        DatePipe,
        NumberPipe,
        FilterPipe,
        BetweenPipe,
        DateTimePipe,
        CurrencyPipe,
        DateMinutePipe,
        SanitizeUrlPipe,
        CoordinatesPipe,
        SanitizeHtmlPipe,
    ],
    exports: [
        CoinPipe,
        DatePipe,
        FilterPipe,
        NumberPipe,
        BetweenPipe,
        DateTimePipe,
        CurrencyPipe,
        DateMinutePipe,
        CoordinatesPipe,
        SanitizeUrlPipe,
        SanitizeHtmlPipe
    ]
})
export class PipeModule { }
