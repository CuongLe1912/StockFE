import { Component } from "@angular/core";
import { AppConfig } from "../../../_core/helpers/app.config";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { OptionItem } from "../../../_core/domains/data/option.item";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { ObjectEx } from "../../../_core/decorators/object.decorator";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { ConstantHelper } from "../../../_core/helpers/constant.helper";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { MSMetaSeoHistoryComponent } from "./components/history.meta.seo.component";
import { MSMetaSeoEntity } from "../../../_core/domains/entities/meeyseo/ms.meta.seo.entity";

@Component({
    templateUrl: "../../../_core/components/grid/grid.component.html",
})
export class MSMetaSeoComponent extends GridComponent {
    obj: GridData = {
        Reference: MSMetaSeoEntity,
        Size: ModalSizeType.Large,
        UpdatedBy: false,
        Imports: [],
        Exports: [],
        Filters: [],
        Features: [],
        Actions: [
            //Chỉnh sửa
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Edit,
                className: 'btn btn-success',
                click: (item: MSMetaSeoEntity) => {
                    this.edit(item);
                }
            },
            {
                //hide: true,
                name: 'Lịch sử',
                icon: 'la la-book',
                systemName: ActionType.History,
                className: 'btn btn-outline-secondary',
                click: ((item: MSMetaSeoEntity) => {
                    this.history(item);
                })
            },
        ],
        MoreActions: [],
        NotKeepPrevData: true,
        DisableAutoLoad: true,
        SearchText: 'Nhập URL, ID',
        CustomFilters: ['FilterUpdateDate', 'Type', 'Category'],
    };

    constructor() {
        super();
    }

    async ngOnInit() {
        this.properties = [
            {
                Property: '_Id', Title: 'ID', Type: DataType.String,
                Format: (item: any) => {
                    item['IdPrev'] = item['_Id'];
                    return UtilityExHelper.renderIdFormat(null, item['_Id'], false);
                }
            },
            {
                Property: 'Type', Title: 'Loại', Type: DataType.String, Align: 'center', DisableOrder: true,
                Format: (item: any) => {
                    item['TypeCode'] = item['Type'];
                    let option: OptionItem = ConstantHelper.MS_META_SEO_TYPES.find(c => c.value == item.Type);
                    let text = '<p>' + (option && option.label) + '</p>';
                    return text;
                }
            },
            {
                Property: 'Category', Title: 'Danh mục', Type: DataType.String,
                Format: (item: any) => {
                    if (item['TypeCode'] == 'Danh mục') return '';
                    return item['Category'];
                }
            },
            {
                Property: 'Url', Title: 'Url', Type: DataType.String, Align: 'center', Click: ((item: any) => {
                    let url = AppConfig.MeeyLandConfig.Url + item.Url;
                    if (item.Url[0] != '/') url = AppConfig.MeeyLandConfig.Url + '/' + item.Url;
                    window.open(url, "_blank");
                })
            },
            {
                Property: 'UpdatedDate', Title: 'Ngày cập nhật', Type: DataType.String,
                Format: (item: any) => {
                    let text = '<p>' + UtilityExHelper.dateTimeString(item.UpdatedDate) + '</p>';
                    return text;
                }
            },
            { Property: 'Name', Title: 'Name', Type: DataType.String, Align: 'center', DisableOrder: true },
            { Property: 'MetaTitle', Title: 'Meta Title', Type: DataType.String, Align: 'center', DisableOrder: true },
            { Property: 'MetaKeyword', Title: 'Meta Keywords', Type: DataType.String, Align: 'center', DisableOrder: true },
            { Property: 'MetaDescription', Title: 'Meta Description', Type: DataType.String, Align: 'center', DisableOrder: true },
            { Property: 'CanonicalUrl', Title: 'Canonical URL', Type: DataType.String, Align: 'center', DisableOrder: true },
            {
                Property: 'BodyContentLength', Title: 'Body content', Type: DataType.String, Align: 'center', DisableOrder: true,
                Format: (item: any) => {
                    let text = '<p>Null</p>';
                    if (item.BodyContentLength) text = '<p>' + item.BodyContentLength + '</p>';
                    return text;
                }
            },
        ];
        this.render(this.obj);
    }

    edit(item: any) {
        let obj: NavigationStateData = {
            id: item.IdPrev,
            object: {
                item: item,
                type: item.TypeCode,
            },
            prevData: this.itemData,
            prevUrl: '/admin/msseo/metaseo',
        };
        this.router.navigate(['/admin/msseo/metaseo/edit'], { state: { params: JSON.stringify(obj) } });
    }

    history(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Lịch sử thao tác',
            size: ModalSizeType.ExtraLarge,
            object: MSMetaSeoHistoryComponent,
            objectExtra: { id: item.IdPrev, type: item.TypeCode },
        });
    }

    customFilterChange(property: ObjectEx) {
        if (property.property == 'Type') {
            if (this.objFilter[property.property] == 'Danh mục' || this.objFilter[property.property] == '404' || this.objFilter[property.property] == 'Đăng tin') {
                let propertyCategory = this.properties.find(c => c.Property == 'Category');
                propertyCategory.Active = false;
            } else {
                let propertyCategory = this.properties.find(c => c.Property == 'Category');
                propertyCategory.Active = true;
            }
            this.renderActiveProperties(true);
        }
    }
}