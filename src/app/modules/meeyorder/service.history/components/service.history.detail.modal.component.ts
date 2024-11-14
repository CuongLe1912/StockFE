import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'mo-service-history-modal',
    template: `<p>ID Dịch vụ: {{ service.producting?.name }} - {{ service.order_in_processing_id }}</p>
    <mo-service-history-detail-service [serviceId]="service.order_in_processing_id"></mo-service-history-detail-service>
    `,
})
export class MOServiceHistoryDetailModalComponent implements OnInit {
    @Input() params: any;
    @Input() service: any;

    ngOnInit() {
        let service = (this.params && this.params["service"]) || null;
        if (service) {
            this.service = service
        }
    }
    
    async confirm() {
        return true;
    }
}