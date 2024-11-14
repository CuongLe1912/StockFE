import { MOOrdersService } from "../../orders.service";
import { AppInjector } from "../../../../../app.module";
import { Component, Input, OnInit } from "@angular/core";
import { ResultApi } from "../../../../../_core/domains/data/result.api";
import { OptionItem } from "../../../../../_core/domains/data/option.item";
import { ConstantHelper } from "../../../../../_core/helpers/constant.helper";

@Component({
    selector: 'mo-order-processing-detail',
    templateUrl: './order.processing.detail.component.html',
})
export class OrderProcessingDetailComponent implements OnInit {

    useDate: Date;
    service: MOOrdersService;
    statusUse = '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>'

    @Input() params: any;
    @Input() orderItem: any;
    @Input() orderId: number;
    @Input() providerId: number;


    constructor() {
        this.service = AppInjector.get(MOOrdersService);
    }

    ngOnInit() {
        let orderId = (this.params && this.params["orderId"]) || null;
        this.orderId = this.orderId | orderId
        let providerId = (this.params && this.params["providerId"]) || null;
        if (!this.providerId) this.providerId = providerId

        let orderItem = (this.params && this.params["orderItem"]) || null;
        if (orderItem) this.orderItem = orderItem

        this.loadItems();
    }

    loadItems() {
        this.service.ProcessStatus(this.orderId).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result) && result.Object) {
                let status = result.Object.find(c => c.id == this.orderItem.Id)
                if (status && status.use_status) {
                    let option: OptionItem = ConstantHelper.MO_ORDER_PROCESSING_STATUS_TYPES.find((c) => c.value == status.use_status);
                    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
                    if (status.use_process) text += " " + status.use_process + " " + this.orderItem.Unit
                    this.statusUse = text;
                } else {
                    this.statusUse = '';
                }
            } else {
                this.statusUse = '';
            }
        });
    }

    expireDateChange(time: Date) {
        this.useDate = time;
    }

}
