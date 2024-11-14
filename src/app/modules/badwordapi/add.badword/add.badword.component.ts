import { Component, OnInit } from "@angular/core";
import { AppInjector } from "../../../app.module";
import { BadwordApiService } from "../badwordapi.service";
import { validation } from "../../../_core/decorators/validator";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { AdminDialogService } from "../../../_core/services/admin.dialog.service";
import { BadwordApiEntity, ResultApiBadword } from "../../../_core/domains/entities/badwordapi/badwordapi.entity";

@Component({
    templateUrl: './add.badword.component.html',
    styleUrls: [
        '../../../../assets/css/modal.scss'
    ],
})
export class AddBadwordComponent implements OnInit{
    loading: boolean;
    item: BadwordApiEntity;
    service: BadwordApiService;
    dialogService: AdminDialogService;
    constructor() {
        this.service = AppInjector.get(BadwordApiService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }
    ngOnInit() {
        this.item = new BadwordApiEntity();
    }
    async confirm(){
        let column = ['Text'];
        if(await validation(this.item, column)){
            const result = await this.service.Add(this.item)
            if(ResultApi.IsSuccess(result)){
                let item : ResultApiBadword                
                item = JSON.parse(result.Object)
                if(item.success == false) {
                    ToastrHelper.Error("Từ khóa đã tồn tại, xin vui lòng nhập lại")
                    return false;
                }
                ToastrHelper.Success("Thêm mới từ khóa thành công")
                return true;
                
            }
        }
    }
    reject() {
        this.dialogService.HideAllDialog();
    }
}
