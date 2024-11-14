import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { DialogData } from '../../../../_core/domains/data/dialog.data';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { MPOProjectEntity, MPOProjectPaymentProgressEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.entity';
import { MPOArchiveProjectFileComponent } from '../../components/archive.project.files/archive.project.files.component';
import { MPOArchiveProjectImageComponent } from '../../components/archive.project.image/archive.project.image.component';
import { EditComponent } from '../../../../_core/components/edit/edit.component';

@Component({
    selector: 'mpo-project-payment-progress',
    templateUrl: './project.payment.progress.component.html',
    styleUrls: ['./project.payment.progress.component.scss'],
})
export class MPOProjectPaymentProgressComponent extends EditComponent implements OnInit {
    @ViewChild('uploadFiles') uploadFiles: EditorComponent;
    @ViewChild('uploadImages') uploadImages: EditorComponent;
    
    @Input() params: any;    

    id: string;
    viewer: boolean;
    isProduct: boolean;
    item: MPOProjectEntity = new MPOProjectEntity();
    payment: MPOProjectPaymentProgressEntity = new MPOProjectPaymentProgressEntity();

    dialogPopupImageArchive: DialogData;
    dialogPopupFileArchive: DialogData;

    constructor() {
        super();
    }

    async ngOnInit() {
        this.viewer = this.getParam('viewer');
        this.isProduct = this.getParam('isProduct');
        this.item = this.getParam('item');

        if (this.item) {
            this.item.PaymentProgress = EntityHelper.createEntity(MPOProjectPaymentProgressEntity, this.item.PaymentProgress);
            this.payment = this.item.PaymentProgress;
            if (this.item.ProjectMeeyId) {
                this.dialogPopupImageArchive = UtilityExHelper.createDialogDataArchive('Kho ảnh', MPOArchiveProjectImageComponent, { multiple: true, ProjectMeeyId: this.item.ProjectMeeyId });
                this.dialogPopupFileArchive = UtilityExHelper.createDialogDataArchive('Kho tài liệu', MPOArchiveProjectFileComponent, { multiple: true, ProjectMeeyId: this.item.ProjectMeeyId });
            }
        }
    }

    public async valid(): Promise<boolean> {
        if (this.payment) {
            let valid = await validation(this.payment, ['PaymentProgress', 'Images']);
            if (valid) {
                // upload
                if (this.uploadImages) {
                    this.payment.Images = await this.uploadImages.upload();                    
                }
            }
            return valid;
        }
        return false;
    }

    public async validInfo(): Promise<boolean> {
        if (this.payment) {
            let valid = await validation(this.payment, ['PaymentProgress']);
            return valid;
        }
        return false;
    }
}