import { Component, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { MPOProjectInvestorEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.investor.entity';
import { AppConfig } from "../../../../_core/helpers/app.config";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { MPOGridImportInvestorComponent } from "./components/grid.import.component";

@Component({
    templateUrl: './upload.project.investor.component.html',
    styleUrls: [
        './upload.project.investor.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class UploadProjectInvestorComponent extends EditComponent implements OnInit {
    file: string;
    @ViewChild('uploadFile') uploadFile: EditorComponent;
    item: MPOProjectInvestorEntity = new MPOProjectInvestorEntity();

    disabled: boolean = true;

    constructor() {
        super();
        this.file = AppConfig.ApiUrl.replace('/api', '/Reports/FileInvestor.xlsx');
    }

    async ngOnInit(): Promise<void> {

    }

    public async confirm(complete: () => void): Promise<boolean> {
        this.processing = true;
        if (await validation(this.item, ['File'])) {
            this.processing = false;
            let files = await this.uploadFile.upload();
            let resultUpload = files.filter(c => c.ResultUpload).map(c => c.ResultUpload);
            if (resultUpload && resultUpload.length > 0) {
                this.dialogService.WapperAboveAsync({
                    cancelText: 'Đóng',
                    objectExtra: {
                        items: resultUpload[0],
                    },
                    confirmText: '',
                    title: 'Thông báo danh sách Import chủ đầu tư',
                    size: ModalSizeType.ExtraLarge,
                    object: MPOGridImportInvestorComponent,
                }, null, null, null, () => {
                    this.dialogService.HideAllDialog();
                });
                if (complete) complete();
                return true;
            }
        }
        return false;
    }

    async toggleDisableButton() {
        this.disabled = await validation(this.item, ['File'], true) ? false : true;
    }
}