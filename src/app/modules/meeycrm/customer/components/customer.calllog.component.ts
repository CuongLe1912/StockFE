import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { BaseEntity } from "../../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MCRMCallLogEntity } from "../../../../_core/domains/entities/meeycrm/mcrm.calllog.entity";
import { MCRMCallLogStatusType, MCRMCallLogType } from "../../../../_core/domains/entities/meeycrm/enums/mcrm.calllog.type";

@Component({
    selector: 'mcrm-customer-call-log',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMCallLogComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Size: ModalSizeType.Small,
        Reference: MCRMCallLogEntity,
    };
    @Input() id: number;
    @Input() leadId: number;

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            {
                Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String,
                Format: ((item: MCRMCallLogEntity) => {
                    let text: string = '<p>' + item.Phone + '</p>';
                    if (item.Type != null && item.Type != undefined) {
                        let option = ConstantHelper.ML_CUSTOMER_CALLLOGS_TYPES.find(c => c.value == item.Type);
                        if (option) text += '<p>' + (option && option.label) + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'CallStatus', Title: 'Nội dung', Type: DataType.String,
                Format: ((item: MCRMCallLogEntity) => {
                    let text: string = '';
                    if (item.CallStatus) {
                        let option = ConstantHelper.ML_CUSTOMER_NOTE_CALL_STATUS_TYPES.find(c => c.value == item.CallStatus);
                        if (option) text += '<p>' + (option && option.label) + '</p>';
                    }
                    if (item.Note) {
                        text += '<p>' + 'Ghi chú: ' + item.Note + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'Status', Title: 'Trạng thái', Type: DataType.String, Align: 'center',
                Format: ((item: MCRMCallLogEntity) => {
                    let text: string = '';
                    if (item.Status != null && item.Status != undefined) {
                        if (item.Type == MCRMCallLogType.Outbound) {
                            let option = ConstantHelper.ML_CUSTOMER_CALLLOGS_STATUS_TYPES.find(c => c.value == item.Status);
                            if (option) text += '<p>' + (option && option.label) + '</p>';
                        } else {
                            if (item.Status == MCRMCallLogStatusType.Busy) {
                                text += '<p>Cuộc gọi nhỡ</p>';
                            } else {
                                let option = ConstantHelper.ML_CUSTOMER_CALLLOGS_STATUS_TYPES.find(c => c.value == item.Status);
                                if (option) text += '<p>' + (option && option.label) + '</p>';
                            }
                        }
                        if (item.CallTime) {
                            text += '<p><i class="la la-clock"></i> ' + UtilityExHelper.dateTimeString(item.CallTime) + '</p>';
                        }
                    }
                    return text;
                })
            },
            {
                Property: 'Recordingfile', Title: 'Tải tệp', Type: DataType.String, Align: 'center',
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.Recordingfile) {
                        text += '<div class="d-flex align-items-center">';
                        text += '<a class="btn btn-icon btn-light-primary btn-circle" style="margin-right: 10px" routerLink="quickView" type="audio"><i class="la la-download"></i></a>';
                        text += '<audio controls><source src="' + item.Recordingfile + '" type="audio/ogg"><source src="' + item.Recordingfile + '" type="audio/mpeg"></audio>'
                        text += '</div>';
                    }
                    return text;
                })
            },
            {
                Property: 'User', Title: 'Người thực hiện', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.User) {
                        text += item.User;
                    }
                    if (item.Extension) {
                        text += '<p>Máy lẻ: ' + item.Extension + '</p>';
                    }
                    return text;
                })
            },
        ];
    }

    async ngOnInit() {
        if (this.id) {
            this.obj.Url = '/admin/MCRMCallLog/Items/' + this.id;
        } else if (this.leadId) {
            this.obj.Url = '/admin/MCRMCallLog/LeadItems/' + this.leadId;
        }
        await this.render(this.obj);
    }

    downloadAutio(file: string) {
        window.open(file, "_blank");
    }
    quickView(item: BaseEntity, type: string) {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem) {
            switch (type) {
                case 'audio': this.downloadAutio(originalItem['Recordingfile']); break;
            }
        }
    }
}