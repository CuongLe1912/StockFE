import { AppInjector } from "../../../app.module";
import { Component, Input, OnInit } from "@angular/core";
import { BadwordApiService } from "../badwordapi.service";
import { validation } from "../../../_core/decorators/validator";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { EntityHelper } from "../../../_core/helpers/entity.helper";
import { AdminDialogService } from "../../../_core/services/admin.dialog.service";
import { BadwordApiEntity, ResultApiBadword } from "../../../_core/domains/entities/badwordapi/badwordapi.entity";

@Component({
    templateUrl: './edit.badword.component.html',
    styleUrls: [
        '../../../../assets/css/modal.scss'
    ],
})
export class EditBadwordComponent implements OnInit{
    loading: boolean;
    item: BadwordApiEntity;
    service: BadwordApiService;
    dialogService: AdminDialogService;
    @Input() params: any;
    constructor() {
        this.service = AppInjector.get(BadwordApiService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }
    async ngOnInit(){
        this.item = new BadwordApiEntity();
        await this.loadItem()
    }
    async loadItem(){
        let id = this.params && this.params['id'];
        if(id){
            await this.service.item('BadwordApi', id).then((result: ResultApi) => {
                if(ResultApi.IsSuccess(result)){
                    let item : any                
                    item = JSON.parse(result.Object)
                    this.item.Text = item.data.text
                    this.item = EntityHelper.createEntity(BadwordApiEntity, this.item);                   
                }
                else ToastrHelper.ErrorResult(result);
            })
        }
    }
    reject() {
        this.dialogService.HideAllDialog();
    }
    async confirm(){
        let column = ['Text'];
        if(await validation(this.item, column)){
            let id = this.params && this.params['id'];
            this.item.Id = id;
            const result = await this.service.Edit(this.item)
            if(ResultApi.IsSuccess(result)){
                let item : ResultApiBadword                
                item = JSON.parse(result.Object)
                if(item.success == false) {
                    ToastrHelper.Error("Từ khóa đã tồn tại, xin vui lòng nhập lại")
                    return false;
                }
                ToastrHelper.Success("Chỉnh mới từ khóa thành công")
                return true;
                
            }
        }
    }
    
}