import { AppInjector } from "../../../app.module";
import { MPOProjectService } from "../project.service";
import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MPOProjectEntity } from "../../../_core/domains/entities/meeyproject/mpo.project.entity";

@Component({
    selector: 'mpo-project-exists',
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class ListProjectComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Actions: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        DisableAutoLoad: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MPOProjectEntity,
    };
    @Input() params: any;
    item: MPOProjectEntity;
    projectService: MPOProjectService;

    constructor() {
        super();
        this.projectService = AppInjector.get(MPOProjectService);
    }

    async ngOnInit(): Promise<void> {
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true },
            { Property: 'Name', Title: 'Tên dự án', Type: DataType.String },
            { Property: 'City', Title: 'Tỉnh/Thành phố', Type: DataType.String, DisableOrder: true },
            { Property: 'District', Title: 'Quận/Huyện', Type: DataType.String, DisableOrder: true },
            { Property: 'Ward', Title: 'Phường/Xã', Type: DataType.String, DisableOrder: true },
            { Property: 'ProjectTypes', Title: 'Loại dự án', Type: DataType.String, DisableOrder: true },
            {
                Property: 'InvestorName', Title: 'Chủ đầu tư', Type: DataType.String, DisableOrder: true,
                Format: (item) => {
                    return item.Investor?.name;
                }
            },
            { Property: 'ProjectStatus', Title: 'Trạng thái dự án', Type: DataType.String },
            { Property: 'Publish', Title: 'Trạng thái hiển thị', Type: DataType.String },
        ];
        this.item = this.params && this.params['item'];
        if (this.item) {
            let name = this.item.Name,
                cityId = this.item.CityId,
                wardId = this.item.WardId,
                districtId = this.item.DistrictId;
            this.obj.Url = '/admin/MPOProject/ExistItems?name=' + name + '&cityId=' + cityId + '&districtId=' + districtId + '&wardId=' + wardId;
            this.render(this.obj);
        }
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            return await this.projectService.addNew(this.item).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    // let message = 'Tạo nhanh dự án thành công';
                    // ToastrHelper.Success(message);
                    return result.Object;
                } else {
                    ToastrHelper.ErrorResult(result);
                    return false;
                }
            });
        }
        return false;
    }
}