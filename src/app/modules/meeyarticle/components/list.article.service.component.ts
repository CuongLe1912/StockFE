import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from '../../../_core/helpers/app.config';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { MLArticleEntity, MLArticleOrderInfoEntity } from '../../../_core/domains/entities/meeyland/ml.article.entity';

@Component({
    selector: 'ml-list-article-service',
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLListArticleServiceComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        HidePaging: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Size: ModalSizeType.ExtraLarge,
        Reference: MLArticleOrderInfoEntity,
    };
    @Input() params: any;
    @Input() items: MLArticleOrderInfoEntity[];

    constructor() {
        super();
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, Align: 'center', ColumnWidth: 80 },
            {
                Property: 'Code', Title: 'Mã đơn hàng', Type: DataType.String, Align: 'center',
                Click: (item: any) => {
                    this.viewService(item.Id);
                }
            },
            { Property: 'Status', Title: 'Trạng thái', Type: DataType.String }
        ];
    }

    async ngOnInit() {
        this.loading = true;
        if (this.items && this.items.length > 0) {
            this.items.forEach((item: MLArticleOrderInfoEntity, i: number) => {
                item.Index = i + 1;
            });
        } else {
            let id = this.params && this.params['id'];
            if (id) {
                await this.service.item('mlarticle', id).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        let item: MLArticleEntity = result.Object;
                        this.items = item && item.OrderInfos;
                        if (this.items && this.items.length > 0) {
                            this.items.forEach((item: MLArticleOrderInfoEntity, i: number) => {
                                item.Index = i + 1;
                            });
                        }
                    }
                });
            }
        }
        this.render(this.obj, this.items || []);
        this.loading = false;
    }

    viewService(id: string) {
        if (id) {
            let obj: NavigationStateData = {
                prevUrl: '/admin/moorders',
            };
            let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/moorders/view-detail?id=' + id;
            this.setUrlState(obj, 'moorders');
            window.open(url, "_blank");
        } else this.dialogService.Alert('Thông báo', 'Mã dịch vụ không tồn tại, vui lòng thử lại sau');
    }

    private setUrlState(state: NavigationStateData, controller: string = null) {
        if (!controller) controller = this.getController();
        let stateKey = 'params',
            navigation = this.router.getCurrentNavigation(),
            sessionKey = 'session_' + stateKey + '_' + controller;
        if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state));
    }
}