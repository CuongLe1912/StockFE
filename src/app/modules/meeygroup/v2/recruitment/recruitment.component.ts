import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { OrderType } from "../../../../_core/domains/enums/order.type";
import { BaseEntity } from "../../../../_core/domains/entities/base.entity";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import {MgRecruitmentEntity} from "../../../../_core/domains/entities/meeygroup/v2/mg.recruitment.entity";
import {OptionItem} from "../../../../_core/domains/data/option.item";
import {ConstantHelper} from "../../../../_core/helpers/constant.helper";
import {ActionType} from "../../../../_core/domains/enums/action.type";
import {ModalExportDataComponent} from "../../../../_core/modal/export.data/export.data.component";
import {ExportType} from "../../../../_core/domains/enums/export.type";
import {MgRecruitmentStatusType} from "../../../../_core/domains/entities/meeygroup/enums/mg.recruitment.type";
import {ResultApi} from "../../../../_core/domains/data/result.api";
import {ToastrHelper} from "../../../../_core/helpers/toastr.helper";
import {RecruitmentService} from "./recruitment.service";
import {AppInjector} from "../../../../app.module";
import {AppConfig} from "../../../../_core/helpers/app.config";

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class RecruitmentComponent extends GridComponent implements OnInit {
    recruitmentService: RecruitmentService;
    obj: GridData = {
        Imports: [],
        Exports: [],
        MoreFeatures: {
            Name: "Xuất dữ liệu",
            Icon: "la la-download",
            Actions: [{
                name: 'Excel',
                icon: "la la-file-excel-o",
                systemName: ActionType.Export,
                click: () => {
                    this.dialogService.WapperAsync({
                        confirmText: 'Xuất dữ liệu',
                        title: 'Xuất dữ liệu [Excel]',
                        object: ModalExportDataComponent,
                        objectExtra: {
                            Data: this.itemData,
                            Type: ExportType.Excel,
                            Reference: MgRecruitmentEntity,
                        }
                    });
                },
            }],
        },
        Actions: [
            {
                icon: 'la la-upload',
                name: ActionType.RePostArticle,
                systemName: ActionType.RePostArticle,
                className: 'btn btn-success',
                hidden: (item: MgRecruitmentEntity) => {
                    return item.Status == MgRecruitmentStatusType.Active || item.Status == MgRecruitmentStatusType.Pending
                },
                click: (item: MgRecruitmentEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.repost(originalItem);
                }
            },
            {
                icon: 'la la-upload',
                name: ActionType.PublishRecruitment,
                systemName: ActionType.PublishRecruitment,
                className: 'btn btn-success',
                hidden: (item: MgRecruitmentEntity) => {
                    return item.Status !== MgRecruitmentStatusType.Pending
                },
                click: (item: MgRecruitmentEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.publish(originalItem);
                }
            },
            {
                icon: 'la la-eye',
                name: ActionType.View,
                systemName: ActionType.View,
                className: 'btn btn-warning',
                click: (item: any) => {
                    this.view(item)
                }
            },
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Edit,
                className: 'btn btn-primary',
                click: (item: any) => {
                    this.edit(item)
                }
            },
            {
                icon: 'la la-ban',
                name: ActionType.PausePublish,
                systemName: ActionType.PausePublish,
                className: 'btn btn-danger',
                hidden: (item: MgRecruitmentEntity) => {
                    return item.Status !== MgRecruitmentStatusType.Active
                },
                click: (item: MgRecruitmentEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.pause(originalItem);
                }
            },
            {
                icon: 'la la-recycle',
                className: 'btn btn-danger',
                name: ActionType.Delete,
                systemName: ActionType.Delete,
                hidden: (item: MgRecruitmentEntity) => {
                    return item.Status === MgRecruitmentStatusType.Active
                },
                click: ((item: MgRecruitmentEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.deleteRecruitment(originalItem);
                })
            },
        ],
        Filters: [],
        Reference: MgRecruitmentEntity,
        CustomFilters: ['CreatedDate','PublishDate', 'ExpireDate', 'Status', 'TypeId'],
        SearchText: 'Tìm kiếm tên tin tuyển dụng, người đăng',
        PageSizes: [5, 10, 20, 50, 100],
        UpdatedBy: false,
    };

    constructor() {
        super();
        this.recruitmentService = AppInjector.get(RecruitmentService);
        this.setOrder([{ Name: 'Id', Type: OrderType.Desc }]);
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            { Property: 'TitleVn', Title: 'Tên tin tuyển dụng', Type: DataType.String },
            { Property: 'TypeId', Title: 'Loại tin', Type: DataType.String,
                Format: ((item: any) => {
                    let option: OptionItem = ConstantHelper.MG_RECRUITMENT_TYPES.find((c) => c.value == item.TypeId);
                    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
                    return text
                })
            },
            { Property: 'StatusName', Title: 'Trạng thái', Type: DataType.String,
                Format: ((item: MgRecruitmentEntity) => {
                    let option: OptionItem = ConstantHelper.MG_RECRUITMENT_STATUS_TYPES.find((c) => c.value == item.Status);
                    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
                    return text
                })
            },
            { Property: 'CreatedDate', Title: 'Ngày tạo', Type: DataType.DateTime },
            { Property: 'PublishDate', Title: 'Ngày đăng tin', Type: DataType.DateTime },
            { Property: 'ExpireDate', Title: 'Ngày hết hạn', Type: DataType.DateTime },
            { Property: 'CreatedBy', Title: 'Người đăng', Type: DataType.String, Active: false, ColumnWidth: 200,
                Format: ((item: MgRecruitmentEntity) => {
                    return this.getCreateBy(item.CreatedBy)
                })
            },
            { Property: 'ApplicantAmount', Title: 'Số người ứng tuyển', Type: DataType.String},
        ];
    }

    ngOnInit() {
        this.setPageSize(20);
        this.render(this.obj);
    }

    getCreateBy(item) {
        if (item == null) return "Admin"
        if (item.includes('@')) return item
        let option: OptionItem = ConstantHelper.MP_TRANSACTION_AUTHOR_TYPES.find((c) => c.value == item);
        if (option === undefined) {
            return item
        }
        return option.label;
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/meeygroupv2/recruitment',
        };
        this.router.navigate(['/admin/meeygroupv2/recruitment/add'], { state: { params: JSON.stringify(obj) } });
    }
    view(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/meeygroupv2/recruitment',
        };
        let url = `${AppConfig.MeeyGroupConfig.Url}/tuyen-dung/preview/${obj.object.SlugVn}`
        window.open(url, "_blank");
    }
    edit(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            prevData: this.itemData,
            prevUrl: '/admin/meeygroupv2/recruitment',
        };
        this.router.navigateByUrl('/admin/meeygroupv2/recruitment/edit?id=' + item.Id, { state: { params: JSON.stringify(obj) } });
    }
    repost(item: any) {
        this.dialogService.ConfirmAsync('Bạn chắc chắn đăng tin tuyển dụng này', async () => {
            await this.recruitmentService.repost(item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Đăng lại tin thành công, tin đăng sẽ tự động hết hạn sau 30 ngày');
                    this.loadItems();
                } else {
                    setTimeout(() => {
                        let message = result.Description;
                        this.dialogService.Alert('Thông báo', message);
                    }, 300);
                }
            });
        }, null, 'Đăng lại');
    }
    publish(item: any) {
        this.dialogService.ConfirmAsync('Bạn chắc chắn đăng tin tuyển dụng này', async () => {
            await this.recruitmentService.publish(item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Đăng tin tuyển dụng thành công!');
                    this.loadItems();
                } else {
                    setTimeout(() => {
                        let message = result.Description;
                        this.dialogService.Alert('Thông báo', message);
                    }, 300);
                }
            });
        }, null, 'Đăng tin');
    }
    pause(item: any) {
        this.dialogService.ConfirmAsync('Bạn có chắc chắn dừng đăng tin tuyển dụng', async () => {
            await this.recruitmentService.pause(item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Dừng đăng tin thành công');
                    this.loadItems();
                } else {
                    setTimeout(() => {
                        let message = result.Description;
                        this.dialogService.Alert('Thông báo', message);
                    }, 300);
                }
            });
        }, null, 'Dừng đăng tin');
    }
    deleteRecruitment(item: any) {
        this.dialogService.ConfirmAsync('Bạn có chắc chắn xóa đăng tin tuyển dụng', async () => {
            await this.recruitmentService.deleteRecruitment(item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Đã xóa tin tuyển dụng');
                    this.loadItems();
                } else {
                    setTimeout(() => {
                        let message = result.Description;
                        this.dialogService.Alert('Thông báo', message);
                    }, 300);
                }
            });
        }, null, 'Xóa tin');
    }
    public setUrlState(state: NavigationStateData, controller: string = null) {
        if (!controller) controller = this.getController();
        let stateKey = 'params',
            navigation = this.router.getCurrentNavigation(),
            sessionKey = 'session_' + stateKey + '_' + controller;
        if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state));
    }
}
