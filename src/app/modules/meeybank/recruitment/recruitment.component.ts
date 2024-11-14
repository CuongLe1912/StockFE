import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { OrderType } from "../../../_core/domains/enums/order.type";
import { BaseEntity } from "../../../_core/domains/entities/base.entity";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import {OptionItem} from "../../../_core/domains/data/option.item";
import {ConstantHelper} from "../../../_core/helpers/constant.helper";
import {ActionType} from "../../../_core/domains/enums/action.type";
import {ExportType} from "../../../_core/domains/enums/export.type";
import {ResultApi} from "../../../_core/domains/data/result.api";
import {ToastrHelper} from "../../../_core/helpers/toastr.helper";
import { MBankRecruitmentService } from "./recruitment.service";
import {AppInjector} from "../../../app.module";
import {AppConfig} from "../../../_core/helpers/app.config";
import { MBankRecruitmentEntity } from "src/app/_core/domains/entities/meeybank/mbank.recruitment.entity";
import { MBankRecruitmentStatusType } from "src/app/_core/domains/entities/meeybank/enums/mbank.recruitment.type";
import { DecoratorHelper } from "src/app/_core/helpers/decorator.helper";
import { TableData } from "src/app/_core/domains/data/table.data";
import { HttpEventType } from "@angular/common/http";
import * as _ from 'lodash';
import { ModalExportDataComponent } from "src/app/_core/modal/export.data/export.data.component";
import { MethodType } from "src/app/_core/domains/enums/method.type";
import { ActionData } from "src/app/_core/domains/data/action.data";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class RecruitmentComponent extends GridComponent implements OnInit {
    recruitmentService: MBankRecruitmentService;
    obj: GridData = {
        Imports: [],
        Exports: [],
        // MoreFeatures: {
        //     Name: "Xuất dữ liệu",
        //     Icon: "la la-download",
        //     Actions: [{
        //         name: 'Excel',
        //         icon: "la la-file-excel-o",
        //         systemName: ActionType.Export,
        //         click: () => {
        //             this.dialogService.WapperAsync({
        //                 confirmText: 'Xuất dữ liệu',
        //                 title: 'Xuất dữ liệu [Excel]',
        //                 object: ModalExportDataComponent,
        //                 objectExtra: {
        //                     Data: this.itemData,
        //                     Type: ExportType.Excel,
        //                     Reference: MBankRecruitmentEntity,
        //                 }
        //             });
        //         },
        //     }],
        // },
        Features: [
            {
                name: "Xuất dữ liệu",
                icon: "la la-download",
                className: 'btn btn-success',
                systemName: ActionType.Export,
                click: () => {
                    this.export()
                },
            },
            ActionData.addNew(()=> this.addNew()),
            ActionData.reload(() => this.loadItems())
        ],
        Actions: [
            {
                icon: 'la la-upload',
                name: ActionType.RePostArticle,
                systemName: ActionType.RePostArticle,
                className: 'btn btn-success',
                hidden: (item: MBankRecruitmentEntity) => {
                    return item.Status == MBankRecruitmentStatusType.Active || item.Status == MBankRecruitmentStatusType.Pending
                },
                click: (item: MBankRecruitmentEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.repost(originalItem);
                }
            },
            {
                icon: 'la la-upload',
                name: ActionType.PublishRecruitment,
                systemName: ActionType.PublishRecruitment,
                className: 'btn btn-success',
                hidden: (item: MBankRecruitmentEntity) => {
                    return item.Status !== MBankRecruitmentStatusType.Pending
                },
                click: (item: MBankRecruitmentEntity) => {
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
                hidden: (item: MBankRecruitmentEntity) => {
                    return item.Status !== MBankRecruitmentStatusType.Active
                },
                click: (item: MBankRecruitmentEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.pause(originalItem);
                }
            },
            {
                icon: 'la la-recycle',
                className: 'btn btn-danger',
                name: ActionType.Delete,
                systemName: ActionType.Delete,
                hidden: (item: MBankRecruitmentEntity) => {
                    return item.Status === MBankRecruitmentStatusType.Active
                },
                click: ((item: MBankRecruitmentEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.deleteRecruitment(originalItem);
                })
            },
        ],
        Filters: [],
        Reference: MBankRecruitmentEntity,
        CustomFilters: ['CreatedDate','PublishDate', 'ExpireDate', 'Status', 'TypeId'],
        SearchText: 'Tìm kiếm tên tin tuyển dụng, người đăng',
        PageSizes: [5, 10, 20, 50, 100],
        UpdatedBy: false,
    };

    constructor() {
        super();
        this.recruitmentService = AppInjector.get(MBankRecruitmentService);
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
                Format: ((item: MBankRecruitmentEntity) => {
                    let option: OptionItem = ConstantHelper.MG_RECRUITMENT_STATUS_TYPES.find((c) => c.value == item.Status);
                    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
                    return text
                })
            },
            { Property: 'CreatedDate', Title: 'Ngày tạo', Type: DataType.DateTime },
            { Property: 'PublishDate', Title: 'Ngày đăng tin', Type: DataType.DateTime },
            { Property: 'ExpireDate', Title: 'Ngày hết hạn', Type: DataType.DateTime },
            { Property: 'CreatedByText', Title: 'Người đăng', Type: DataType.String, ColumnWidth: 200},
            { Property: 'ApplicantAmount', Title: 'Số người ứng tuyển', Type: DataType.String},
        ];
    }

    ngOnInit() {
        this.setPageSize(20);
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/meeybank/recruitment',
        };
        this.router.navigate(['/admin/meeybank/recruitment/add'], { state: { params: JSON.stringify(obj) } });
    }
    
    view(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/meeybank/recruitment',
        };
        let url = `${AppConfig.MeeyFinanceConfig.Url}/tuyen-dung/${obj.object.SlugUrl}`
        window.open(url, "_blank");
    }
    edit(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            prevData: this.itemData,
            prevUrl: '/admin/meeybank/recruitment',
        };
        this.router.navigateByUrl('/admin/meeybank/recruitment/edit?id=' + item.Id, { state: { params: JSON.stringify(obj) } });
    }
    repost(item: any) {
        item.Status = MBankRecruitmentStatusType.Active
        this.dialogService.ConfirmAsync('Bạn chắc chắn đăng tin tuyển dụng này', async () => {
            await this.recruitmentService.repost(item).then((result: ResultApi) => {
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
        item.Status = MBankRecruitmentStatusType.Active
        this.dialogService.ConfirmAsync('Bạn chắc chắn đăng tin tuyển dụng này', async () => {
            await this.recruitmentService.publish(item).then((result: ResultApi) => {
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
        item.Status = MBankRecruitmentStatusType.Pause
        this.dialogService.ConfirmAsync('Bạn có chắc chắn dừng đăng tin tuyển dụng', async () => {
            await this.recruitmentService.pause(item).then((result: ResultApi) => {
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
    export() {
        this.loading = true;
        let table = DecoratorHelper.decoratorClass(this.obj.Reference),
          objData: TableData = _.cloneDeep(this.itemData);
        objData.Export = {
            Type: ExportType.Excel,
        }
        objData.Paging.Index = 1;
        objData.Paging.Pages = 1;
        objData.Paging.Size = 10000;
        objData.Name = "Danh sách tin tuyển dụng"
        let fileName = "Danh sách tin tuyển dụng_" + new Date().getTime();
        return this.service.downloadFile(table.name, objData).toPromise().then(data => {
          this.loading = false
          switch (data.type) {
            case HttpEventType.DownloadProgress:
              break;
            case HttpEventType.Response:
              let extension = 'xlsx'
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
          this.loading = false
        });
      }
}
