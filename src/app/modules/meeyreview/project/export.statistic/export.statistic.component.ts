import * as _ from 'lodash';
import { Component } from "@angular/core";
import { HttpEventType } from '@angular/common/http';
import { validation } from '../../../../_core/decorators/validator';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { MeeyReviewProjectExportStatisticEntity } from '../../../../_core/domains/entities/meeyreview/ms.export.statistic';

@Component({
    templateUrl: './export.statistic.component.html',
    styleUrls: [
        './export.statistic.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class ExportStatisticMRVProjectComponent extends EditComponent {
    disabled: boolean;
    item: MeeyReviewProjectExportStatisticEntity = new MeeyReviewProjectExportStatisticEntity();

    constructor() {
        super();
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item);
            if (valid) {
                this.processing = true;
                let obj = {
                    endDate: UtilityExHelper.dateString(this.item.ExportDate[1]),
                    startDate: UtilityExHelper.dateString(this.item.ExportDate[0]),
                };
                let fileName = 'Baocao.xlsx',
                    url = '/admin/meeyreview/export';
                return this.service.downloadFileByUrl(url, obj).toPromise().then(data => {
                    this.processing = false
                    switch (data.type) {
                        case HttpEventType.DownloadProgress:
                            break;
                        case HttpEventType.Response:
                            const downloadedFile = new Blob([data.body], { type: data.body.type });
                            const a = document.createElement('a');
                            a.setAttribute('style', 'display:none;');
                            document.body.appendChild(a);
                            a.href = URL.createObjectURL(downloadedFile);
                            a.download = fileName;
                            a.target = '_blank';
                            a.click();
                            document.body.removeChild(a);
                            break;
                    }
                    return true;
                }).catch(ex => {
                    ToastrHelper.Exception(ex);
                    this.processing = false;
                    return false;
                });
            }
        }
        return false;
    }

    async activeButton() {
        let valid = await validation(this.item, null, true);
        this.disabled = !valid;
    }
}