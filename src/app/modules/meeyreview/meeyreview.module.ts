import { RouterModule } from "@angular/router";
import { UtilityModule } from "../utility.module";
import { Component, NgModule, OnInit } from "@angular/core";
import { MRVUserComponent } from './user/mrvuser.component';
import { GridData } from "../../_core/domains/data/grid.data";
import { DataType } from "../../_core/domains/enums/data.type";
import { SeedingComponent } from "./seeding/seeding.component";
import { ResultApi } from "../../_core/domains/data/result.api";
import { ToastrHelper } from "../../_core/helpers/toastr.helper";
import { ActionData } from "../../_core/domains/data/action.data";
import { MethodType } from "../../_core/domains/enums/method.type";
import { ActionType } from "../../_core/domains/enums/action.type";
import { AdminAuthGuard } from "../../_core/guards/admin.auth.guard";
import { MRVProjectComponent } from './project/mrvproject.component';
import { AddUserComponent } from './user/add.user/add.user.component';
import { ModalSizeType } from "../../_core/domains/enums/modal.size.type";
import { AddProjectComponent } from './project/add.project/add.project.component';
import { EditReplyComponent } from "./components/edit.reply/edit.reply.component";
import { GridEditComponent } from "../../_core/components/grid/grid.edit.component";
import { EditReviewComponent } from "./components/edit.review/edit.review.component";
import { ViewProjectComponent } from './project/view.project/view.project.component';
import { MRVReportViolateComponent } from './reportviolate/mrvreportviolate.component';
import { MRVReviewType } from "../../_core/domains/entities/meeyreview/enums/review.type";
import { EditQuestionComponent } from "./components/edit.question/edit.question.component";
import { MeeyReviewEntity } from "../../_core/domains/entities/meeyreview/mr.review.entity";
import { MRVReviewStatusType } from "../../_core/domains/entities/meeyreview/enums/review.status.typs";
import { PopupReplyReviewComponent } from "./components/popup.reply.review/popup.reply.review.component";
import { ViewReportViolateComponent } from './reportviolate/view.reportviolate/view.reportviolate.component';
import { ExportStatisticMRVProjectComponent } from "./project/export.statistic/export.statistic.component";
import { ExportStatisticMRVComponent } from "./project/export.statistic/export.statistic.manage.component";

@Component({
    templateUrl: '../../_core/components/grid/grid.component.html',
})
export class MeeyReviewComponent extends GridEditComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        HideSearch: true,
        UpdatedBy: false,
        DisableAutoLoad: true,
        Actions: [
            {
                name: 'Phản hồi',
                icon: 'la la-reply',
                systemName: ActionType.Reply,
                className: 'btn btn-success',
                hidden: (item: any) => {
                    return (item.TypeNumber == MRVReviewType.Reply && item.StatusNumber == MRVReviewStatusType.Pending);
                  },
                click: (item: any) => {
                    this.reply(item);
                }
            },
            ActionData.edit((item: any) => this.edit(item)),
            ActionData.delete((item: any) => this.delete(item)),
        ],
        Features: [
            {
                icon: 'la la-plus',
                name: 'Seeding nhanh',
                className: 'btn btn-success',
                systemName: ActionType.AddNew,
                click: () => {
                    this.addNew();
                }
            },
            {
                name: "Xuất dữ liệu thô",
                icon: "la la-download",
                className: 'btn btn-success',
                systemName: ActionType.Export,
                click: () => {
                //   if (this.itemData?.Paging?.Total > 10000) {
                //     this.dialogService.Alert('Thông báo', 'File export tối đa 10 nghìn dòng!');
                //   } else 
                  this.export()
                },
              },
            ActionData.reload(() => this.loadItems()),
        ],
        Reference: MeeyReviewEntity,
        CustomFilters: ['FilterComment', 'ProjectId', 'Type', 'FilterVote', 'FilterUser', 'CreatedAt', 'PublishedAtFilter', 'Status']
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'Comment', Title: 'Nội dung', Type: DataType.String, DisableOrder: true },
            { Property: 'Type', Title: 'Loại nội dung', Type: DataType.DropDown, DisableOrder: true, Align: 'center',
                Format: (item: any) => {
                    item['TypeNumber'] = item.Type;
                    let text = ""
                    if(item.Type == MRVReviewType.Review){
                        text = "Review"
                    }
                    else if(item.Type == MRVReviewType.Question){
                        text = "Câu hỏi"
                    }
                    else if(item.Type == MRVReviewType.Reply)
                    {
                        text = "Phản hồi"
                    }
                    return text;
                } 
            },
            {
                Property: 'Project', Title: 'Dự án', Type: DataType.String, DisableOrder: true, Click: (item: any) => {
                    this.dialogService.WapperAsync({
                        cancelText: 'Đóng',
                        title: 'Chi tiết dự án',
                        size: ModalSizeType.Large,
                        object: ViewProjectComponent,
                        objectExtra: {
                            viewer: true,
                            id: item.ProjectId,
                        },
                    }, () => this.loadItems());
                }
            },
            {
                Property: 'Vote', Title: 'Điểm đánh giá', Type: DataType.String, DisableOrder: true, Align: 'center',
                Format: (obj: any) => {
                    return obj.Vote ? Math.round(obj.Vote * 10) / 10 : '';
                }
            },
            { Property: 'TotalReply', Title: 'Số lượng phản hồi', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            {
                Property: 'CreatedBy', Title: 'Người tạo', Type: DataType.String, DisableOrder: true, Align: 'center',
                Format: (obj: any) => {
                    if (obj.CreatedBy) {
                        return obj.CreatedBy.Name || obj.NickName || 'Ẩn danh';
                    } return '';
                }
            },
            { Property: 'CreatedAt', Title: 'Ngày tạo', Type: DataType.DateTime, DisableOrder: true, Align: 'center' },
            { Property: 'PublishedAt', Title: 'Thời gian gửi', Type: DataType.DateTime, DisableOrder: true, Align: 'center' },
            {
                Property: 'UpdatedBy', Title: 'Người sửa', Type: DataType.String, DisableOrder: true, Align: 'center',
                Format: (obj: any) => {
                    if (obj.UpdatedBy) {
                        return obj.UpdatedBy.Name || obj.NickName || 'Ẩn danh';
                    } return '';
                }
            },
            { Property: 'UpdatedAt', Title: 'Thời gian sửa', Type: DataType.DateTime, DisableOrder: true, Align: 'center' },
            { Property: 'Status', Title: 'Trạng thái đăng', Type: DataType.DropDown, DisableOrder: true, Align: 'center',
                Format: (item: any) => {
                    item['StatusNumber'] = item.Status;
                    let text = ""
                    if(item.Status == MRVReviewStatusType.Pending){
                        text = "Chờ đăng"
                    }
                    else if(item.Status == MRVReviewStatusType.Published){
                        text = "Đã đăng"
                    }
                    return text;
                } 
            },
        ];
    }

    async ngOnInit() {
        await this.render(this.obj);
        // refresh
        if (!this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids = this.event.RefreshGrids.subscribe(
            async () => {
                this.dialogService.HideAllDialog();
                await this.loadItems();
            }
            );
        }
    }
    delete(item: any): void {
        let createBy = {
            id :  this.authen.account.Id,
            email: this.authen.account.Email,
            name : this.authen.account.FullName
        }
        let data = {
            commentId: item.Id,
            createdBy : createBy
        };
        this.dialogService.ConfirmAsync("Bạn có chắc chắn rằng muốn xoá comment này?", async () => {
            await this.service.callApiByUrl("meeyreview/delete", data, MethodType.Post).then(async (result) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success("Xoá comment thành công");
                    this.event.RefreshGrids.emit();
                } else ToastrHelper.ErrorResult(result);
            }, (e: any) => {
                ToastrHelper.Exception(e);
            });
        });
    }
    reply(item: any) {
        let id: string = item.Id,
            title = 'Phản hồi Review';
        let originalItem: any = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem.Type == MRVReviewType.Question)
            title = 'Phản hồi câu hỏi';
        else if (originalItem.Type == MRVReviewType.Reply) {
            id = originalItem.ReplyTo;
            title = 'Phản hồi của phản hồi';
        }
        this.dialogService.WapperAsync({
            title: title,
            cancelText: 'Hủy',
            confirmText: 'Gửi phản hồi',
            objectExtra: {
                id: id,
                type: originalItem.Type,
            },
            size: ModalSizeType.ExtraLarge,
            object: PopupReplyReviewComponent,
        }, () => this.loadItems());
    }
    export() {
        this.dialogService.WapperAsync({
          cancelText: 'Đóng',
          size: ModalSizeType.Small,
          title: 'Xuất dữ liệu',
          confirmText: 'Xuất dữ liệu',
          object: ExportStatisticMRVComponent,
        });
      }
}

@NgModule({
    declarations: [
        MRVUserComponent,
        AddUserComponent,
        SeedingComponent,
        EditReplyComponent,
        MRVProjectComponent,
        AddProjectComponent,
        MeeyReviewComponent,
        ExportStatisticMRVProjectComponent,
        ExportStatisticMRVComponent,
        EditReviewComponent,
        ViewProjectComponent,
        EditQuestionComponent,
        PopupReplyReviewComponent,
        MRVReportViolateComponent,
        ViewReportViolateComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: MeeyReviewComponent, pathMatch: 'full', data: { state: 'mrv_review' }, canActivate: [AdminAuthGuard] },
            { path: 'user', component: MRVUserComponent, pathMatch: 'full', data: { state: 'mrv_users' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: SeedingComponent, pathMatch: 'full', data: { state: 'mrv_review_add' }, canActivate: [AdminAuthGuard] },
            { path: 'user/add', component: AddUserComponent, pathMatch: 'full', data: { state: 'mrv_user_add' }, canActivate: [AdminAuthGuard] },
            { path: 'user/view', component: AddUserComponent, pathMatch: 'full', data: { state: 'mrv_user_view' }, canActivate: [AdminAuthGuard] },
            { path: 'project', component: MRVProjectComponent, pathMatch: 'full', data: { state: 'mrv_projects' }, canActivate: [AdminAuthGuard] },
            { path: 'project/add', component: AddProjectComponent, pathMatch: 'full', data: { state: 'mrv_project_add' }, canActivate: [AdminAuthGuard] },
            { path: 'project/view', component: AddProjectComponent, pathMatch: 'full', data: { state: 'mrv_project_view' }, canActivate: [AdminAuthGuard] },
            { path: 'reportviolate', component: MRVReportViolateComponent, pathMatch: 'full', data: { state: 'mrv_reportviolate' }, canActivate: [AdminAuthGuard] },
            { path: 'reportviolate/view', component: ViewReportViolateComponent, pathMatch: 'full', data: { state: 'mrv_reportviolate_view' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class MeeyReviewModule { }
