import * as _ from 'lodash';
import { MSSeoService } from '../seo.service';
import { AppInjector } from '../../../app.module';
import { Component, OnInit, ViewChild } from "@angular/core";
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { EditorComponent } from '../../../_core/editor/editor.component';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { MSSeoEntity } from '../../../_core/domains/entities/meeyseo/ms.seo.entity';
import { MSConfirmImportTagComponent } from '../components/confirm.import.tag/confirm.import.tag.component';

@Component({
    templateUrl: './import.tag.component.html',
    styleUrls: [
        './import.tag.component.scss',
        '../../../../assets/css/modal.scss'
    ],
})
export class ImportTagComponent extends EditComponent implements OnInit {
    @ViewChild('importManual') importManual: EditorComponent;
    @ViewChild('importAuto') importAuto: EditorComponent;

    loading: boolean;
    isActive: boolean = true;
    isImport: boolean;
    isDownload: boolean;
    service: MSSeoService;
    dialog: AdminDialogService;
    item: MSSeoEntity = new MSSeoEntity();

    constructor() {
        super();
        this.service = AppInjector.get(MSSeoService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    async ngOnInit(): Promise<void> {

    }

    public async confirm(complete: () => void): Promise<boolean> {
        this.processing = true;
        let manual = await this.importManual.upload();
        let jsonDataManual = manual && manual.length > 0 ? manual[0].Path : null;
        if (jsonDataManual) {
            ToastrHelper.Success('Tải lên tệp: ' + manual[0].Name + ' thành công');
            if (complete) complete();
            this.processing = false;

            // close and open other popup
            this.dialog.HideAllDialog();
            setTimeout(() => {
                let obj = JSON.parse(jsonDataManual);
                this.dialog.WapperAsync({
                    cancelText: 'Hủy',
                    objectExtra: {
                        type: obj?.type,
                        items: obj?.data,
                        valid: obj?.valid,
                        error: obj?.error,
                    },
                    confirmText: 'Import',
                    title: 'Xác nhận import',
                    size: ModalSizeType.ExtraLarge,
                    object: MSConfirmImportTagComponent,
                });
            }, 300);
            return true;
        } else {
            let auto = await this.importAuto.upload();
            let obj = auto && auto.length > 0 ? auto[0].ResultUpload : null;
            if (obj && obj.data) {
                if (complete) complete();
                this.processing = false;

                // close and open other popup
                this.dialog.HideAllDialog();
                setTimeout(() => {
                    this.dialog.WapperAsync({
                        cancelText: 'Hủy',
                        objectExtra: {
                            type: 1,
                            items: obj?.data,
                            fileId: obj?.fileId,
                            valid: obj?.totalValid,
                            error: obj?.totalError,
                        },
                        confirmText: 'Import',
                        title: 'Xác nhận import',
                        size: ModalSizeType.ExtraLarge,
                        object: MSConfirmImportTagComponent,
                    });
                }, 300);
            } else {
                ToastrHelper.Error('Import tệp: ' + auto[0].Name + ' không thành công');
                this.processing = false;
                return false;
            }
        }
        return false;
    }

    changeView(view: number) {
        if (view == 1) {
            this.isDownload = true;
            this.isActive = false;
            this.isImport = false;
        } else if (view == 2) {
            this.isDownload = false;
            this.isActive = false;
            this.isImport = true;
        } else {
            this.isDownload = false;
            this.isActive = true;
            this.isImport = false;
            this.item = EntityHelper.createEntity(MSSeoEntity);
        }
    }
}