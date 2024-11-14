import * as _ from 'lodash';
import { RouterModule } from "@angular/router";
import { NgApexchartsModule } from 'ng-apexcharts';
import { Component, NgModule } from "@angular/core";
import { ShareModule } from "../../../modules/share.module";
import { UtilityModule } from "../../../modules/utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MLPartnerEntity } from '../../../_core/domains/entities/meeyland/ml.partner.entity';
import { MLEditPartnerCodeComponent } from './edit.partner.code/edit.partner.code.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLPartnerComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Features: [
            ActionData.addNew(() => { this.addNew(); }),
            ActionData.reload(() => { this.loadItems(); }),
        ],
        MoreActions: [
            {
                icon: 'la la-code',
                name: 'Thêm mã đối tác',
                className: 'btn btn-primary',
                systemName: ActionType.AddNew,
                click: (item: any) => {
                    this.addOrUpdatePartnerCode(item);
                }
            }
        ],
        Title: 'Nguồn giới thiệu',
        PageSizes: [5, 10, 20, 50],
        Reference: MLPartnerEntity,
        SearchText: 'Nhập mã, tên',
        Size: ModalSizeType.Medium,
    };

    constructor() {
        super();
        this.render(this.obj);
    }

    addOrUpdatePartnerCode(item: MLPartnerEntity, id?: number) {
        this.dialogService.WapperAsync({
            objectExtra: 
            {
                id: id,
                partnerId: item.Id
            },
            cancelText: 'Đóng',
            size: ModalSizeType.Small,
            confirmText: 'Lưu thay đổi',
            object: MLEditPartnerCodeComponent,
            title: id ? 'Thêm mã đối tác' : 'Sửa mã đối tác',
        }, async () => {
            this.loadItems();
        });
    }
}

@NgModule({
    declarations: [
        MLPartnerComponent,
        MLEditPartnerCodeComponent
    ],
    imports: [
        ShareModule,
        UtilityModule,
        NgApexchartsModule,
        RouterModule.forChild([
            { path: '', component: MLPartnerComponent, pathMatch: 'full', data: { state: 'ml_partner' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class MLPartnerModule { }