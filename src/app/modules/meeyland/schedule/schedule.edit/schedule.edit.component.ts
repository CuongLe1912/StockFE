import * as _ from 'lodash';
import * as moment from 'moment';
import { AppInjector } from '../../../../app.module';
import { MLScheduleService } from '../schedule.service';
import { Component, Input, OnInit } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { MLScheduleLogComponent } from '../schedule.history.log/schedule.history.log.component';
import { MLScheduleEntity } from '../../../../_core/domains/entities/meeyland/ml.schedule.entity';
import { MLScheduleEditCancelComponent } from '../schedule.edit.cancel/schedule.edit.cancel.component';
import { MLScheduleEditStatusComponent } from '../schedule.edit.status/schedule.edit.status.component';
import { MLArticleAccessType } from '../../../../_core/domains/entities/meeyland/enums/ml.article.type';
import { MLScheduleViewArticleComponent } from '../schedule.view.article/schedule.view.article.component';
import { MLScheduleViewArticleMapComponent } from '../schedule.view.article.map/schedule.view.article.map.component';
import { MLScheduleStatusType, MLScheduleType } from '../../../../_core/domains/entities/meeyland/enums/ml.schedule.type';

@Component({
    templateUrl: './schedule.edit.component.html',
    styleUrls: ['./schedule.edit.component.scss'],
})
export class MLScheduleEditComponent extends EditComponent implements OnInit {
    url: string;
    readonlyType: boolean;
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
        this.readonlyType = this.item.Status != MLScheduleStatusType.Request;
        this.allowViewScheduleHistory = await this.authen.permissionAllow('MLScheduleHistory', ActionType.View);
    }
    public async confirm(): Promise<boolean> {
        if (this.item) {
            this.processing = true;
            if (await validation(this.item, ['Type', 'Notes', 'ScheduleLookupDate', 'ScheduleLookupTime', 'UserSheduleName', 'UserShedulePhone', 'UserSheduleEmail', 'UserArticleName', 'UserArticlePhone', 'UserArticleEmail'])) {
                this.item.Ip = this.data.countryIp && this.data.countryIp.Ip;
                return await this.service.update(this.item).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Chỉnh sửa thông tin lịch xem nhà thành công');
                        this.back();
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    return false;
                });
            } else this.processing = false;
        }
        return false;
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
                    if (this.item.ScheduleTime) {
                        this.item.ScheduleLookupTimeText = moment(this.item.ScheduleTime).format('hh:mm');
                        this.item.ScheduleLookupDateText = moment(this.item.ScheduleTime).format('DD/MM/YYYY');
                    }
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
            actions.push(ActionData.saveUpdate('Lưu thay đổi', () => { this.confirm() }));
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