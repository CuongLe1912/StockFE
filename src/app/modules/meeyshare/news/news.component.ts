import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { MeeyShareNewsEntity } from "../../../_core/domains/entities/meeyshare/ms.news.entity";
import { MShareStatusType } from "../../../_core/domains/entities/meeyshare/enums/ms.status.type";

@Component({
    styleUrls: ['./news.component.scss'],
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class NewsComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        UpdatedBy: false,
        DisableAutoLoad: true,
        ClassName: 'meeyshare-grid',
        Actions: [
            ActionData.edit((item: any) => this.edit(item)),
        ],
        Features: [
            ActionData.reload(() => this.loadItems()),
        ],
        Reference: MeeyShareNewsEntity,
        SearchText: 'Tìm kiếm theo từ khóa...',
        CustomFilters: ['Status', 'CategoryId', 'CreatedAt', 'PublishedAt']
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'Comment', Type: DataType.String, DisableOrder: true },
            {
                Property: 'Title', Title: 'Tiêu đề', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    let text = '';
                    text += '<div class="title-article">';
                    if (item.Image) text += '<div class="thumbnail-img"><img src="' + item.Image + '" /></div>';
                    text += '<div style="width: 100%;">';
                    if (item.Title) text += '<div class="label" title="' + item.Title + '" style="word-break: break-word;">' + item.Title + '</div>';
                    if (item.Code) text += '<div class="code">Mã tin: ' + item.Code + '</div>';
                    if (item.Status && item.Status == MShareStatusType.Published) {
                        text += '</div></div><div><a routerLink="quickView" type="copy" style="color: blue; font-weight: bold;"><i class="la la-copy" style="font-weight: bold; margin-right: 5px;"></i>Sao chép đường dẫn</a></div>';
                    }
                    return text;
                }),
            },
            { Property: 'Category', Title: 'Chuyên mục', Type: DataType.String, DisableOrder: true },
            { Property: 'Type', Title: 'Loại tin', Type: DataType.DropDown, DisableOrder: true },
            { Property: 'Status', Type: DataType.DropDown, DisableOrder: true },
            {
                Property: 'CreatedAt', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.CreatedAt) text += '<p class="d-flex"><span>Ngày tạo báo gốc:&nbsp;</span><span>' + UtilityExHelper.dateTimeString(item.CreatedAt) + '</span></p>';
                    if (item.UpdatedAt) text += '<p class="d-flex"><span>Ngày sửa:&nbsp;</span><span>' + UtilityExHelper.dateTimeString(item.UpdatedAt) + '</span></p>';
                    return text;
                }),
            },
            { Property: 'PublishedAt', Type: DataType.DateTime, DisableOrder: true },
        ];
    }

    async ngOnInit() {
        await this.render(this.obj);
    }

    edit(item: any) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            prevData: this.itemData,
            prevUrl: '/admin/meeyshare/news',
        };
        this.router.navigate(['/admin/meeyshare/news/edit'], { 
            queryParams: { id: item.Id },
            state: { params: JSON.stringify(obj) },
        });
    }

    quickView(item: any, type: string) {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem) {
            switch (type) {
                case 'copy': {
                    UtilityExHelper.copyString(item.FeedUrl);
                    ToastrHelper.Success('Sao chép đường dẫn thành công');
                } break;
            }
        }
    }
}