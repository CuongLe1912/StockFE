import * as _ from 'lodash';
import { MSSeoService } from '../../seo.service';
import { AppInjector } from '../../../../app.module';
import { Component, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { MSListImportTextLinkComponent } from './list.import.textlink.component';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { MSHighlightValidateImportEntity } from '../../../../_core/domains/entities/meeyseo/ms.featured.real.estate.entity';

@Component({
    templateUrl: './import.textlink.component.html',
    styleUrls: [
        './import.textlink.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class ImportTextLinkComponent extends EditComponent implements OnInit {
    service: MSSeoService;
    eventService: AdminEventService;
    @ViewChild('importManual') importManual: EditorComponent;
    item: MSHighlightValidateImportEntity = new MSHighlightValidateImportEntity();

    constructor() {
        super();
        this.service = AppInjector.get(MSSeoService);
        this.eventService = AppInjector.get(AdminEventService);
    }

    async ngOnInit(): Promise<void> {

    }

    public async confirm(complete: () => void): Promise<boolean> {
        this.processing = true;
        let valid = await validation(this.item);
        if (valid) {
            let importData = await this.importManual.upload();
            let result = importData && importData.length > 0 && importData.filter(c => c.ResultUpload).map(c => c.ResultUpload.files && Array.isArray(c.ResultUpload.files)
                ? c.ResultUpload.files[0]
                : c.ResultUpload)[0];
            if (result) {
                // close and open other  popup
                this.dialogService.HideAllDialog();
                setTimeout(() => {
                    let obj = result;
                    this.dialogService.WapperAsync({
                        cancelText: 'Đóng',
                        objectExtra: {     
                            items: obj?.data,
                            fileId: obj?.fileId,                       
                            statisticals: {
                                'Số text link import': obj?.total,
                                'Số text link hợp lệ': obj?.totalValid,
                                'Số text link không hợp lệ': obj?.totalError,
                            },
                            disabled: obj?.totalError > 0,
                        },
                        confirmText: 'Import',
                        title: 'Xác nhận Import',
                        size: ModalSizeType.ExtraLarge,
                        object: MSListImportTextLinkComponent,
                    });                    
                }, 300);
                return true;
            }
        }
        return false;
    }
}