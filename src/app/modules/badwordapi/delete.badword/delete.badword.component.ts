import { AppInjector } from "../../../app.module";
import { Component, Input, OnInit } from "@angular/core";
import { BadwordApiService } from "../badwordapi.service";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { AdminDialogService } from "../../../_core/services/admin.dialog.service";

@Component({
    templateUrl: './delete.badword.component.html',
    styleUrls: [
        '../../../../assets/css/modal.scss'
    ],
})
export class DeleteBadwordComponent implements OnInit{
    loading: boolean;
    service: BadwordApiService;
    dialogService: AdminDialogService;
    countIdDelete: number;
    @Input() params: any;
    constructor() {
        this.service = AppInjector.get(BadwordApiService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }
    ngOnInit() {
        let ids = this.params && this.params['ids'];
        this.countIdDelete = ids.length
    }
    async confirm(){
        let ids = this.params && this.params['ids'];
        const result = await this.service.DeleteMulti(ids)
        if(ResultApi.IsSuccess(result)){
            return true;
        }
        else{
            return false;
        }

    }
    reject() {
        this.dialogService.HideAllDialog();
    }
    
}