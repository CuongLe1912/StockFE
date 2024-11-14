import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { PipeType } from "../../../_core/domains/enums/pipe.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { MeeyShareReportEntity } from "../../../_core/domains/entities/meeyshare/ms.report.entity";

@Component({
    styleUrls: ['./report.component.scss'],
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class ReportComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        UpdatedBy: false,
        DisableAutoLoad: true,
        ClassName: 'meeyshare-grid',
        Actions: [
            ActionData.viewDetail((item: any) => this.view(item)),
        ],
        Features: [
            ActionData.reload(() => this.loadItems()),
        ],
        Reference: MeeyShareReportEntity,
        SearchText: 'Nhập tiêu đề tin tức...',
        CustomFilters: ['Status', 'UserId', 'CreatedAt']
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'Title', Title: 'Nội dung ý kiến người đăng', Type: DataType.String, DisableOrder: true },
            { Property: 'Category', Title: 'Chuyên mục', Type: DataType.String, DisableOrder: true },
            {
                Property: 'UserId', Title: 'Người báo xấu', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.UserId) text += '<p class="d-flex"><span>MeeyId:&nbsp;</span><span>' + item.UserId + '</span></p>';
                    if (item.User) text += '<p class="d-flex"><span>Tên:&nbsp;</span><span>' + item.User + '</span></p>';
                    return text;
                }),
            },
            { Property: 'Description', Title: 'Lý do', Type: DataType.String, DisableOrder: true },
            { Property: 'Status', Title: 'Trạng thái', Type: DataType.DropDown, DisableOrder: true },
            { Property: 'CreatedAt', Title: 'Ngày báo xấu', Type: DataType.DateTime, DisableOrder: true, PipeType: PipeType.Date, Align: 'center' },
        ];
    }

    async ngOnInit() {
        await this.render(this.obj);
    }

    view(item: any) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            prevData: this.itemData,
            prevUrl: '/admin/meeyshare/report',
        };

        this.router.navigate(['/admin/meeyshare/report/view'], { 
            queryParams: { id: item.Id },
            state: { params: JSON.stringify(obj) },
        });
    }
}