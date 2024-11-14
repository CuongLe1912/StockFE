import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { DistrictService } from "./district.service";
import { GridData } from "../../../_core/domains/data/grid.data";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { DistrictEntity } from "../../../_core/domains/entities/district.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class DistrictComponent extends GridComponent {
    obj: GridData = {
        Size: ModalSizeType.Large,
        Reference: DistrictEntity,
        Features: [
            ActionData.addNew(() => { this.addNew(); }),
            {
                icon: 'la la-refresh',
                name: ActionType.Sync,
                systemName: ActionType.Sync,
                className: 'btn btn-warning',
                click: () => {
                    this.loading = true;
                    this.apiService.sync().then((result: ResultApi) => {
                        this.loading = false;
                        if (ResultApi.IsSuccess(result) && result.Object) {
                            ToastrHelper.Success('Đồng bộ dữ liệu thành công');
                            this.loadItems();
                        } else ToastrHelper.Success('Đồng bộ dữ liệu thất bại');
                    })
                }
            },
            ActionData.reload(() => { this.loadItems(); }),
        ]
    };

    constructor(public apiService: DistrictService) {
        super();
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [DistrictComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: DistrictComponent, pathMatch: 'full', data: { state: 'district'}, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [DistrictService]
})
export class DistrictModule { }