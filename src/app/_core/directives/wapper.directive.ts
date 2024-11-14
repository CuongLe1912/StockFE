import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[wrapper]'
})
export class WrapperDirective {
    constructor(private el: ElementRef) {
        let interval = setInterval(() => {
            const parentElement = el.nativeElement.parentElement;
            const element = el.nativeElement;
            if (element && parentElement && parentElement.parentNode) {
                parentElement.removeChild(element);
                parentElement.parentNode.insertBefore(element, parentElement.nextSibling);
                parentElement.parentNode.removeChild(parentElement);
                clearInterval(interval);
            }
        }, 10);
    }
}
