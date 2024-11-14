
import * as _ from 'lodash';
import { MSSeoService } from "./seo.service";
import { AppInjector } from "../../app.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { UtilityModule } from "../utility.module";
import { AppConfig } from '../../_core/helpers/app.config';
import { Component, NgModule, OnInit } from "@angular/core";
import { GridData } from "../../_core/domains/data/grid.data";
import { AddTagComponent } from "./add.tag/add.tag.component";
import { DataType } from "../../_core/domains/enums/data.type";
import { ResultApi } from "../../_core/domains/data/result.api";
import { EditTagComponent } from "./edit.tag/edit.tag.component";
import { ToastrHelper } from "../../_core/helpers/toastr.helper";
import { OptionItem } from "../../_core/domains/data/option.item";
import { ActionData } from "../../_core/domains/data/action.data";
import { MethodType } from "../../_core/domains/enums/method.type";
import { MSMetaSeoComponent } from './meta.seo/meta.seo.component';
import { ShortCodeComponent } from './shortcode/shortcode.component';
import { AdminAuthGuard } from "../../_core/guards/admin.auth.guard";
import { ConstantHelper } from "../../_core/helpers/constant.helper";
import { UtilityExHelper } from "../../_core/helpers/utility.helper";
import { ExportTagComponent } from './export.tag/export.tag.component';
import { ImportTagComponent } from "./import.tag/import.tag.component";
import { FileImportComponent } from './file.import/file.import.component';
import { ModalSizeType } from "../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../_core/components/grid/grid.component";
import { MSListTagHistoryComponent } from "./components/history.tag.component";
import { NavigationStateData } from "../../_core/domains/data/navigation.state";
import { MSBoxTextLinkComponent } from './box.text.link/box.text.link.component';
import { MSSeoEntity } from "../../_core/domains/entities/meeyseo/ms.seo.entity";
import { TagFileImportComponent } from './file.import/tag.file.import.component';
import { MSListImportTagComponent } from "./components/list.import.tag.component";
import { ActionType, ControllerType } from "../../_core/domains/enums/action.type";
import { MSListTagApproveComponent } from './file.import/list.tag.approve.component';
import { EditMetaSeoComponent } from './meta.seo/edit.meta.seo/edit.meta.seo.component';
import { TextLinkComponent } from './featured.real.estate/text.link/text.link.component';
import { AddShortCodeComponent } from './shortcode/add.shortcode/add.shortcode.component';
import { MSMetaSeoHistoryComponent } from './meta.seo/components/history.meta.seo.component';
import { MSListAlertImportTagComponent } from "./components/list.alert.import.tag.component";
import { MSStructureComponent } from './featured.real.estate/components/structure.component';
import { MSPropertiesComponent } from './featured.real.estate/components/properties.component';
import { EditSyntaxComponent } from './featured.real.estate/edit.syntax/edit.syntax.component';
import { AddTextLinkComponent } from './featured.real.estate/add.text.link/add.text.link.component';
import { AddStructureComponent } from './featured.real.estate/add.structure/add.structure.component';
import { MSAlertImportTagComponent } from "./components/alert.import.tag/alert.import.tag.component";
import { AddPropertiesComponent } from './featured.real.estate/add.properties/add.properties.component';
import { MSPropertiesChildComponent } from './featured.real.estate/components/properties.child.component';
import { ImportTextLinkComponent } from './featured.real.estate/import.textlink/import.textlink.component';
import { MSConfirmImportTagComponent } from "./components/confirm.import.tag/confirm.import.tag.component";
import { EditConfigTextLinkComponent } from './featured.real.estate/edit.config/edit.config.textlink.component';
import { MSListImportTextLinkComponent } from './featured.real.estate/import.textlink/list.import.textlink.component';
import { MSMetaSeoV2Component } from './meta.seo/meta.seo.v2.component';
import { EditMetaSeoV2Component } from './meta.seo/edit.meta.seov2/edit.meta.seo.v2.component';
import { MSMetaSeoV2HistoryComponent } from './meta.seo/components/history.meta.seo.v2.component';

@Component({
    templateUrl: '../../_core/components/grid/grid.component.html',
})
export class SeoComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Actions: [
            //Chỉnh sửa
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Edit,
                className: 'btn btn-success',
                click: (item: MSSeoEntity) => {
                    this.edit(item);
                }
            },
            //Xóa
            {
                icon: 'la la-trash',
                name: ActionType.Delete,
                systemName: ActionType.Delete,
                className: 'btn btn-danger',
                click: (item: MSSeoEntity) => {
                    this.delete(item.Id);
                }
            },
            {
                name: 'Lịch sử',
                icon: 'la la-book',
                systemName: ActionType.History,
                className: 'btn btn-outline-secondary',
                click: ((item: MSSeoEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.history(originalItem);
                })
            },
        ],
        Features: [
            {
                name: "Xuất dữ liệu",
                icon: "la la-download",
                className: 'btn btn-success',
                systemName: ActionType.Export,
                click: () => this.export()
            },
            {
                icon: 'la la-plus',
                name: 'Thêm mới',
                click: () => this.addNew(),
                className: 'btn btn-primary',
                systemName: ActionType.AddNew,
            },
            {
                name: 'Import',
                icon: 'la la-recycle',
                click: () => this.import(),
                className: 'btn btn-warning',
                systemName: ActionType.Import,
            },
            {
                hide: true,
                name: 'Xóa tag',
                icon: 'la la-trash',
                toggleCheckbox: true,
                className: 'btn btn-danger',
                systemName: ActionType.Delete,
                click: () => this.deleteChecked(),
            },
            ActionData.reload(() => this.loadItems()),
        ],
        Checkable: true,
        UpdatedBy: false,
        DisableAutoLoad: true,
        Reference: MSSeoEntity,
        SearchText: 'Nhập tên tag, ID tag...',
        CustomFilters: ['FilerType', 'FilterPrioritized', 'Demand', 'TypeOfHouse', 'Price', 'Area', 'City', 'District', 'Ward', 'Street', 'LegalPaper', 'WideRoad', 'Direction', 'Facade', 'Advantage', 'Floor', 'Bedroom', 'TypeOfRealEstate', 'Furniture', 'Utility', 'FilterUpdateDate']
    };
    seoService: MSSeoService;

    constructor() {
        super();
        this.seoService = AppInjector.get(MSSeoService);
    }

    async ngOnInit(): Promise<void> {
        this.properties = [
            { Property: 'TagId', Title: 'ID tag', Type: DataType.String, Align: 'center' },
            { Property: 'Prioritized', Title: 'Ưu tiên', Type: DataType.Boolean, Align: 'center' },
            {
                Property: 'type', Title: 'Loại tag', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    let option: OptionItem = ConstantHelper.MS_TAG_TYPES.find(c => c.value == item.Type);
                    let text = '<p>' + (option && option.label) + '</p>';
                    return text;
                }
            },
            {
                Property: 'Name', Title: 'Tag', Type: DataType.String, Align: 'center', Click: (item: any) => {
                    let url = AppConfig.MeeyLandConfig.Url + '/tags/' + item.Url;
                    window.open(url, "_blank");
                }
            },
            { Property: 'TotalArticle', Title: 'Tổng tin', Type: DataType.String, Align: 'center' },
            { Property: 'PropertyLabel', Title: 'Thuộc tính', Type: DataType.String, Align: 'center', },
            { Property: 'Title', Title: 'Title tag', Type: DataType.String, Align: 'center' },
            { Property: 'MetaTitle', Title: 'Meta Title', Type: DataType.String, Align: 'center' },
            { Property: 'MetaDescription', Title: 'Meta Description', Type: DataType.String, Align: 'center' },
            {
                Property: 'ContentWord', Title: 'Body content', Type: DataType.String, DisableOrder: true, Align: 'center',
                Format: (item: any) => {
                    let text = '<p>' + (item.ContentWord > 0 ? item.ContentWord + " từ" : "null") + '</p>';
                    return text;
                }
            },
            { Property: 'Url', Title: 'Url tag', Type: DataType.String, Align: 'center' },
            {
                Property: 'UpdatedDate', Title: 'Ngày cập nhật', Type: DataType.String,
                Format: (item: any) => {
                    let text = '<p>' + UtilityExHelper.dateTimeString(item.UpdatedDate) + '</p>';
                    return text;
                }
            },
        ];
        let allowDelete = await this.authen.permissionAllow(ControllerType.MSSEO, ActionType.Delete);
        if (!allowDelete)
            this.obj.Checkable = false;
        this.render(this.obj);

        // refresh
        if (!this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids = this.event.RefreshGrids.subscribe(async () => {
                await this.loadItems();
            });
        }
    }

    ngOnDestroy() {
        if (this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids.unsubscribe();
            this.subscribeRefreshGrids = null;
        }
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/msseo',
        };
        this.router.navigate(['/admin/msseo/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: MSSeoEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/' + this.obj.ReferenceName,
        };
        this.router.navigate(['/admin/' + this.obj.ReferenceName + '/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: any) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: "/admin/msseo",
        };
        this.router.navigate(["/admin/msseo/view"], {
            state: { params: JSON.stringify(obj) },
        });
    }

    history(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            title: 'Lịch sử thao tác tag tin đăng',
            object: MSListTagHistoryComponent,
        });
    }

    async delete(id: any) {
        if (id) {
            let Ids: string[] = [];
            Ids.push(id);
            let data = {
                'ids': Ids,
                'adminUserId': this.authen.account.Id,
            };
            this.dialogService.Confirm('Có phải bạn muốn xóa dữ liệu tag này?', async () => {
                return await this.service.callApi('MSSeo', 'DeleteTags', data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Xóa tag thành công');
                        await this.loadItems();
                        return true;
                    }
                    ToastrHelper.ErrorResult(result);
                    return false;
                }, (e: any) => {
                    ToastrHelper.Exception(e);
                    return false;
                });
            });
        } else {
            ToastrHelper.Error('Xóa tag không thành công');
            return false;
        }
    }

    async deleteChecked() {
        let items = this.originalItems.filter(c => c.Checked);
        if (items) {
            let Ids: string[] = [];
            items.forEach((item: any) => {
                Ids.push(item.Id);
            });
            let data = {
                'ids': Ids,
                'adminUserId': this.authen.account.Id,
            };
            this.dialogService.Confirm('Có phải bạn muốn xóa dữ liệu tag này?', async () => {
                return await this.service.callApi('MSSeo', 'DeleteTags', data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Xóa tag thành công');
                        await this.loadItems();
                        return true;
                    }
                    ToastrHelper.ErrorResult(result);
                    return false;
                }, (e: any) => {
                    ToastrHelper.Exception(e);
                    return false;
                });
            });
        } else {
            ToastrHelper.Error('Chưa chọn tag để xóa');
            return false;
        }
    }

    import() {
        this.dialogService.WapperAsync({
            cancelText: '',
            confirmText: '',
            title: 'Import tag',
            size: ModalSizeType.Medium,
            object: ImportTagComponent,
        });
    }

    export() {
        this.dialogService.WapperAsync({
            cancelText: '',
            confirmText: '',
            title: 'Export tag',
            size: ModalSizeType.Medium,
            object: ExportTagComponent,
            objectExtra: { itemData: this.itemData },
        });
    }
}

@NgModule({
    imports: [
        CommonModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: SeoComponent, pathMatch: 'full', data: { state: 'ms_seo' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: AddTagComponent, pathMatch: 'full', data: { state: 'ms_seo_add' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditTagComponent, pathMatch: 'full', data: { state: 'ms_seo_view' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditTagComponent, pathMatch: 'full', data: { state: 'ms_seo_edit' }, canActivate: [AdminAuthGuard] },
            { path: 'files', component: FileImportComponent, pathMatch: 'full', data: { state: 'ms_seo_files' }, canActivate: [AdminAuthGuard] },
            { path: 'metaseo', component: MSMetaSeoComponent, pathMatch: 'full', data: { state: 'ms_meta_seo' }, canActivate: [AdminAuthGuard] },
            { path: 'metaseov2', component: MSMetaSeoV2Component, pathMatch: 'full', data: { state: 'ms_meta_seo_v2' }, canActivate: [AdminAuthGuard] },
            { path: 'filetags', component: TagFileImportComponent, pathMatch: 'full', data: { state: 'ms_seo_tags' }, canActivate: [AdminAuthGuard] },
            { path: 'shortcode', component: ShortCodeComponent, pathMatch: 'full', data: { state: 'ms_seo_shortcode' }, canActivate: [AdminAuthGuard] },
            { path: 'metaseo/edit', component: EditMetaSeoComponent, pathMatch: 'full', data: { state: 'ms_meta_seo_edit' }, canActivate: [AdminAuthGuard] },
            { path: 'metaseov2/edit', component: EditMetaSeoV2Component, pathMatch: 'full', data: { state: 'ms_meta_seo_v2_edit' }, canActivate: [AdminAuthGuard] },
            { path: 'textlinkauto', component: TextLinkComponent, pathMatch: 'full', data: { state: 'ms_seo_textlink_auto' }, canActivate: [AdminAuthGuard] },
            { path: 'boxtextlink', component: MSBoxTextLinkComponent, pathMatch: 'full', data: { state: 'ms_seo_box_textlink' }, canActivate: [AdminAuthGuard] },
            { path: 'textlinkmanual', component: TextLinkComponent, pathMatch: 'full', data: { state: 'ms_seo_textlink_manual' }, canActivate: [AdminAuthGuard] },
        ]),
    ],
    declarations: [
        SeoComponent,
        AddTagComponent,
        EditTagComponent,
        TextLinkComponent,
        MSMetaSeoComponent,
        ImportTagComponent,
        ExportTagComponent,
        ShortCodeComponent,
        EditSyntaxComponent,
        FileImportComponent,
        MSStructureComponent,
        AddTextLinkComponent,
        EditMetaSeoComponent,
        MSMetaSeoV2Component,
        AddStructureComponent,
        MSPropertiesComponent,
        AddShortCodeComponent,
        AddPropertiesComponent,
        EditMetaSeoV2Component,
        TagFileImportComponent,
        MSBoxTextLinkComponent,
        ImportTextLinkComponent,
        MSListImportTagComponent,
        MSMetaSeoHistoryComponent,
        MSListTagHistoryComponent,
        MSAlertImportTagComponent,
        MSListTagApproveComponent,
        MSPropertiesChildComponent,
        EditConfigTextLinkComponent,
        MSConfirmImportTagComponent,
        MSListAlertImportTagComponent,
        MSListImportTextLinkComponent,
        MSMetaSeoV2HistoryComponent
    ],
    providers: [MSSeoService]
})
export class MSSeoModule { }
