import * as _ from 'lodash';
import { Component, OnInit } from "@angular/core";
import { AppConfig } from "../../../_core/helpers/app.config";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { EditProjectInvestorComponent } from "./edit/edit.project.investor.component";
import { UploadProjectInvestorComponent } from './upload/upload.project.investor.component';
import { MPOProjectInvestorEntity } from "../../../_core/domains/entities/meeyproject/mpo.project.investor.entity";
import { PopupViewImageComponent } from "../../../_core/editor/upload.image/popup.view.image/popup.view.image.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class ProjectInvestorComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Actions: [
            ActionData.edit((item: any) => this.edit(item)),
            {
                name: 'Upload logo',
                icon: 'la la-upload',
                systemName: ActionType.Upload,
                className: 'btn btn-warning',
                click: (item: any) => {
                    this.choiceFile(item, {
                        customUpload: {
                            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
                            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
                            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
                            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
                        },
                        size: 10,
                        dataType: DataType.Image,
                    });
                }
            }
        ],
        Features: [
            {
                icon: 'la la-upload',
                name: 'Import danh sách CĐT',
                className: 'btn btn-primary',
                systemName: ActionType.Upload,
                click: () => {
                    this.upload();
                }
            },
            ActionData.addNew(() => this.addNew()),
            ActionData.reload(() => this.loadItems()),
        ],
        UpdatedBy: false,
        DisableAutoLoad: true,
        HideCustomFilter: true,
        SearchText: 'Nhập tên chủ đầu tư',
        Reference: MPOProjectInvestorEntity,
    };

    constructor() {
        super();
    }

    async ngOnInit(): Promise<void> {
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'Name', Title: 'Tên chủ đầu tư', Type: DataType.String, DisableOrder: true },
            { Property: 'Description', Title: 'Giới thiệu', Type: DataType.String, DisableOrder: true },
            {
                Property: 'Logo', Title: 'Logo', Type: DataType.String, DisableOrder: true, Align: 'center',
                Format: (item) => {
                    if (!item.Logo) return '';
                    let text = '';
                    if (item.Logo?.url) {
                        let image = item.Logo?.url;
                        text = '<a routerLink="quickView" type="images"><img style="width: 60px; margin-right: 10px;" src="' + image + '" /></a>';
                    }
                    return text;
                }
            },
            { Property: 'CreatedBy', Title: 'Người tạo', Type: DataType.String, DisableOrder: true },
            { Property: 'CreatedAt', Title: 'Ngày tạo', Type: DataType.DateTime, DisableOrder: true },
            { Property: 'UpdatedBy', Title: 'Người cập nhật', Type: DataType.String, DisableOrder: true },
            { Property: 'UpdatedAt', Title: 'Ngày cập nhật', Type: DataType.DateTime, DisableOrder: true },
        ];
        this.render(this.obj);
    }

    upload() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Medium,
            title: 'Import thông tin chủ đầu tư',
            object: UploadProjectInvestorComponent
        }, async (item: any) => {
            await this.loadItems()
        });
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Medium,
            title: 'Thêm mới Chủ đầu tư',
            className: 'modal-body-project',
            object: EditProjectInvestorComponent,
        }, async (item: any) => {
            await this.loadItems()
        });
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Xác nhận',
            title: 'Sửa Chủ đầu tư',
            size: ModalSizeType.Medium,
            className: 'modal-body-project',
            object: EditProjectInvestorComponent,
            objectExtra: {
                id: item.Id,
            }
        }, async (item: any) => {
            await this.loadItems()
        });
    }

    view(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Xem Chủ đầu tư',
            size: ModalSizeType.Medium,
            className: 'modal-body-project',
            object: EditProjectInvestorComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
    }

    quickView(item: any, type: string) {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem) {
            if (type && type == 'images') {
                this.quickViewImages(originalItem);
            }
        }
    }

    private quickViewImages(item: any) {
        let images = item.Logo && item.Logo?.url;
        if (images && images.length > 0) {
            this.dialogService.WapperAsync({
                title: 'Xem ảnh',
                cancelText: 'Đóng',
                size: ModalSizeType.ExtraLarge,
                object: PopupViewImageComponent,
                objectExtra: { images: [images] },
            });
        }
    }

    public async readFile(item: any, resultUploads: any[]): Promise<void> {
        if (resultUploads && resultUploads.length > 0) {

            let cloneItem = _.cloneDeep(item)
            cloneItem.Logo = resultUploads
                .map(c => c.images && Array.isArray(c.images) ? c.images[0] : c)[0];

            await this.service.callApi('mpoprojectInvestor', 'addOrUpdate', cloneItem, MethodType.Post).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Upload logo thành công!');
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
            this.loadItems();
        }
    }
}