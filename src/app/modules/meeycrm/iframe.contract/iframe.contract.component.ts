import { Component } from "@angular/core";
import { AppConfig } from "../../../_core/helpers/app.config";
import { GridData } from "../../../_core/domains/data/grid.data";
import { PipeType } from "../../../_core/domains/enums/pipe.type";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { ActionType, ControllerType } from "../../../_core/domains/enums/action.type";
import { MCRMHistoryIframeComponent } from "./components/grid.history.iframe.contract";
import { ModalViewProfileComponent } from "../../../_core/modal/view.profile/view.profile.component";
import { MCRMIframeContractEntity } from "../../../_core/domains/entities/meeycrm/mcrm.ifame.contract.entity";
import { MCRMAddIframeContractComponent } from "./components/add.iframe.contract/add.iframe.contract.component";

@Component({
    templateUrl: "../../../_core/components/grid/grid.component.html",
})
export class MCRMIframeContractComponent extends GridComponent {
    obj: GridData = {
        Reference: MCRMIframeContractEntity,
        Size: ModalSizeType.Large,
        UpdatedBy: false,
        Imports: [],
        Exports: [],
        Filters: [],
        Features: [
            ActionData.addNew(() => {
                this.addNew();
            }),
            ActionData.reload(() => {
                this.loadItems();
            }),
        ],
        Actions: [
            {
                icon: "la la-eye",
                name: ActionType.View,
                className: "btn btn-warning",
                systemName: ActionType.ViewDetail,
                hidden: (item: any) => {
                    return !item[ActionType.ViewDetail];
                },
                click: (item: any) => this.view(item),
            },
            {
                icon: "la la-pencil",
                name: ActionType.Edit,
                className: "btn btn-success",
                systemName: ActionType.Edit,
                hidden: (item: any) => {
                    return !(!item.IsExpireDate && item[ActionType.Edit]);
                },
                click: (item: any) => this.edit(item),
            },
            {
                icon: "la la-history",
                name: "Lịch sử hợp đồng",
                className: "btn btn-info",
                systemName: ActionType.History,
                hidden: (item: any) => {
                    return !item[ActionType.History];
                },
                click: (item: any) => this.history(item),
            },
        ],
        MoreActions: [
            {
                icon: "la la-trash",
                name: ActionType.Delete,
                className: "btn btn-danger",
                systemName: ActionType.Delete,
                hidden: (item: any) => {
                    return !item[ActionType.Delete];
                },
                click: (item: any) => {
                    this.trash(item);
                },
            },
        ],
        DisableAutoLoad: true,
    };
    allowViewDetail: boolean;

    constructor() {
        super();
    }

    async ngOnInit() {
        this.allowViewDetail = await this.authen.permissionAllow(
            ControllerType.MCRMCustomer,
            ActionType.ViewDetail
        );
        this.properties = [
            {
                Property: "ContractName",
                Title: "Mã hợp đồng",
                Type: DataType.String,
                Format: (item) => {
                    let text = "";
                    if (item.ContractName)
                        text += '<p><a href="' + item.Attachments + '" type="link" target="blank">' + UtilityExHelper.escapeHtml(item.ContractName) + "</a></p>";
                    return text;
                },
            },
            {
                Property: "Company",
                Title: "Tên Sàn/Công ty",
                Type: DataType.String,
                Format: (item) => {
                    let text = "";
                    if (item.CompanyName) text += "<p>" + item.CompanyName + "</p>";
                    if (item.Domain)
                        text += '<p><a href="' + item.Domain + '" type="link" target="blank">' + UtilityExHelper.escapeHtml(item.Domain) + "</a></p>";
                    if (item.IframeRefCode)
                        text += '<p>Mã Affiliate: ' + item.IframeRefCode + "</p>";
                    return text;
                },
            },
            {
                Property: "StartDate",
                Title: "Ngày bắt đầu",
                Type: DataType.DateTime,
                PipeType: PipeType.Date,
            },
            {
                Property: "ExpireDate",
                Title: "Ngày hết hạn",
                Type: DataType.DateTime,
                PipeType: PipeType.Date,
            },
            {
                Property: "RenewalDate",
                Title: "Thời gian gia hạn",
                Type: DataType.DateTime,
                PipeType: PipeType.Date,
            },
            {
                Property: "Sale",
                Title: "Phụ trách",
                Type: DataType.String,
                DisableOrder: true,
                Format: (item: any) => {
                    // let text: string = "";
                    let text = "",
                        allow = item[ActionType.ViewDetail] && this.allowViewDetail;
                    if (item.SaleEmail && item.SaleType == 1) {
                        text += '<p><a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(item.SaleEmail) + "</a></p>";
                    } else if (item.PartnerName && item.SaleType == 2) {
                        text += '<p><a routerLink="quickView" type="partner">' + item.PartnerName + ' - ' + item.Phone + '</a></p>';
                    }
                    return text;
                },
            },
            { Property: "Status", Title: "Trạng thái", Type: DataType.String },
            {
                Title: "Mã đối tác",
                Property: "IframeCode",
                Type: DataType.String,
            },
            {
                Property: "Created",
                Title: "Người thực hiện",
                Type: DataType.String,
                Format: (item: any) => {
                    let text: string = "";
                    if (item.CreatedBy)
                        text += '<p><a routerLink="quickView" type="createby">' + UtilityExHelper.escapeHtml(item.CreatedBy) + "</a></p>";
                    return text;
                },
            },
        ];
        this.render(this.obj);
    }
    addNew() {
        this.dialogService.WapperAsync(
            {
                cancelText: "Hủy",
                confirmText: "Lưu",
                size: ModalSizeType.Large,
                objectExtra: {},
                title: "Thêm mới hợp đồng Iframe",
                object: MCRMAddIframeContractComponent,
            },
            () => this.loadItems()
        );
    }

    edit(item) {
        this.dialogService.WapperAsync(
            {
                cancelText: "Hủy",
                confirmText: "Lưu",
                size: ModalSizeType.Large,
                objectExtra: {
                    id: item.Id,
                },
                title: "Chỉnh sửa hợp đồng Iframe",
                object: MCRMAddIframeContractComponent,
            },
            () => this.loadItems()
        );
    }

    view(item) {
        this.dialogService.WapperAsync({
            cancelText: "Hủy",
            size: ModalSizeType.Large,
            objectExtra: {
                id: item.Id,
                viewer: true,
            },
            title: "Chi tiết hợp đồng Iframe",
            object: MCRMAddIframeContractComponent,
        });
    }

    history(item) {
        this.dialogService.WapperAsync({
            cancelText: "Đóng",
            size: ModalSizeType.Large,
            objectExtra: {
                id: item.Id,
            },
            title: "Lịch sử hợp đồng Iframe",
            object: MCRMHistoryIframeComponent,
        });
    }

    quickView(item, type: string) {
        if (type) {
            if (type == "view") this.view(item);
            if (type == "sale") this.quickViewProfile(item.SaleId);
            if (type == "createby") this.quickViewProfile(item.CreatedById);
            if (type == "partner") {
                let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/meeycrm/customer/view?meeyId=' + item['PartnerMeeyId'];
                window.open(url, "_blank");
            }
        }
    }

    public quickViewProfile(id: number) {
        this.dialogService.WapperAsync({
            cancelText: "Đóng",
            objectExtra: { id: id },
            size: ModalSizeType.Large,
            title: "Thông tin tài khoản",
            object: ModalViewProfileComponent,
        });
    }
}
