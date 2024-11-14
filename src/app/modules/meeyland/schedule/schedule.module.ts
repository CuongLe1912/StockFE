import * as _ from 'lodash';
import { RouterModule } from "@angular/router";
import { NgApexchartsModule } from 'ng-apexcharts';
import { MLScheduleService } from "./schedule.service";
import { ShareModule } from "../../../modules/share.module";
import { Component, NgModule, OnInit } from "@angular/core";
import { UtilityModule } from "../../../modules/utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { OptionItem } from '../../../_core/domains/data/option.item';
import { ActionType } from "../../../_core/domains/enums/action.type";
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { BaseEntity } from "../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MLScheduleViewComponent } from "./schedule.view/schedule.view.component";
import { MLScheduleEditComponent } from "./schedule.edit/schedule.edit.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { MLScheduleHistoryComponent } from "./schedule.history/schedule.history.component";
import { MLScheduleEntity } from "../../../_core/domains/entities/meeyland/ml.schedule.entity";
import { MLScheduleLogComponent } from "./schedule.history.log/schedule.history.log.component";
import { MLScheduleEditStatusComponent } from "./schedule.edit.status/schedule.edit.status.component";
import { MLScheduleEditCancelComponent } from "./schedule.edit.cancel/schedule.edit.cancel.component";
import { MLScheduleStatusType } from "../../../_core/domains/entities/meeyland/enums/ml.schedule.type";
import { MLScheduleStatisticalComponent } from './schedule.statistical/schedule.statistical.component';
import { MLEditScheduleHistoryComponent } from "./schedule.history/edit/edit.schedule.history.component";
import { MLScheduleViewArticleComponent } from './schedule.view.article/schedule.view.article.component';
import { MLPopupViewUserComponent } from "../../../modules/meeyuser/popup.view.user/popup.view.user.component";
import { MLScheduleEditStatusListComponent } from './schedule.edit.status.list/schedule.edit.status.list.component';
import { MLScheduleViewArticleMapComponent } from './schedule.view.article.map/schedule.view.article.map.component';
import { MLArticleAccessType, MLArticleType } from '../../../_core/domains/entities/meeyland/enums/ml.article.type';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLScheduleComponent extends GridComponent implements OnInit {
    ignoreStatus: MLScheduleStatusType[] = [MLScheduleStatusType.Complete, MLScheduleStatusType.Cancel, MLScheduleStatusType.Reject];
    obj: GridData = {
        UpdatedBy: false,
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [
            ActionData.view((item: any) => { this.view(item) }),
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Edit,
                className: 'btn btn-primary',
                hidden: (item: any) => {
                    return this.ignoreStatus.indexOf(item.StatusCode) >= 0;
                },
                click: (item: any) => {
                    this.edit(item);
                }
            },
        ],
        Features: [
            ActionData.reload(() => { this.loadItems(); })
        ],
        MoreActions: [
            {
                name: 'Lịch sử',
                icon: 'la la-book',
                systemName: ActionType.View,
                className: 'btn btn-warning',
                click: ((item: MLScheduleEntity) => {
                    this.history(item);
                })
            },
            {
                icon: 'la la-toggle-on',
                name: 'Cập nhật trạng thái',
                className: 'btn btn-primary',
                systemName: ActionType.Edit,
                hidden: (item: any) => {
                    return this.ignoreStatus.indexOf(item.StatusCode) >= 0;
                },
                click: ((item: any) => {
                    this.updateStatus(item);
                })
            },
            {
                name: 'Hủy lịch',
                icon: 'la la-remove',
                className: 'btn btn-danger',
                systemName: ActionType.Cancel,
                hidden: (item: any) => {
                    return this.ignoreStatus.indexOf(item.StatusCode) >= 0;
                },
                click: (item: any) => {
                    this.cancel(item);
                }
            },
        ],
        Title: 'Đặt lịch xem nhà',
        PageSizes: [5, 10, 20, 50],
        Reference: MLScheduleEntity,
        Size: ModalSizeType.ExtraLarge,
        StatisticalComponent: MLScheduleStatisticalComponent,
        SearchText: 'Nhập mã, tiêu đề tin, tên, điện thoại, email',
        CustomFilters: ['ScheduleTime', 'CreatedTime', 'Status', 'LookupType', 'SupportCount', 'ArticleType'],
    };

    constructor(public apiService: MLScheduleService) {
        super();
        this.properties = [
            {
                Property: 'MeeyId', Title: 'Id', Type: DataType.String,
                Format: (item: any) => {
                    return UtilityExHelper.renderIdFormat(item.Id, item.MeeyId);
                },
                HideCheckbox: (item: any) => {
                    return this.ignoreStatus.indexOf(item.Status) >= 0;
                },
            },
            {
                Property: 'Code', Title: 'Mã đặt lịch', Type: DataType.String, Align: 'center',
                Format: ((item: any) => {
                    return '<a routerLink="view">' + item.Code + '</a>';
                })
            },
            { Property: 'CreatedTime', Title: 'Thời gian đặt lịch', Type: DataType.DateTime, Align: 'center' },
            { Property: 'ScheduleTime', Title: 'Thời gian xem nhà', Type: DataType.DateTime, Align: 'center' },
            { Property: 'Type', Title: 'Loại xem', Type: DataType.DropDown, Align: 'center' },
            {
                Property: 'Status', Title: 'Trạng thái', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    item['StatusCode'] = item['Status'];
                    let reason = UtilityExHelper.escapeHtml(item.CancelText),
                        reasonTooltip = UtilityExHelper.escapeHtmlTooltip(item.CancelText),
                        option: OptionItem = ConstantHelper.ML_SCHEDULE_STATUS_TYPES.find(c => c.value == item.Status);
                    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + '</p>';
                    if (item.CancelText) text += '<p style="font-size: small;" title="' + reasonTooltip + '"><i>(Lý do: ' + reason + ')</i></p>';
                    return text;
                }
            },
            { Property: 'Notes', Title: 'Ghi chú', Type: DataType.String },
            {
                Property: 'UserSheduleName', Title: 'Người đặt lịch', Type: DataType.String,
                Format: (item: any) => {
                    return UtilityExHelper.renderUserInfoFormat(item.UserSheduleName, item.UserShedulePhone, item.UserSheduleEmail, true, 'email');
                }
            },
            {
                Property: 'UserArticleName', Title: 'Người đăng tin', Type: DataType.String,
                Format: (item: any) => {
                    return UtilityExHelper.renderUserInfoFormat(item.UserArticleName, item.UserArticlePhone, item.UserArticleEmail, true);
                }
            },
            {
                Property: 'ArticleCode', Title: 'Thông tin tin đăng', Type: DataType.String,
                Format: (item: any) => {
                    let code = UtilityExHelper.escapeHtml(item.ArticleCode),
                        title = UtilityExHelper.escapeHtml(item.ArticleTitle),
                        tooltip = UtilityExHelper.escapeHtmlTooltip(item.ArticleTitle),
                        type = item.ArticleType && item.ArticleType == MLArticleType.Self ? 'Tự đăng' : 'Crawl';
                    let text = '<p title="' + tooltip + '"><a routerLink="quickView" type="article">' + title + '</a></p>';
                    if (item.ArticleCode) text += '<p title="' + code + '">Mã tin: <a routerLink="quickView" type="articleInfo">' + code + '</a>';
                    if (item.Coordinates) text += ' - <a routerLink="quickView" type="articleMap" style="color: red; font-weight: bold;"><i class="la la-map-marker"></i></a>';
                    text += '</p>';
                    if (item.ArticleType) text += '<p title="' + type + '">Loại tin: ' + type + '</p>';
                    return text;
                }
            },
            {
                Property: 'SupportCount', Title: 'Số lần hỗ trợ', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    if (item.SupportCount && parseInt(item.SupportCount) > 0) {
                        let count = parseInt(item.SupportCount).toLocaleString("vi-VN", { maximumFractionDigits: 2 });
                        return '<a routerLink="quickView" type="support">' + count + '</a>';
                    } else return '0';
                }
            },
        ];
    }

    async ngOnInit() {
        let allowUpdateStatus = await this.authen.permissionAllow('mlschedule', ActionType.Edit);
        if (allowUpdateStatus) {
            this.obj.Checkable = true;
            this.obj.Features.unshift({
                hide: true,
                icon: 'la la-toggle-on',
                name: 'Cập nhật trạng thái',
                toggleCheckbox: true,
                className: 'btn btn-primary',
                systemName: ActionType.Edit,
                click: (() => {
                    let cloneItems = this.items && this.items.filter(c => c.Checked);
                    if (!cloneItems || cloneItems.length == 0) {
                        this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để cập nhật trạng thái');
                        return;
                    }
                    this.updateStatusMultiple(<any>cloneItems);
                })
            });
        }
        this.render(this.obj);
    }

    view(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/mlschedule',
        };
        this.router.navigate(['/admin/mlschedule/view'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/mlschedule',
        };
        this.router.navigate(['/admin/mlschedule/edit'], { state: { params: JSON.stringify(obj) } });
    }

    cancel(item: BaseEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy bỏ',
            confirmText: 'Đồng ý',
            title: 'Hủy lịch xem nhà',
            size: ModalSizeType.Medium,
            objectExtra: { id: item.Id },
            object: MLScheduleEditCancelComponent,
        }, async () => { this.loadItems(); });
    }

    history(item: BaseEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            object: MLScheduleLogComponent,
            title: 'Lịch sử thao tác lịch xem nhà',
        }, async () => { this.loadItems(); });
    }

    updateStatus(item: BaseEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy bỏ',
            confirmText: 'Cập nhật',
            size: ModalSizeType.Medium,
            title: 'Cập nhật trạng thái',
            objectExtra: { id: item.Id },
            object: MLScheduleEditStatusComponent,
        }, async () => { this.loadItems(); });
    }

    quickView(item: any, type: string) {
        switch (type) {
            case 'articleInfo': this.quickViewInfo(item); break;
            case 'article': this.quickViewArticle(item); break;
            case 'support': this.quickViewSupport(item); break;
            case 'email': this.quickViewUserEmail(item); break;
            case 'articleMap': this.quickViewMap(item); break;
            case 'user': this.quickViewUser(item); break;
            default: this.quickViewUser(item); break;
        }
    }

    updateStatusMultiple(updateItems: any[]) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy bỏ',
            confirmText: 'Cập nhật',
            size: ModalSizeType.Medium,
            title: 'Cập nhật trạng thái',
            object: MLScheduleEditStatusListComponent,
            objectExtra: { items: updateItems.map(c => ({ Id: c.Id, Status: c['StatusCode'] })) },
        }, async () => {
            await this.loadItems();
            this.checkAll = false;
            this.selectedIds = null;
        });
    }

    private quickViewMap(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Xem vị trí tin đăng',
            size: ModalSizeType.ExtraLarge,
            confirmText: 'Xem trên Website',
            objectExtra: { item: item.ArticleItem },
            object: MLScheduleViewArticleMapComponent,
        });
    }
    private quickViewUser(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            object: MLPopupViewUserComponent,
            title: 'Xem thông tin người dùng',
            objectExtra: { meeyId: item.UserArticleId }
        });
    }
    private quickViewInfo(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            title: 'Xem thông tin tin đăng',
            confirmText: 'Xem trên Website',
            object: MLScheduleViewArticleComponent,
            objectExtra: { item: item.ArticleItem }
        });
    }
    private quickViewArticle(item: any) {
        if (item.ArticleItem.AccessType == MLArticleAccessType.Publish) {
            if (item.Path) {
                let url = UtilityExHelper.buildMeeyLandUrl(item.Path);
                window.open(url, "_blank");
            }
        } else {
            let statusText = '';
            switch (item.ArticleItem.AccessType) {
                case MLArticleAccessType.Deleted: statusText = 'đã bị xóa'; break;
                case MLArticleAccessType.UnPublish: statusText = 'đã hết hạn'; break;
                case MLArticleAccessType.Draft: statusText = 'đang chờ duyệt'; break;
                case MLArticleAccessType.WaitPayment: statusText = 'đang chờ thanh toán'; break;
                case MLArticleAccessType.WaitPublish: statusText = 'đang chờ đăng hoặc chờ duyệt'; break;
            }
            let message = 'Tin đăng ' + statusText + '. ' + 'Vui lòng kiểm tra lại!';
            this.dialogService.Alert('Thông báo', message);
        }
    }
    private quickViewSupport(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Xem lịch sử hỗ trợ',
            size: ModalSizeType.ExtraLarge,
            object: MLScheduleHistoryComponent,
            objectExtra: {
                id: item.Id,
                popup: true,
            }
        });
    }
    private quickViewUserEmail(item: any) {
        let exists = item.UserShedulePhone == item.UserArticlePhone ||
            item.UserSheduleEmail == item.UserArticleEmail;
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            object: MLPopupViewUserComponent,
            title: 'Xem thông tin người dùng',
            objectExtra: exists
                ? { meeyId: item.UserArticleId }
                : {
                    phone: item.UserShedulePhone,
                    email: item.UserSheduleEmail,
                }
        });
    }
}

@NgModule({
    declarations: [
        MLScheduleComponent,
        MLScheduleLogComponent,
        MLScheduleEditComponent,
        MLScheduleViewComponent,
        MLScheduleHistoryComponent,
        MLScheduleEditStatusComponent,
        MLScheduleEditCancelComponent,
        MLEditScheduleHistoryComponent,
        MLScheduleStatisticalComponent,
        MLScheduleEditStatusListComponent,
    ],
    imports: [
        ShareModule,
        UtilityModule,
        NgApexchartsModule,
        RouterModule.forChild([
            { path: '', component: MLScheduleComponent, pathMatch: 'full', data: { state: 'ml_schedule' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: MLScheduleViewComponent, pathMatch: 'full', data: { state: 'ml_schedule_view' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: MLScheduleEditComponent, pathMatch: 'full', data: { state: 'ml_schedule_edit' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [MLScheduleService]
})
export class MLScheduleModule { }