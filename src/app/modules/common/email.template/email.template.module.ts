import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ProductionType } from "../../../_core/domains/enums/project.type";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { EmailTemplateEntity } from "../../../_core/domains/entities/email.template.entity";
import { EditEmailTemplateComponent } from "./edit.email.template/edit.email.template.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class EmailTemplateComponent extends GridComponent {
    obj: GridData = {
        Checkable: true,
        Size: ModalSizeType.FullScreen,
        Reference: EmailTemplateEntity,
        MoreFeatures: {
            Name: 'Đồng bộ',
            Icon: 'la la-recycle',
            Actions: [
                {
                    toggleCheckbox: true,
                    name: 'Đồng bộ STAG',
                    icon: 'la la-retweet',
                    className: 'btn btn-warning',
                    systemName: ActionType.Empty,
                    click: () => {
                        this.syncItems(ProductionType.Stag);
                    }
                },
                {
                    toggleCheckbox: true,
                    name: 'Đồng bộ PROD',
                    icon: 'la la-retweet',
                    className: 'btn btn-warning',
                    systemName: ActionType.Empty,
                    click: () => {
                        this.syncItems(ProductionType.Production);
                    }
                }
            ]
        }
    };

    constructor() {
        super();
        this.render(this.obj);
    }    

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Tạo mẫu',
            size: ModalSizeType.FullScreen,
            object: EditEmailTemplateComponent,
        }, () => this.loadItems());
    }

    edit(item: EmailTemplateEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            size: ModalSizeType.FullScreen,
            object: EditEmailTemplateComponent,
        }, () => this.loadItems());
    }

    view(item: EmailTemplateEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.FullScreen,
            object: EditEmailTemplateComponent,
            objectExtra: { id: item.Id, viewer: true },
        });
    }
}

@NgModule({
    declarations: [
        EmailTemplateComponent,
        EditEmailTemplateComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: EmailTemplateComponent, pathMatch: 'full', data: { state: 'emailtemplate'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class EmailTemplateModule { }