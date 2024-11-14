import { NgModule } from '@angular/core';
import { HoverDirective } from './hover.directive';
import { CtrlClickDirective } from './ctrl.click.directive';
import { WrapperDirective } from '../directives/wapper.directive';
import { ClickOutsideDirective } from './click.outside.directive';
import { ScrollTrackerDirective } from './scroll.tracker.directive';


@NgModule({
    declarations: [
        HoverDirective,
        WrapperDirective,
        CtrlClickDirective,
        ClickOutsideDirective,
        ScrollTrackerDirective,
    ],
    exports: [
        HoverDirective,
        WrapperDirective,
        CtrlClickDirective,
        ClickOutsideDirective,
        ScrollTrackerDirective,
    ]
})
export class DirectiveModule { }
