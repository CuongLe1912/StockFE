import { CityService } from "./city.service";
import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { CityEntity } from "../../../_core/domains/entities/city.entity";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class CityComponent extends GridComponent {
    obj: GridData = {
        Reference: CityEntity,
        Size: ModalSizeType.Large,
        Features: [
            ActionData.addNew(() => { this.addNew(); }),
            {
                icon: 'la la-refresh',
                name: this.ActionType.Sync,
                className: 'btn btn-warning',
                systemName: this.ActionType.Sync,
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

    constructor(public apiService: CityService) {
        super();
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [CityComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: CityComponent, pathMatch: 'full', data: { state: 'city' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [CityService]
})
export class CityModule { }