import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { OrderType } from "../../../_core/domains/enums/order.type";
import { BaseEntity } from "../../../_core/domains/entities/base.entity";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { MBankNewsEntity } from "../../../_core/domains/entities/meeybank/mbank.news.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class NewsComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Reference: MBankNewsEntity,
        CustomFilters: ['CategoryId', 'PublishDate'],
    };
    constructor() {
        super();
        this.setOrder([{ Name: 'PublishDate', Type: OrderType.Desc }]);
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            { Property: 'Image', Title: 'Ảnh', Type: DataType.Image },
            { Property: 'TitleVn', Title: 'Tiêu đề - Tiếng Việt', Type: DataType.String },
            { Property: 'TitleEn', Title: 'Tiêu đề - Tiếng Anh', Type: DataType.String },
            {
                Property: 'CategoryId', Title: 'Chủ đề', Type: DataType.String,
                Format: (item: any) => {
                    let text = '<p>'+ item.CategoryVn+'</P>'
                    text += '<p>'+ item.CategoryEn+'</P>'
                    return text;
                }
            },
            { Property: 'PublishDate', Title: 'Ngày đăng tin', Type: DataType.DateTime },
        ];
    }

    ngOnInit() {
        this.obj.Url = '/admin/MBankNews/Items';
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/meeybank/news',
        };
        this.router.navigate(['/admin/meeybank/news/add'], { state: { params: JSON.stringify(obj) } });
    }
    view(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/meeybank/news',
        };
        this.router.navigate(['/admin/meeybank/news/view'], { state: { params: JSON.stringify(obj) } });
    }
    edit(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            prevData: this.itemData,
            prevUrl: '/admin/meeybank/news',
        };
        this.router.navigate(['/admin/meeybank/news/edit'], { state: { params: JSON.stringify(obj) } });
    }
}