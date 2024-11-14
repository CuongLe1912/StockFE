import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { EditProductComponent } from "./edit.product/edit.product.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MGProductEntity } from "../../../_core/domains/entities/meeygroup/mg.product.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class ProductComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Reference: MGProductEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            { Property: 'Order', Title: 'Thứ tự', Type: DataType.DropDown },
            { Property: 'Icon', Title: 'Icon', Type: DataType.Image },
            { Property: 'Image', Title: 'Ảnh', Type: DataType.Image },
            {
                Property: 'NameVn', Title: 'Tên', Type: DataType.String,
                Format: (item: any) => {
                    let text: string = '';
                    if (item.NameVn) text += '<p>' + item.NameVn + '</p>';
                    if (item.NameEn) text += '<p>' + item.NameEn + '</p>';
                    return text;
                }
            },
            {
                Property: 'DescriptionVn', Title: 'Miêu tả', Type: DataType.String,
                Format: (item: any) => {
                    let text: string = '';
                    if (item.DescriptionVn) text += '<p>' + item.DescriptionVn + '</p>';
                    if (item.DescriptionEn) text += '<p>' + item.DescriptionEn + '</p>';
                    return text;
                }
            },
            {
                Property: 'LinkIos', Title: 'Đường dẫn', Type: DataType.String,
                Format: (item: any) => {
                    let text: string = '';
                    if (item.LinkIos) text += '<p>- IOS: ' + item.LinkIos + '</p>';
                    if (item.LinkAndroid) text += '<p>- Android: ' + item.LinkAndroid + '</p>';
                    if (item.LinkWebsite) text += '<p>- Website: ' + item.LinkWebsite + '</p>';
                    return text;
                }
            },
        ];
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Large,
            confirmText: 'Tạo Sản phẩm',
            object: EditProductComponent,
        }, () => this.loadItems());
    }

    edit(item: MGProductEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Large,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            object: EditProductComponent,
        }, () => this.loadItems());
    }

    view(item: MGProductEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Large,
            object: EditProductComponent,
            objectExtra: { id: item.Id, viewer: true },
        });
    }
}