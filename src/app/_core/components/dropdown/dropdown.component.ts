import { Component, OnInit, Input } from "@angular/core";
import { ActionData } from "../../domains/data/action.data";

@Component({
    selector: 'dropdown',
    styleUrls: ['./dropdown.component.scss'],
    templateUrl: './dropdown.component.html'
})
export class DropdownComponent implements OnInit {
    active: boolean;
    @Input() obj: any;
    @Input() icon: string;
    @Input() text: string;
    @Input() subText: string;
    @Input() cssClass: string;
    @Input() direction: string;
    @Input() items: ActionData[];

    ngOnInit() {
        if (!this.direction) this.direction = 'bottom';
        if (!this.cssClass) this.cssClass = 'btn-default';
    }

    clickItem(item: ActionData) {
        this.active = false;
        if (item.click) {
            if (this.obj) item.click(this.obj);
            else item.click();
        } 
    }
}
