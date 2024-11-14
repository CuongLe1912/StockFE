import { StreetService } from "./street.service";
import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { StreetEntity } from "../../../_core/domains/entities/street.entity";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class StreetComponent extends GridComponent {
    obj: GridData = {
        Reference: StreetEntity,
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

    constructor(public apiService: StreetService) {
        super();
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [StreetComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: StreetComponent, pathMatch: 'full', data: { state: 'street'}, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [StreetService]
})
export class StreetModule { }