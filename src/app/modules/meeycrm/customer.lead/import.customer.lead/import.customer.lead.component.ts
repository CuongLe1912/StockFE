import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { Component, OnInit, ViewChild } from "@angular/core";
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MCRMCustomerLeadEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.lead.entity';
import { MCRMConfirmImportCustomerLeadComponent } from '../confirm.import.customer.lead/confirm.import.customer.lead.component';


@Component({
    templateUrl: './import.customer.lead.component.html',
    styleUrls: [
        './import.customer.lead.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class MCRMImportCustomerLeadComponent extends EditComponent implements OnInit {
    @ViewChild('importLead') importLead: EditorComponent;

    loading: boolean;
    isActive: boolean = true;
    isImport: boolean;
    isDownload: boolean;
    service: MeeyCrmService;
    dialog: AdminDialogService;
    item: MCRMCustomerLeadEntity = new MCRMCustomerLeadEntity();

    constructor() {
        super();
        this.service = AppInjector.get(MeeyCrmService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    async ngOnInit(): Promise<void> {

    }

    public async confirm(complete: () => void): Promise<boolean> {
        this.processing = true;
        let dataImport = await this.importLead.upload();
        let jsonData = dataImport && dataImport.length > 0 ? dataImport[0].Path : null;
        if (jsonData) {
            //ToastrHelper.Success('Tải lên tệp: ' + dataImport[0].Name + ' thành công');
            if (complete) complete();
            this.processing = false;

            let obj = {
                items: jsonData['data'],
                valid: jsonData['valid'],
                error: jsonData['error'],
            };

            // close and open other popup
            this.dialog.HideAllDialog();
            setTimeout(() => {                
                this.dialog.WapperAsync({
                    objectExtra: obj,
                    cancelText: 'Hủy',
                    confirmText: 'Import',
                    title: 'Xác nhận import',
                    size: ModalSizeType.ExtraLarge,
                    object: MCRMConfirmImportCustomerLeadComponent,
                });
            }, 300);
            return true;
        }
        else {
            ToastrHelper.Error('Dữ liệu API bị lỗi hoặc không hợp lệ');
            this.dialog.HideAllDialog();
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
            this.item = EntityHelper.createEntity(MCRMCustomerLeadEntity);
        }
    }
}