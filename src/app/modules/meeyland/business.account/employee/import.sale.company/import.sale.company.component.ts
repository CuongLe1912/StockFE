import * as _ from 'lodash';
import { AppInjector } from '../../../../../app.module';
import { Component, OnInit, ViewChild } from "@angular/core";
import { MSSeoService } from '../../../../../modules/meeyseo/seo.service';
import { EditorComponent } from '../../../../../_core/editor/editor.component';
import { ModalSizeType } from '../../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../../../_core/services/admin.dialog.service';
import { MLEmployeeImportSaleEntity } from '../../../../../_core/domains/entities/meeyland/ml.employee.entity';
import { MLEmployeeConfirmImportSaleComponent } from '../confirm.import.sale.company/confirm.import.sale.company.component';

@Component({
    templateUrl: './import.sale.company.component.html',
    styleUrls: [
        './import.sale.company.component.scss',
    ],
})
export class MLEmployeeImportSaleComponent extends EditComponent implements OnInit {
    @ViewChild('importAuto') importAuto: EditorComponent;

    loading: boolean;
    isActive: boolean = true;
    isImport: boolean;
    isDownload: boolean;
    service: MSSeoService;
    dialog: AdminDialogService;
    agency: string;
    agencyService: string;
    item: MLEmployeeImportSaleEntity = new MLEmployeeImportSaleEntity();

    constructor() {
        super();
        
        this.service = AppInjector.get(MSSeoService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    async ngOnInit(): Promise<void> {
        this.item.CompanyId = this.params && this.params['companyId'];
    }


    public async confirm(complete: () => void): Promise<boolean> {
        this.processing = true;
        let dataImport = await this.importAuto.upload();
        let jsonData = dataImport && dataImport.length > 0 ? dataImport[0].Path : null;
        if (jsonData) {
            //ToastrHelper.Success('Tải lên tệp: ' + dataImport[0].Name + ' thành công');
            if (complete) complete();
            this.processing = false;

            let obj = {
                items: jsonData['data'],
                valid: jsonData['valid'],
                error: jsonData['error'],
                companyId: this.item.CompanyId,
            };

            // close and open other popup
            this.dialog.HideAllDialog();
            setTimeout(() => {                
                this.dialog.WapperAsync({
                    objectExtra: obj,
                    cancelText: 'Hủy',
                    confirmText: 'Import',
                    title: 'Import Sale',
                    size: ModalSizeType.ExtraLarge,
                    object: MLEmployeeConfirmImportSaleComponent,
                });
            }, 300);
            return true;
        }
        else {
            this.dialog.Alert('Import thất bại', 'Không tìm thấy dữ liệu, vui lòng kiểm tra và import lại');
            this.dialog.HideAllDialog();
        }
        return false;
    }
}