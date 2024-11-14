import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
    selector: '[scrollTracker]'
})
export class ScrollTrackerDirective {
    emitted = false;
    @Output() scrollingFinished = new EventEmitter<void>();

    @HostListener('scroll', ['$event'])
    onScroll(event: any): void {
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight && !this.emitted) {
            this.emitted = true;
            this.scrollingFinished.emit();
        } else if (event.target.offsetHeight + event.target.scrollTop < event.target.scrollHeight) {
            this.emitted = false;
        }
    }
}