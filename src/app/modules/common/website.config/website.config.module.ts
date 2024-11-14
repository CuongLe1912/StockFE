import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { WebsiteConfigEntity } from "../../../_core/domains/entities/website.config.entity";
import { EditWebsiteConfigComponent } from "./edit.website.config/edit.website.config.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class WebsiteConfigComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Size: ModalSizeType.FullScreen,
        Reference: WebsiteConfigEntity,
        Features: [
            ActionData.addNew(() => this.addNew()),
            ActionData.reload(() => this.loadItems()),
        ]
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            { Property: 'Domain', Title: 'Tên miền', Type: DataType.String },
            { Property: 'CustomerPhone', Title: 'Khách hàng', Type: DataType.String },
            { Property: 'ContactName', Title: 'Tên liên hệ', Type: DataType.String },
            { Property: 'ContactPhone', Title: 'Số điện thoại liên hệ', Type: DataType.String },
        ];
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Tạo cấu hình',
            size: ModalSizeType.ExtraLarge,
            object: EditWebsiteConfigComponent,
        }, () => this.loadItems());
    }

    edit(item: WebsiteConfigEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            object: EditWebsiteConfigComponent,
        }, () => this.loadItems());
    }

    view(item: WebsiteConfigEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.ExtraLarge,
            object: EditWebsiteConfigComponent,
            objectExtra: { id: item.Id, viewer: true },
        });
    }
}

@NgModule({
    declarations: [
        WebsiteConfigComponent,
        EditWebsiteConfigComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: WebsiteConfigComponent, pathMatch: 'full', data: { state: 'websiteconfig' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class WebsiteConfigModule { }