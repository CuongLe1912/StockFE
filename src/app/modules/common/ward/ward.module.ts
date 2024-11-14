import { WardService } from "./ward.service";
import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { WardEntity } from "../../../_core/domains/entities/ward.entity";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class WardComponent extends GridComponent {
    obj: GridData = {
        Reference: WardEntity,
        Size: ModalSizeType.Large,
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

    constructor(public apiService: WardService) {
        super();
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [WardComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: WardComponent, pathMatch: 'full', data: { state: 'ward'}, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [WardService]
})
export class WardModule { }