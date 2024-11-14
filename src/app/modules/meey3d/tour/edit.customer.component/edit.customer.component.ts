import { AppInjector } from "../../../../app.module";
import { Component, Input, OnInit } from "@angular/core";
import { validation } from "../../../../_core/decorators/validator";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { EntityHelper } from "../../../../_core/helpers/entity.helper";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { MethodType } from "../../../../_core/domains/enums/method.type";
import { AdminApiService } from "../../../../_core/services/admin.api.service";
import { AdminDialogService } from "../../../../_core/services/admin.dialog.service";
import { M3DCustomerEntity } from "../../../../_core/domains/entities/meey3d/m3d.customer.entity";

@Component({
    templateUrl: './edit.customer.component.html',
  })
  export class EditTourCustomerComponent implements OnInit{
    @Input() params: any;
    item: M3DCustomerEntity;
    loading: boolean;
    service: AdminApiService;
    dialog: AdminDialogService;
    constructor() {
        this.service = AppInjector.get(AdminApiService);
        this.dialog = AppInjector.get(AdminDialogService);
      }
    ngOnInit() {
        this.loadItem();
        this.loading = false;
    }
    loadItem(){
        let data = this.params && this.params['item']
        this.item = EntityHelper.createEntity(M3DCustomerEntity, data)
    }
    async confirm() : Promise<boolean>{
        let valid = await validation(this.item, ['Status']);
        if(valid){
            const result =  await this.service.callApiByUrl('M3DContactInfo/UpdateStatus', this.item, MethodType.Post)
            if (ResultApi.IsSuccess(result)) {
                ToastrHelper.Success('Cập nhật thành công');
                return true;
            }
            else{
                ToastrHelper.Error('Cập nhật không thành công');
                return false;
            }
        }
        return false
    }
  }