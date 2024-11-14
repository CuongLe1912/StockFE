import { Component, Input, OnInit } from '@angular/core';

@Component({
    templateUrl: './history.customer.component.html',
    styleUrls: ['./history.customer.component.scss']
})
export class MCRMHistoryCustomerComponent implements OnInit {
    id: number;
    meeyId: string;
    @Input() params: any;

    constructor() { }

    ngOnInit() {
        this.id = this.params && this.params['id'];
        this.meeyId = this.params && this.params['meeyId'];
    }
}
