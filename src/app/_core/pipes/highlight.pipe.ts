import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

    transform(value: string, args: string): any {
        if (args && value) {
            let valueString = value.toString(),
                startIndex = valueString.toLowerCase().indexOf(args.toLowerCase());
            if (startIndex != -1) {
                let endLength = args.length,
                    matchingString = valueString.substr(startIndex, endLength);
                return valueString.replace(matchingString, "<mark>" + matchingString + "</mark>");
            }
        }
        return value;
    }
}