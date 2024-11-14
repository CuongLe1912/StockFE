import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[hover]'
})
export class HoverDirective {

    constructor(public elementRef: ElementRef) { }
    @Input('hover') hoverClass: any;
    @HostListener('mouseenter') onMouseEnter() {
        this.elementRef.nativeElement.classList.add(this.hoverClass);
    }
    @HostListener('mouseleave') onMouseLeave() {
        this.elementRef.nativeElement.classList.remove(this.hoverClass);
    }

}
