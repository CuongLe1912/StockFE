import * as _ from 'lodash';
import { Router } from "@angular/router";
import { MLArticleService } from "../article.service";
import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { OrderType } from '../../../_core/domains/enums/order.type';
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { BaseEntity } from "../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MLPopupViewUserComponent } from "../../meeyuser/popup.view.user/popup.view.user.component";
import { MLArticleReportEntity } from "../../../_core/domains/entities/meeyland/ml.article.entity";
import { MLArticleStatusType } from "../../../_core/domains/entities/meeyland/enums/ml.article.type";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLArticleReportLiteComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Actions: [],
        Exports: [],
        Imports: [],
        Filters: [],
        IsPopup: true,
        UpdatedBy: false,
        HidePaging: true,
        HideSearch: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        DisableAutoLoad: true,
        HideCustomFilter: true,
        HideSkeletonLoading: true,
        Size: ModalSizeType.Large,
        Reference: MLArticleReportEntity,
    };

    constructor(
        public router: Router,
        public apiService: MLArticleService) {
        super();
    }

    async ngOnInit() {
        // columns
        this.properties = [
            { Property: 'Description', Title: 'Nội dung báo cáo', Type: DataType.String, Order: OrderType.None },
            { Property: 'CreatedDate', Title: 'Ngày báo cáo', Type: DataType.DateTime, Order: OrderType.None },
            {
                Property: 'Name', Title: 'Người báo cáo', Type: DataType.String, Order: OrderType.None,
                Format: ((item: any) => {
                    let text = UtilityExHelper.renderUserInfoFormat(item.Name, item.Phone, item.Email, true, 'creator');
                    return text;
                })
            },
            {
                Property: 'Status', Title: 'Trạng thái', Type: DataType.String, Order: OrderType.None,
                Format: (item: any) => {
                    let text = '',
                        reportStatus = item.Status;
                    switch (reportStatus) {
                        case 0: {
                            if (item.StatusType == MLArticleStatusType.Down)
                                text += '<p><span>TT báo cáo: </span><span>Đã hạ tin</span></p>';
                            else
                                text += '<p><span>TT báo cáo: </span><span>Chưa xử lý</span></p>';
                        } break;
                        case 1: {
                            text += '<p><span>TT báo cáo: </span><span>Đã xử lý</span></p>';
                        } break;
                    }
                    return text;
                }
            },
            { Property: 'Reason', Title: 'Lý do', Type: DataType.String, Order: OrderType.None },
            { Property: 'Actor', Title: 'Nhân viên xử lý', Type: DataType.String, Order: OrderType.None },
        ];

        // render
        this.setPageSize(20);
        let id = this.params && this.params['id'];
        if (id) {
            this.obj.Url = '/admin/MLArticleReport/Items/' + id;
            this.render(this.obj);
        }
    }

    quickView(item: BaseEntity, type: string) {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem) {
            switch (type) {
                case 'creator': this.quickViewUser(originalItem); break;
            }
        }
    }


    private quickViewUser(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            object: MLPopupViewUserComponent,
            title: 'Xem thông tin người dùng',
            objectExtra: { 
                email: item.Email,
                phone: item.Phone,
            }
        });
    }
}