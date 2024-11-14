import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { DialogData } from '../../../../_core/domains/data/dialog.data';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { MPOProjectEntity, MPOProjectUtilitiesEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.entity';
import { MPOArchiveProjectFileComponent } from '../../components/archive.project.files/archive.project.files.component';
import { MPOArchiveProjectImageComponent } from '../../components/archive.project.image/archive.project.image.component';
import { EditComponent } from '../../../../_core/components/edit/edit.component';

@Component({
    selector: 'mpo-project-utilities',
    templateUrl: './project.utilities.component.html',
    styleUrls: ['./project.utilities.component.scss'],
})
export class MPOProjectUtilitiesComponent extends EditComponent implements OnInit {
    @ViewChild('uploadBasicImages') uploadBasicImages: EditorComponent;
    @ViewChild('uploadOutstandingImages') uploadOutstandingImages: EditorComponent;
    @Input() params: any;

    id: string;
    type: string;
    viewer: boolean;
    isProduct: boolean;
    item: MPOProjectEntity = new MPOProjectEntity();
    utilities: MPOProjectUtilitiesEntity = new MPOProjectUtilitiesEntity();
    utilitiesTab: string;
    validTabs = [];

    dialogPopupImageArchive: DialogData;
    dialogPopupFileArchive: DialogData;

    constructor() {
        super();
    }

    async ngOnInit() {
        this.utilitiesTab = this.getParam('utilitiesTab') || 'basic';
        this.viewer = this.getParam('viewer');
        this.item = this.getParam('item');
        this.isProduct = this.getParam('isProduct');

        if (this.item) {
            this.item.UtilitiesTab = EntityHelper.createEntity(MPOProjectUtilitiesEntity, this.item.UtilitiesTab);
            this.utilities = this.item.UtilitiesTab;
            if (this.item.ProjectMeeyId) {
                this.dialogPopupImageArchive = UtilityExHelper.createDialogDataArchive('Kho ảnh', MPOArchiveProjectImageComponent, { multiple: true, ProjectMeeyId: this.item.ProjectMeeyId });
                this.dialogPopupFileArchive = UtilityExHelper.createDialogDataArchive('Kho tài liệu', MPOArchiveProjectFileComponent, { multiple: true, ProjectMeeyId: this.item.ProjectMeeyId });
            }
        }
    }

    public async valid(): Promise<boolean> {
        this.validTabs = [];
        let valid = await validation(this.utilities, ['BasicUtilities', 'BasicDescription', 'BasicImages']);
        if (valid) {
            if (this.uploadBasicImages) {
                this.utilities.BasicImages = await this.uploadBasicImages.upload();
            }
        } else {
            this.validTabs.push('basic');
            this.utilitiesTab = this.validTabs[0];
        }
        return valid;
    }

    public async validInfo(): Promise<boolean> {
        let valid = await validation(this.utilities, ['BasicDescription']);
        return valid;
    }

    selectedUtilitiesTab(tab: string) {
        this.utilitiesTab = tab;
    }
}