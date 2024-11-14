import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { UserEntity } from '../../../../_core/domains/entities/user.entity';
import { MeeyCrmService } from '../../meeycrm.service';
import { ToastrHelper } from 'src/app/_core/helpers/toastr.helper';
import { ResultApi } from 'src/app/_core/domains/data/result.api';
import { ResultType } from 'src/app/_core/domains/enums/result.type';

@Component({
    templateUrl: './sync.crm.component.html',
    styleUrls: [
        '../../../../../assets/css/modal.scss'
    ],
})
export class SyncCrmComponent implements OnInit {
    @Input() params: number;
    loading: boolean = true;
    service: MeeyCrmService;
    item: UserEntity = new UserEntity();
    constructor() {
        this.service = AppInjector.get(MeeyCrmService);
    }

    async ngOnInit() {
        this.loading = false;
    }
    
    public async confirm(): Promise<boolean> {
        return await this.service.syncCrm(this.item.Phone).then((result: ResultApi) => {
            if (result && result.Type == ResultType.Success) {
                ToastrHelper.Success('Đồng bộ dữ liệu thành công');
                return true;
            } else{
                ToastrHelper.ErrorResult(result);
                return true;
            } 
        });
    }
}