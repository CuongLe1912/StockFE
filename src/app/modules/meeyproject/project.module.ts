import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AppInjector } from "../../app.module";
import { UtilityModule } from "../utility.module";
import { MPOProjectService } from "./project.service";
import { Component, NgModule, OnInit } from "@angular/core";
import { GridData } from "../../_core/domains/data/grid.data";
import { DataType } from "../../_core/domains/enums/data.type";
import { ResultApi } from "../../_core/domains/data/result.api";
import { ActionData } from "../../_core/domains/data/action.data";
import { AdminAuthGuard } from "../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../_core/components/grid/grid.component";
import { ListProjectComponent } from "./components/list.project.component";
import { AlertVideoComponent } from "./project.video/alert/alert.component";
import { ProjectTypeComponent } from "./project.type/project.type.component";
import { NavigationStateData } from "../../_core/domains/data/navigation.state";
import { ActionType, ControllerType } from "../../_core/domains/enums/action.type";
import { ProjectCategoryComponent } from "./project.category/project.category.component";
import { ProjectInvestorComponent } from "./project.investor/project.investor.component";
import { MPOViewProjectMapComponent } from "./view.project.map/view.project.map.component";
import { EditProjectTypeComponent } from "./project.type/edit/edit.project.type.component";
import { EditProjectVideoComponent } from "./project.video/edit/edit.project.video.component";
import { MPCheckArticleModel, MPOProjectEntity } from "../../_core/domains/entities/meeyproject/mpo.project.entity";
import { ProjectContributeComponent } from "./project.contribute/project.contribute.component";
import { EditProjectInvestorComponent } from "./project.investor/edit/edit.project.investor.component";
import { EditProjectCategoryComponent } from "./project.category/edit/edit.project.category.component";
import { MPOGalleryProjectImageComponent } from "./components/gallery.project.image/gallery.project.image.component";
import { ProjectHashtagsComponent } from "./project.hashtags/project.hashtags.component";
import { ProjectViolationTypeComponent } from "./project.violation.type/project.violation.type.component";
import { EditProjectViolationTypeComponent } from "./project.violation.type/edit/edit.project.violation.type.component";
import { ProjectVerifyDocumentComponent } from "./project.verify.document/project.verify.document.component";
import { EditProjectVerifyDocumentComponent } from "./project.verify.document/edit/edit.project.verify.document.component";
import { UploadProjectInvestorComponent } from "./project.investor/upload/upload.project.investor.component";
import { MPOGridImportInvestorComponent } from "./project.investor/upload/components/grid.import.component";
import { MPOArchiveProjectImageComponent } from "./components/archive.project.image/archive.project.image.component";
import { MPOArchiveProjectFileComponent } from "./components/archive.project.files/archive.project.files.component";
import { MPOReviewContributeComponent } from "./project.review.contribute/project.review.contribute";
import { ViewProjectReviewContributeComponent } from "./project.review.contribute/view/view.project.review.contribute.component";
import { EditProjectCustomerComponent } from "./project.customer/edit/edit.project.customer.component";
import { ProjectCustomerComponent } from "./project.customer/project.customer.component";
import MPOProjectVideosComponent from "./project.video/project.video.component";
import { MPOImportProjectComponent } from "./components/import.project/import.project.component";
import { MPOAddProjectComponent } from "./add.project/add.project.component";
import { MPOProjectInfoComponent } from "./add.project/project.info/project.info.component";
import { MPOProjectLocationComponent } from "./add.project/project.location/project.location.component";
import { MPOProjectUtilitiesComponent } from "./add.project/project.utilities/project.utilities.component";
import { MPOProjectSalePolicyComponent } from "./add.project/project.sale.policy/project.sale.policy.component";
import { MPOProjectConstructionComponent } from "./add.project/project.construction.progress/project.construction.progress.component";
import { MPOProjectPaymentProgressComponent } from "./add.project/project.payment.progress/project.payment.progress.component";
import { MPOProjectImageComponent } from "./add.project/project.image/project.image.component";
import { MPOProjectFilesComponent } from "./add.project/project.files/project.files.component";
import { MPOProjectFilesGridComponent } from "./add.project/project.files/components/project.files.grid.component";
import { MPOEditTitleProjectFilesComponent } from "./add.project/project.files/components/edit.title.project.files/edit.title.project.files.component";
import { MPOProjectInvestorRelatedComponent } from "./add.project/project.investor.related/project.investor.related.component";
import { MPOProjectJuridicalComponent } from "./add.project/project.juridical/project.juridical.component";
import { MPOProjectInvestorRelatedComponentUnitComponent } from "./add.project/project.investor.related/project.investor.related.unit/project.investor.related.unit.component";
import { VideoProjectDetailComponent } from "./project.video/detail/video.project.detail.component";
import { MPOProjectUploadVideoComponent } from "./add.project/project.upload.video/project.upload.video.component";
import { InvestorUnitService } from "./project.investor.unit/mpo.investor.unit.service";
import { SearchSlideVideoComponent } from "./project.slide.video/search.project.slide.video/search.slide.video.component";
import { MPOProjectSlideVideosComponent } from "./project.slide.video/project.slide.video.component";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { VideoDetailComponent } from "./project.video/detail.video/video.detail.component";
import { VimeModule } from "@vime/angular";
import MPOProjectVideoItemComponent from "./project.video/components/project.video.item.component";
import MPOProjectVideosGridComponent from "./project.video/project.video.grid.component";
import { MethodType } from "../../_core/domains/enums/method.type";
import { HttpEventType } from "@angular/common/http";
import { ToastrHelper } from "../../_core/helpers/toastr.helper";
import { DeleteProjectComponent } from "./delete.project/delete.project.component";
import { Select2Module } from "ng-select2-component";
import { OverlayModule } from "@angular/cdk/overlay";
import { MPODeleteType } from "src/app/_core/domains/entities/meeyproject/enums/mpo.delete.type";

@Component({
    templateUrl: '../../_core/components/grid/grid.component.html',
})
export class ProjectComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Actions: [
            {
                icon: 'la la-eye',
                name: ActionType.ViewDetail,
                className: 'btn btn-warning',
                systemName: ActionType.ViewDetail,
                click: (item: any) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.view(originalItem);
                },
            },
            ActionData.edit((item) => {
                let originalItem = this.originalItems.find(c => c.Id == item.Id);
                this.edit(originalItem);
            }),
            {
                name: 'Bỏ công khai',
                icon: 'la la-download',
                className: 'btn btn-danger',
                systemName: ActionType.Cancel,
                hidden: (item: any) => {
                    return item.PublishPrev == "Không công khai";
                },
                click: (item: any) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    location.href.indexOf('/land') > 0 ? this.unpublishProduct(originalItem, 'dataMeeyland') : this.unpublish(originalItem);
                }
            },            
            {
                name: 'Công khai',
                icon: 'la la-upload',
                className: 'btn btn-danger',
                systemName: ActionType.Approve,
                hidden: (item: any) => {
                    return item.PublishPrev == "Công khai";
                },
                click: (item: any) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    location.href.indexOf('/land') > 0 ? this.publishProduct(originalItem, 'dataMeeyland') : this.publish(originalItem);
                }
            },
            {
                name: 'Xóa',
                icon: 'la la-remove',
                className: 'btn btn-danger',
                systemName: ActionType.Delete,
                click: (item: any) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.delete(originalItem)
                }
            },
        ],
        Features: [
            {
                icon: 'la la-plus',
                name: 'Tạo nhanh dự án',
                click: () => this.addNew(),
                className: 'btn btn-primary',
                systemName: ActionType.AddNew,
            },
            {
                name: 'Tải video dự án',
                icon: 'la la-file-video-o',
                className: 'btn btn-success',
                click: () => this.addNewVideo(),
                systemName: ActionType.UploadVideo,
                controllerName: ControllerType.MPOProject,
            },
            {
                icon: 'la la-upload',
                name: 'Import',
                className: 'btn btn-warning',
                systemName: ActionType.Import,
                click: () => {
                    this.import();
                }
            },
            {
                name: 'Xuất dữ liệu',
                icon: 'la la-download',
                className: 'btn btn-info',
                systemName: ActionType.Export,
                click: () => {
                    this.export();
                }
            },
            ActionData.reload(() => this.loadItems()),
        ],
        UpdatedBy: false,
        DisableAutoLoad: true,
        Reference: MPOProjectEntity,
        SearchText: 'Nhập tên thương mại dự án',
        CustomFilters: ['CityId', 'DistrictId', 'WardId', 'StreetId', 'ProjectTypeId', 'ProjectStatusId', 'InvestorIds', 'PublishStatusId', 'FilterCreatedBy', 'FilterCreatedAt', 'FilterUpdateBy', 'FilterUpdateAt']
    };
    projectService: MPOProjectService;
    listMPCheckArticleModel : MPCheckArticleModel[] = []
    typeDeleteProject: MPODeleteType;
    constructor() {
        super();
        this.projectService = AppInjector.get(MPOProjectService);
    }

    async ngOnInit(): Promise<void> {
        let url = location.href;
        if (url.indexOf('/land') > 0) {
            let api = '/admin/mpoproject/items?project=dataMeeyland';
            this.obj.Url = api;
            this.obj.Features = [ActionData.reload(() => this.loadItems()),];
        }

        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'TradeName', Title: 'Tên dự án', Type: DataType.String, DisableOrder: true },
            { Property: 'City', Title: 'Tỉnh/Thành phố', Type: DataType.String, DisableOrder: true },
            { Property: 'District', Title: 'Quận/Huyện', Type: DataType.String, DisableOrder: true },
            { Property: 'Ward', Title: 'Phường/Xã', Type: DataType.String, DisableOrder: true },
            { Property: 'Street', Title: 'Đường/Phố', Type: DataType.String, DisableOrder: true },
            { Property: 'ProjectTypes', Title: 'Loại dự án', Type: DataType.String, DisableOrder: true },
            {
                Property: 'InvestorName', Title: 'Chủ đầu tư', Type: DataType.String, DisableOrder: true,
                Format: (item) => {
                    if (!item?.InvestorRelated?.investor) return '';
                    return item.InvestorRelated?.investor?.name;
                }
            },
            { Property: 'CreatedAt', Title: 'Ngày tạo', Type: DataType.DateTime },
            { Property: 'CreatedBy', Title: 'Người tạo', Type: DataType.String, DisableOrder: true },
            { Property: 'UpdatedAt', Title: 'Ngày sửa', Type: DataType.DateTime },
            { Property: 'UpdatedBy', Title: 'Người sửa', Type: DataType.String, DisableOrder: true },
            { Property: 'ProjectStatus', Title: 'Trạng thái dự án', Type: DataType.String, DisableOrder: true },
            {
                Property: 'Publish', Title: 'Trạng thái hiển thị', Type: DataType.String, DisableOrder: true,
                Format: (item) => {
                    item['PublishPrev'] = item['Publish'];
                    let text = '<p>' + item?.Publish + '</p>'
                    if (url.indexOf('/land') > 0) {
                        item.PublishPrev = item.DataMeeyland?.isPublished ? 'Công khai' : 'Không công khai'
                        text = item.DataMeeyland?.isPublished ? '<p>Công khai</p>' : '<p>Không công khai</p>';
                    }
                    return text;
                }
            },
        ];
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            viewer: false,
            object: {
                isAddNew: true,
            },
            prevData: this.itemData,
            prevUrl: "/admin/mpoproject",
        };
        this.router.navigate(["/admin/mpoproject/add"], {
            state: { params: JSON.stringify(obj) },
        });
    }

    addNewVideo() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Tải lên',
            size: ModalSizeType.Large,
            title: 'Thêm mới Video dự án',
            className: 'modal-body-project',
            object: EditProjectVideoComponent,
        }, async (item: any) => {
            if (item && typeof (item) == 'string') {
                let url = item;
                setTimeout(() => {
                    this.dialogService.WapperAsync({
                        cancelText: '',
                        confirmText: 'OK',
                        title: 'Thành công',
                        objectExtra: {
                            url: url
                        },
                        size: ModalSizeType.Medium,
                        object: AlertVideoComponent,
                    });
                })
            }
        });
    }

    view(item: any) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            object: {
                isProduct: location.href.indexOf('/land') > 0 ? true : false,
                productName: location.href.indexOf('/land') > 0 ? 'Meey Land' : ''
            },
            prevData: this.itemData,
            prevUrl: "/admin/mpoproject",
        };
        this.router.navigate(["/admin/mpoproject/view"], {
            state: { params: JSON.stringify(obj) },
        });
    }

    edit(item: any) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: {
                isProduct: location.href.indexOf('/land') > 0 ? true : false,
                productName: location.href.indexOf('/land') > 0 ? 'Meey Land' : ''
            },
            viewer: false,
            prevData: this.itemData,
            prevUrl: "/admin/mpoproject",
        };
        this.router.navigate(["/admin/mpoproject/edit"], {
            state: { params: JSON.stringify(obj) },
        });
    }

    publish(item: any) {
        let id = item.Id;
        this.loading = true;
        this.loadingText = 'Đang kiểm tra thông tin dự án...';
        this.projectService.checkPublish(id).then(async (result: ResultApi) => {
            this.loading = false;
            this.loadingText = '';
            if (ResultApi.IsSuccess(result)) {
                this.dialogService.ConfirmAsync('Có phải bạn muốn Công khai dự án: <b>' + item.TradeName + '</b>', async () => {
                    await this.projectService.publish(id).then(async (result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                            await this.loadItems();
                            setTimeout(() => {
                                this.dialogService.Success('Công khai dự án thành công', 'Công khai');
                            }, 500);
                        } else {
                            let message = result.Description;
                            setTimeout(() => {
                                this.dialogService.ConfirmAsync(message, async () => {
                                    this.view(item);
                                }, null, 'Công khai', 'Cập nhật thông tin');
                            }, 500)
                        }
                    });
                }, null, 'Công khai', 'Xác nhận');
            } else {
                let message = result.Description;
                setTimeout(() => {
                    this.dialogService.ConfirmAsync(message, async () => {
                        this.view(item);
                    }, null, 'Công khai', 'Cập nhật thông tin');
                }, 500)
            }
        });
    }

    unpublish(item: any) {
        this.dialogService.ConfirmAsync('Bạn có chắc chắn muốn bỏ trạng thái công khai của dự án: <b>' + item.TradeName + '</b>', async () => {
            let id = item.Id;
            await this.projectService.unpublish(id).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    await this.loadItems();
                    setTimeout(() => {
                        this.dialogService.Success('Bỏ công khai dự án thành công', 'Thông báo');
                    }, 500);
                } else {
                    setTimeout(() => {
                        this.dialogService.ErrorResult(result);
                    }, 500);
                }
            });
        }, null, 'Bỏ công khai', 'Xác nhận');
    }

    publishProduct(item: any, product: string) {
        let id = item.Id;
        let data = {
            "updatedBy": {
                "data": {
                    "_id": this.authen.account.Id,
                    "fullname": this.authen.account.FullName
                },
                "source": 'admin',
            },
            "isPublished": true,
            "project": product,
        };
        this.dialogService.ConfirmAsync('Có phải bạn muốn Công khai dự án: <b>' + item.TradeName + '</b>', async () => {
            await this.service.callApi('MPOProject', 'UpdateInformationProduct/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    await this.loadItems();
                    setTimeout(() => {
                        this.dialogService.Success('Công khai dự án thành công', 'Công khai');
                    }, 500);
                } else {
                    let message = result.Description;
                    setTimeout(() => {
                        this.dialogService.ConfirmAsync(message, async () => {
                            this.view(item);
                        }, null, 'Công khai', 'Cập nhật thông tin');
                    }, 500)
                }
            });
        }, null, 'Công khai', 'Xác nhận');

    }

    unpublishProduct(item: any, product: string) {
        let id = item.Id;
        let data = {
            "updatedBy": {
                "data": {
                    "_id": this.authen.account.Id,
                    "fullname": this.authen.account.FullName
                },
                "source": 'admin',
            },
            "isPublished": false,
            "project": product,
        };
        this.dialogService.ConfirmAsync('Bạn có chắc chắn muốn bỏ trạng thái công khai của dự án: <b>' + item.TradeName + '</b>', async () => {
            await this.service.callApi('MPOProject', 'UpdateInformationProduct/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    await this.loadItems();
                    setTimeout(() => {
                        this.dialogService.Success('Bỏ công khai dự án thành công', 'Thông báo');
                    }, 500);
                } else {
                    setTimeout(() => {
                        this.dialogService.ErrorResult(result);
                    }, 500);
                }
            });
        }, null, 'Bỏ công khai', 'Xác nhận');
    }

    import() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Medium,
            title: 'Import thông tin dự án',
            object: MPOImportProjectComponent
        }, async (item: any) => {
            await this.loadItems()
        });
    }

    async export() {
        if (this.items && this.items.length > 0) {
            this.loading = true;
            let urlExport = '/admin/MPOProject/ExportData/';
            let fileName = "Danh_sach_du_an_" + new Date().getTime();
            return this.service.downloadFileByUrl(urlExport, this.itemData).toPromise().then(data => {
                this.loading = false
                switch (data.type) {
                    case HttpEventType.DownloadProgress:
                        break;
                    case HttpEventType.Response:
                        let extension = 'xlsx';
                        const downloadedFile = new Blob([data.body], { type: data.body.type });
                        const a = document.createElement('a');
                        a.setAttribute('style', 'display:none;');
                        document.body.appendChild(a);
                        a.download = fileName + '.' + extension;
                        a.href = URL.createObjectURL(downloadedFile);
                        a.target = '_blank';
                        a.click();
                        document.body.removeChild(a);
                        break;
                }
                return true;
            }).catch(ex => {
                this.loading = false;
            });
        } else {
            ToastrHelper.Error('Không có dữ liệu xuất excel');
        }
    }

    async delete(item: any){
        this.loading = true;
        const result = await this.projectService.checkExistsProject(item.Id);
        if (ResultApi.IsSuccess(result)) {
            this.loading = false;
            if(result.Object != null){
                this.listMPCheckArticleModel = result.Object as MPCheckArticleModel[]
                if(this.listMPCheckArticleModel.filter(x => x.IsExists == true).length == 0 ){
                    this.typeDeleteProject = MPODeleteType.Not_Exists_Projects
                    this.showPopupDelete(item.Id, this.typeDeleteProject, this.listMPCheckArticleModel.filter(x => x.IsExists == true))
                }
                  //Tồn tại ở các dự án khác nhưng chưa phát sinh bài đăng
                else if(this.listMPCheckArticleModel.filter(x => x.IsExists == true).length > 0 && this.listMPCheckArticleModel.filter(x => x.HasArticle == true).length == 0){
                    this.typeDeleteProject = MPODeleteType.Exists_Project
                    this.showPopupDelete(item.Id, this.typeDeleteProject, this.listMPCheckArticleModel.filter(x => x.IsExists == true))
                }
                //Nếu tồn tại ở các Dự án khác và có phát sinh bài đăng thì bắn thông báo là không cho xóa
                else if(this.listMPCheckArticleModel.filter(x => x.IsExists == true).length > 0 && this.listMPCheckArticleModel.filter(x => x.HasArticle == true).length > 0){
                    ToastrHelper.Error("Không thể xóa do dự án phát sinh tin đăng, bài viết... trên các ứng dụng khác")
                }

            }
        }
    }
    showPopupDelete(id: any, type: MPODeleteType, listMPCheckArticleModel){
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Medium,
            title: 'Xóa dự án',
            object: DeleteProjectComponent,
            objectExtra:{id:id, type: type, listMPCheckArticleModel: listMPCheckArticleModel},
        }, async (item: any) => {
            await this.loadItems()
        });
    }

}

@NgModule({
    imports: [
        VimeModule,
        DragDropModule,
        CommonModule,
        UtilityModule,        
        RouterModule.forChild([
            { path: '', component: ProjectComponent, pathMatch: 'full', data: { state: 'mpoproject' }, canActivate: [AdminAuthGuard] },
            { path: 'map', component: ProjectComponent, pathMatch: 'full', data: { state: 'mpoproject' }, canActivate: [AdminAuthGuard] },
            { path: 'land', component: ProjectComponent, pathMatch: 'full', data: { state: 'mpoproject' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: MPOAddProjectComponent, pathMatch: 'full', data: { state: 'add_mpoproject' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: MPOAddProjectComponent, pathMatch: 'full', data: { state: 'view_mpoproject' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: MPOAddProjectComponent, pathMatch: 'full', data: { state: 'edit_mpoproject' }, canActivate: [AdminAuthGuard] },
            { path: 'projecttype', component: ProjectTypeComponent, pathMatch: 'full', data: { state: 'mpoprojecttype' }, canActivate: [AdminAuthGuard] },
            { path: 'videov1', component: MPOProjectVideosComponent, pathMatch: 'full', data: { state: 'mpoprojectvideo' }, canActivate: [AdminAuthGuard] },
            { path: 'video', component: MPOProjectVideosGridComponent, pathMatch: 'full', data: { state: 'mpoprojectvideo_v2' }, canActivate: [AdminAuthGuard] },
            { path: 'slide', component: MPOProjectSlideVideosComponent, pathMatch: 'full', data: { state: 'mpoprojectslidevideo' }, canActivate: [AdminAuthGuard] },
            { path: 'slide/search', component: SearchSlideVideoComponent, pathMatch: 'full', data: { state: 'mpoprojectslidevideo' }, canActivate: [AdminAuthGuard] },
            { path: 'projectinvestor', component: ProjectInvestorComponent, pathMatch: 'full', data: { state: 'mpoprojectinvestor' }, canActivate: [AdminAuthGuard] },
            { path: 'customer', component: ProjectCustomerComponent, pathMatch: 'full', data: { state: 'mpocustomer' }, canActivate: [AdminAuthGuard] },
            { path: 'customer/view', component: EditProjectCustomerComponent, pathMatch: 'full', data: { state: 'edit_mpocustomer' }, canActivate: [AdminAuthGuard] },
            { path: 'contributes', component: ProjectContributeComponent, pathMatch: 'full', data: { state: 'mpoprojectcontribute' }, canActivate: [AdminAuthGuard] },
            { path: 'projectcategory', component: ProjectCategoryComponent, pathMatch: 'full', data: { state: 'mpoprojectcategory' }, canActivate: [AdminAuthGuard] },
            { path: 'hashtags', component: ProjectHashtagsComponent, pathMatch: 'full', data: { state: 'mpoprojecthashtags' }, canActivate: [AdminAuthGuard] },
            { path: 'violationtype', component: ProjectViolationTypeComponent, pathMatch: 'full', data: { state: 'mpoprojectviolationtype' }, canActivate: [AdminAuthGuard] },
            { path: 'verifydocument', component: ProjectVerifyDocumentComponent, pathMatch: 'full', data: { state: 'mpoprojectdocument' }, canActivate: [AdminAuthGuard] },
            { path: 'review-contribute', component: MPOReviewContributeComponent, pathMatch: 'full', data: { state: 'mporeviewcontribute' }, canActivate: [AdminAuthGuard] },
            { path: 'investor-type-unit', loadChildren: () => import('../../modules/meeyproject/project.investor.type/mpo.investor.type.module').then(m => m.InvestorTypeModule) },
            { path: 'investor-unit', loadChildren: () => import('../../modules/meeyproject/project.investor.unit/mpo.investor.unit.module').then(m => m.InvestorUnitModule) },
            { path: 'statistic', loadChildren: () => import('../../modules/meeyproject/statistic/statistic.module').then(m => m.MPOStatisticModule) },
        ]),
        Select2Module,
        OverlayModule,
    ],
    declarations: [
        ProjectComponent,
        AlertVideoComponent,
        MPOProjectInfoComponent,
        ListProjectComponent,
        MPOAddProjectComponent,
        ProjectTypeComponent,
        MPOProjectVideosComponent,
        MPOProjectSlideVideosComponent,
        SearchSlideVideoComponent,
        ProjectCategoryComponent,
        ProjectInvestorComponent,
        EditProjectTypeComponent,
        EditProjectVideoComponent,
        MPOViewProjectMapComponent,
        ProjectContributeComponent,
        EditProjectCategoryComponent,
        EditProjectInvestorComponent,
        MPOProjectLocationComponent,
        MPOProjectJuridicalComponent,
        MPOProjectImageComponent,
        MPOGalleryProjectImageComponent,
        MPOProjectFilesComponent,
        MPOProjectFilesGridComponent,
        MPOEditTitleProjectFilesComponent,
        ProjectHashtagsComponent,
        ProjectViolationTypeComponent,
        EditProjectViolationTypeComponent,
        ProjectVerifyDocumentComponent,
        EditProjectVerifyDocumentComponent,
        MPOProjectSalePolicyComponent,
        UploadProjectInvestorComponent,
        MPOGridImportInvestorComponent,
        MPOArchiveProjectImageComponent,
        MPOArchiveProjectFileComponent,
        MPOReviewContributeComponent,
        MPOProjectConstructionComponent,
        MPOProjectInvestorRelatedComponent,
        MPOProjectPaymentProgressComponent,
        MPOProjectUtilitiesComponent,
        ViewProjectReviewContributeComponent,
        ProjectCustomerComponent,
        EditProjectCustomerComponent,
        VideoProjectDetailComponent,
        VideoDetailComponent,
        MPOImportProjectComponent,
        MPOProjectInvestorRelatedComponentUnitComponent,
        MPOProjectUploadVideoComponent,
        MPOProjectVideoItemComponent,
        MPOProjectVideosGridComponent,
        DeleteProjectComponent
    ],
    providers: [MPOProjectService, InvestorUnitService]
})
export class MPOProjectModule { }
