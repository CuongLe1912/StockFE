import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { EmailTemplateWrapperEntity } from '../../../_core/domains/entities/email.template.wrapper.entity';
import { EditEmailTemplateWrapperComponent } from './edit.email.template.wrapper/edit.email.template.wrapper.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class EmailTemplateWrapperComponent extends GridComponent {
    obj: GridData = {
        Size: ModalSizeType.ExtraLarge,
        Reference: EmailTemplateWrapperEntity,
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
            size: ModalSizeType.ExtraLarge,
            object: EditEmailTemplateWrapperComponent,
        });
    }

    edit(item: EmailTemplateWrapperEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            object: EditEmailTemplateWrapperComponent,
        });
    }
}

@NgModule({
    declarations: [
        EmailTemplateWrapperComponent,
        EditEmailTemplateWrapperComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: EmailTemplateWrapperComponent, pathMatch: 'full', data: { state: 'emailtemplatewrapper' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class EmailTemplateWrapperModule { }