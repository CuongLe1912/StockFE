import { RouterModule } from "@angular/router";
import { ShareModule } from "../../share.module";
import { ProductService } from "./product.service";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { ViewProductComponent } from "./view.product/view.product.component";
import { EditProductComponent } from "./edit.product/edit.product.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { ProductEntity } from "../../../_core/domains/entities/product.entity";
import { GridEditComponent } from "../../../_core/components/grid/grid.edit.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class ProductComponent extends GridEditComponent {
    obj: GridData = {
        Reference: ProductEntity,
        Filters: [],
        Imports: [],
        Exports: [],
        UpdatedBy: false,
        Actions: [
            ActionData.edit((item: any) => {
                this.edit(item);
            }),
            ActionData.delete((item: any) => {
                this.trash(item);
            })
        ],
        Size: ModalSizeType.Medium,
        MoreActions: [
            {
                icon: 'la la-users',
                name: ActionType.EditMember,
                systemName: ActionType.EditMember,
                click: ((item: ProductEntity) => {
                    this.popupChoiceUser(item);
                })
            },
            ActionData.history((item: ProductEntity) => {
                this.viewHistory(item.Id);
            })
        ],
        SearchText: 'Nhập tên sản phẩm, tên khác'
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            {
                Property: 'Name', Title: 'Tên sản phẩm', Type: DataType.String,
                Format: ((item: any) => {
                    return '<a routerLink="view">' + UtilityExHelper.escapeHtml(item.Name) + '</a>';
                })
            },
            { Property: 'OtherName', Title: 'Tên khác', Type: DataType.String },
            { Property: 'Description', Title: 'Ghi chú', Type: DataType.String },
            {
                Property: 'Amount', Title: 'Số lượng nhân viên', Type: DataType.String, Align: 'center',
                Click: ((item: ProductEntity) => {
                    this.popupViewChoiceUser(item);
                }),
                Format: ((item: any) => {
                    return item.Amount + ' nhân viên'
                })
            },
        ];
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [
        ProductComponent,
        EditProductComponent,
        ViewProductComponent,
    ],
    imports: [
        ShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: ProductComponent, pathMatch: 'full', data: { state: 'product' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditProductComponent, pathMatch: 'full', data: { state: 'add_product' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditProductComponent, pathMatch: 'full', data: { state: 'edit_product' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: ViewProductComponent, pathMatch: 'full', data: { state: 'view_product' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [ProductService]
})
export class ProductModule { }