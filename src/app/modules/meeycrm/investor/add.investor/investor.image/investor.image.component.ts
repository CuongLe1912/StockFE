import * as _ from 'lodash';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../../_core/decorators/validator';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { DialogData } from '../../../../../_core/domains/data/dialog.data';
import { EditorComponent } from '../../../../../_core/editor/editor.component';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../../../_core/services/admin.dialog.service';
import { MCRMInvestorEntity, MCRMInvestorImageEntity } from '../../../../../_core/domains/entities/meeycrm/mcrm.investor.entity';

@Component({
    selector: 'mcrm-investor-image',
    templateUrl: './investor.image.component.html',
    styleUrls: [
        './investor.image.component.scss',
        '../../../../../../assets/css/modal.scss'
    ],
})
export class MCRMInvestorImageComponent extends EditComponent implements OnInit {
    @ViewChild('uploadLogoApp') uploadLogoApp: EditorComponent;
    @ViewChild('uploadLogoWeb') uploadLogoWeb: EditorComponent;
    @ViewChild('uploadLogoWebMobile') uploadLogoWebMobile: EditorComponent;
    @ViewChild('uploadBackgroundApp') uploadBackgroundApp: EditorComponent;
    @ViewChild('uploadBackgroundWeb') uploadBackgroundWeb: EditorComponent;
    @ViewChild('uploadBackgroundWebMobile') uploadBackgroundWebMobile: EditorComponent;

    id: string;
    viewer: boolean;
    @Input() params: any;
    validTabs: string[] = [];
    loading: boolean = false;
    item!: MCRMInvestorEntity;
    dialog: AdminDialogService;
    dialogPopupImageArchive: DialogData;
    @ViewChild('uploadImage') uploadImage: EditorComponent;
    image: MCRMInvestorImageEntity = new MCRMInvestorImageEntity();


    constructor() {
        super();
        this.dialog = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        if (this.params && this.params['item'])
            this.item = this.getParam('item');
        this.viewer = this.params && this.params['viewer'];

        if (this.item) {
            this.item.Images = EntityHelper.createEntity(MCRMInvestorImageEntity, this.item.Images);
            this.image = this.item.Images;
        }
    }

    public async valid(): Promise<boolean> {
        let column = ["LogoWeb", "LogoApp", "LogoMobileWeb", "BackgroundWeb", "BackgroundApp", "BackgroundMobileWeb"];
        if (this.image) {
            let valid = await validation(this.image, column)
            if (valid) {
                if (this.uploadLogoApp) {
                    this.image.LogoApp = await this.uploadLogoApp.upload();
                }
                if (this.uploadLogoWeb) {
                    this.image.LogoWeb = await this.uploadLogoWeb.upload();
                }
                if (this.uploadLogoWebMobile) {
                    this.image.LogoMobileWeb = await this.uploadLogoWebMobile.upload();
                }
                if (this.uploadBackgroundApp) {
                    this.image.BackgroundApp = await this.uploadBackgroundApp.upload();
                }
                if (this.uploadBackgroundWeb) {
                    this.image.BackgroundWeb = await this.uploadBackgroundWeb.upload();
                }
                if (this.uploadBackgroundWebMobile) {
                    this.image.BackgroundMobileWeb = await this.uploadBackgroundWebMobile.upload();
                }
            }
            return valid;
        }
    }
}