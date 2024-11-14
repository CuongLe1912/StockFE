import * as _ from 'lodash';
import { Component, Input, OnInit } from "@angular/core";
import { AppInjector } from '../../../../../app.module';
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { MLBusinessAccountService } from '../../business.account.service';
import { MessageHelper } from '../../../../../_core/helpers/message.helper';
import { AdminDialogService } from '../../../../../_core/services/admin.dialog.service';
import { MLEmployeeEntity } from '../../../../../_core/domains/entities/meeyland/ml.employee.entity';

@Component({
    templateUrl: './edit.employee.component.html',
    styleUrls: ['./edit.employee.component.scss'],
})
export class MLEditEmployeeComponent implements OnInit {
    message: string;
    errorMessage: string;
    @Input() params: any;
    processSearch: boolean;
    disabled: boolean = true;
    itemSearch: MLEmployeeEntity;
    service: MLBusinessAccountService;
    dialogService: AdminDialogService;
    item: MLEmployeeEntity = new MLEmployeeEntity();

    constructor() {
        this.item.CreateType = 1;
        this.service = AppInjector.get(MLBusinessAccountService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
    }

    typeChange() {
        this.errorMessage = null;
    }

    async search() {
        let valid = await validation(this.item, ['Search']);
        if (valid) {
            this.message = null;
            this.disabled = true;
            this.itemSearch = null;
            this.errorMessage = null;
            this.processSearch = true;
            this.service.lookupUser(this.item.Search).then((result: ResultApi) => {
                this.processSearch = false;
                if (ResultApi.IsSuccess(result) && result.Object) {
                    this.itemSearch = EntityHelper.createEntity(MLEmployeeEntity, result.Object);
                    if (this.itemSearch) {
                        if (!this.itemSearch.Email) {
                            this.message = 'Tài khoản cần khai báo đầy đủ thông tin email trong thông tin cá nhân. Meey Land sẽ gửi yêu cầu xác nhận tham gia công ty tới email của thành viên được mời!';
                        }
                        else if (this.itemSearch.Email && this.itemSearch.Phone) {
                            this.disabled = false;
                        }
                    }
                } else {
                    this.message = !result
                        ? MessageHelper.SystemWrong
                        : result.Description;
                }
            }, (e) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
    }

    async confirm() {
        this.errorMessage = null;
        let valid = this.item.CreateType == 1
            ? await validation(this.item, ['Name', 'Email', 'Phone'])
            : await validation(this.itemSearch, ['Email', 'MeeyId']);
        if (valid) {
            let companyId = this.params && this.params['id'];
            if (companyId) {
                let obj: MLEmployeeEntity = this.item.CreateType == 1
                    ? _.cloneDeep(this.item)
                    : _.cloneDeep(this.itemSearch);
                return await this.service.addUser(companyId, obj).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        setTimeout(() => {
                            let name = obj.Name || 'này';
                            this.dialogService.Alert('Thông báo', 'Tài khoản ' + name + ' sẽ được thêm vào tài khoản Doanh nghiệp sau khi người dùng xác nhận qua Email');
                        }, 300);
                        return true;
                    }
                    this.errorMessage = result && result.Description;
                    return false;
                }, (e) => {
                    ToastrHelper.Exception(e);
                    return false;
                });
            }
        }
        return false;
    }

    async valueChange() {
        this.disabled = this.item.CreateType == 1
            ? await validation(this.item, ['Name', 'Email', 'Phone'], true) ? false : true
            : await validation(this.itemSearch, ['Email', 'MeeyId'], true) ? false : true;
    }
}