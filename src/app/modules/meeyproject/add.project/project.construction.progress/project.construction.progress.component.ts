import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { MPOProjectConstructionProgressEntity, MPOProjectEntity, MPOProjectItemEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.entity';
import { DialogData } from '../../../../_core/domains/data/dialog.data';
import { MPOArchiveProjectImageComponent } from '../../components/archive.project.image/archive.project.image.component';
import { MPOArchiveProjectFileComponent } from '../../components/archive.project.files/archive.project.files.component';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { EditComponent } from '../../../../_core/components/edit/edit.component';

@Component({
    selector: 'mpo-project-construction-progress',
    templateUrl: './project.construction.progress.component.html',
    styleUrls: ['./project.construction.progress.component.scss'],
})
export class MPOProjectConstructionComponent extends EditComponent implements OnInit {
    @ViewChild('uploadFiles') uploadFiles: EditorComponent;
    @ViewChild('uploadImages') uploadImages: EditorComponent;

    @Input() params: any;

    id: string;
    viewer: boolean;
    isProduct: boolean;
    item: MPOProjectEntity = new MPOProjectEntity();
    construction: MPOProjectConstructionProgressEntity = new MPOProjectConstructionProgressEntity();

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
            this.item.ConstructionProgress = EntityHelper.createEntity(MPOProjectConstructionProgressEntity, this.item.ConstructionProgress);
            this.construction = this.item.ConstructionProgress;
            if (this.item.ProjectMeeyId) {
                this.dialogPopupImageArchive = UtilityExHelper.createDialogDataArchive('Kho ảnh', MPOArchiveProjectImageComponent, { multiple: true, ProjectMeeyId: this.item.ProjectMeeyId });
                this.dialogPopupFileArchive = UtilityExHelper.createDialogDataArchive('Kho tài liệu', MPOArchiveProjectFileComponent, { multiple: true, ProjectMeeyId: this.item.ProjectMeeyId });
            }
        }
    }

    public async valid(): Promise<boolean> {
        if (this.construction) {
            let valid = await validation(this.construction, ['Description', 'Images', 'Description']);
            if (valid) {
                // upload
                if (this.uploadImages) {
                    this.construction.Images = await this.uploadImages.upload();
                }
            }
            return valid;
        }
        return false;
    }

    public async validInfo(): Promise<boolean> {
        if (this.construction) {
            let valid = await validation(this.construction, ['Description']);
            return valid;
        }
        return false;
    }
}