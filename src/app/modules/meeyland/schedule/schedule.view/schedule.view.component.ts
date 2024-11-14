import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MLScheduleService } from '../schedule.service';
import { Component, Input, OnInit } from '@angular/core';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { MLScheduleLogComponent } from '../schedule.history.log/schedule.history.log.component';
import { MLScheduleEntity } from '../../../../_core/domains/entities/meeyland/ml.schedule.entity';
import { MLScheduleEditCancelComponent } from '../schedule.edit.cancel/schedule.edit.cancel.component';
import { MLScheduleEditStatusComponent } from '../schedule.edit.status/schedule.edit.status.component';
import { MLArticleAccessType } from '../../../../_core/domains/entities/meeyland/enums/ml.article.type';
import { MLScheduleStatusType } from '../../../../_core/domains/entities/meeyland/enums/ml.schedule.type';
import { MLScheduleViewArticleComponent } from '../schedule.view.article/schedule.view.article.component';
import { MLPopupViewUserComponent } from '../../../../modules/meeyuser/popup.view.user/popup.view.user.component';
import { MLScheduleViewArticleMapComponent } from '../schedule.view.article.map/schedule.view.article.map.component';

@Component({
    templateUrl: './schedule.view.component.html',
    styleUrls: ['./schedule.view.component.scss'],
})
export class MLScheduleViewComponent extends EditComponent implements OnInit {
    url: string;
    @Input() params: any;
    loading: boolean = true;
    service: MLScheduleService;
    allowViewScheduleHistory: boolean;
    item: MLScheduleEntity = new MLScheduleEntity();
    ignoreStatus: MLScheduleStatusType[] = [MLScheduleStatusType.Complete, MLScheduleStatusType.Cancel, MLScheduleStatusType.Reject];

    constructor() {
        super();
        this.state = this.getUrlState();
        this.service = AppInjector.get(MLScheduleService);
    }

    async ngOnInit() {
        await this.loadItem();
        this.allowViewScheduleHistory = await this.authen.permissionAllow('MLScheduleHistory', ActionType.View);
    }

    quickViewMap() {
        if (this.item && 
            this.item.ArticleItem && 
            this.item.ArticleItem.Coordinates) {
            this.dialogService.WapperAsync({
                cancelText: 'Đóng',
                title: 'Xem vị trí tin đăng',
                size: ModalSizeType.ExtraLarge,
                confirmText: 'Xem trên Website',
                object: MLScheduleViewArticleMapComponent,
                objectExtra: { item: this.item.ArticleItem },
            });
        } else {
            this.dialogService.Alert('Thông báo', 'Không có dữ liệu tọa độ cho tin này');
        }
    }

    quickViewInfo() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            title: 'Xem thông tin tin đăng',
            confirmText: 'Xem trên Website',
            object: MLScheduleViewArticleComponent,
            objectExtra: { item: this.item.ArticleItem }
        });
    }

    quickViewUser() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            object: MLPopupViewUserComponent,
            title: 'Xem thông tin người dùng',
            objectExtra: { meeyId: this.item.UserArticleId }
        });
    }
    quickViewArticle() {
        if (this.item.ArticleItem.AccessType == MLArticleAccessType.Publish) {
            let url = UtilityExHelper.buildMeeyLandUrl(this.item.ArticleItem.Path);
            window.open(url, "_blank");
        } else {
            let statusText = '';
            switch (this.item.ArticleItem.AccessType) {
                case MLArticleAccessType.Deleted: statusText = 'đã xóa'; break;
                case MLArticleAccessType.UnPublish: statusText = 'đã bị hạ'; break;
                case MLArticleAccessType.Draft: statusText = 'đang chờ duyệt'; break;
                case MLArticleAccessType.WaitPublish: statusText = 'đang chờ đăng'; break;
                case MLArticleAccessType.WaitPayment: statusText = 'đang chờ thanh toán'; break;
            }
            let message = 'Tin đăng ' + statusText + '<br />' + 'Vui lòng kiểm tra lại';
            this.dialogService.Alert('Thông báo', message);
        }
    }
    quickViewUserEmail() {
        let exists = this.item.UserShedulePhone == this.item.UserArticlePhone ||
            this.item.UserSheduleEmail == this.item.UserArticleEmail;
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            object: MLPopupViewUserComponent,
            title: 'Xem thông tin người dùng',
            objectExtra: exists
                ? { meeyId: this.item.UserArticleId }
                : {
                    phone: this.item.UserShedulePhone,
                    email: this.item.UserSheduleEmail,
                }
        });
    }

    edit(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/mlschedule',
            prevData: this.state.prevData,
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
        }, async () => { this.loadItem(); });
    }

    history(item: BaseEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            object: MLScheduleLogComponent,
            title: 'Lịch sử thao tác lịch xem nhà',
        }, async () => { this.loadItem(); });
    }

    updateStatus(item: BaseEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy bỏ',
            confirmText: 'Cập nhật',
            size: ModalSizeType.Medium,
            title: 'Cập nhật trạng thái',
            objectExtra: { id: item.Id },
            object: MLScheduleEditStatusComponent,
        }, async () => { this.loadItem(); });
    }

    updateSupportCount(count: number) {
        if (this.item) this.item.SupportCount = count;
    }

    private async loadItem() {
        let id = this.state && this.state.id;
        if (id) {
            this.item = null;
            await this.service.item('mlschedule', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MLScheduleEntity, result.Object as MLScheduleEntity);
                    this.item.ArticleItem = result.Object.ArticleItem;
                    this.url = UtilityExHelper.buildMeeyLandUrl(this.item.ArticleItem.Path);
                    let breadCrumb = this.breadcrumbs.find(c => c.Name.indexOf(this.item.Code) >= 0);
                    if (!breadCrumb) {
                        this.breadcrumbs.push({
                            Name: 'Mã ' + this.item.Code
                        });
                    }
                    this.renderActions();
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
        this.loading = false;
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
            {
                name: 'Lịch sử',
                icon: 'la la-book',
                systemName: ActionType.View,
                className: 'btn btn-warning',
                click: (() => {
                    this.history(this.item);
                })
            }
        ];
        if (this.item && this.ignoreStatus.indexOf(this.item.Status) == -1) {
            actions.push(ActionData.gotoEdit("Sửa lịch", () => { this.edit(this.item) }));
            actions.push({
                icon: 'la la-toggle-on',
                name: 'Cập nhật trạng thái',
                className: 'btn btn-primary',
                systemName: ActionType.Edit,
                click: () => {
                    this.updateStatus(this.item);
                }
            });
            actions.push({
                name: 'Hủy lịch',
                icon: 'la la-remove',
                className: 'btn btn-danger',
                systemName: ActionType.Cancel,
                click: () => {
                    this.cancel(this.item);
                }
            });
        }
        this.actions = await this.authen.actionsAllow(MLScheduleEntity, actions);
    }
}