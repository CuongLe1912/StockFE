import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from '@angular/core';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MLArticleAccessType } from '../../../../_core/domains/entities/meeyland/enums/ml.article.type';
import { MLScheduleArticleEntity } from '../../../../_core/domains/entities/meeyland/ml.schedule.entity';
import { MLScheduleViewArticleMapComponent } from '../schedule.view.article.map/schedule.view.article.map.component';

@Component({
    templateUrl: './schedule.view.article.component.html',
    styleUrls: ['./schedule.view.article.component.scss']
})
export class MLScheduleViewArticleComponent implements OnInit {
    @Input() params: any;
    dialogService: AdminDialogService;
    item: MLScheduleArticleEntity = new MLScheduleArticleEntity();

    constructor() {
        this.dialogService = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        let item = this.params && this.params['item'];
        if (item) {
            this.item = EntityHelper.createEntity(MLScheduleArticleEntity, item);
            this.item.Coordinates = item.Coordinates;
        }
    }

    confirm() {
        this.quickViewArticle(this.item);
        return true;
    }

    quickViewMap() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Xem vị trí tin đăng',
            size: ModalSizeType.ExtraLarge,
            confirmText: 'Xem trên Website',
            objectExtra: { item: this.item },
            object: MLScheduleViewArticleMapComponent,
        });
    }
    
    quickViewArticle(item: MLScheduleArticleEntity) {
        if (item.AccessType == MLArticleAccessType.Publish) {
            let url = UtilityExHelper.buildMeeyLandUrl(item.Path);
            window.open(url, "_blank");
        } else {
            let statusText = '';
            switch (item.AccessType) {
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
}
