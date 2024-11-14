import { AppInjector } from "../../../../app.module";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FileData } from "../../../../_core/domains/data/file.data";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { EntityHelper } from "../../../../_core/helpers/entity.helper";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { MethodType } from "../../../../_core/domains/enums/method.type";
import { EditorComponent } from "../../../../_core/editor/editor.component";
import { AdminApiService } from "../../../../_core/services/admin.api.service";
import { AdminAuthService } from "../../../../_core/services/admin.auth.service";
import { AdminEventService } from "../../../../_core/services/admin.event.service";
import { AdminDialogService } from "../../../../_core/services/admin.dialog.service";
import { MRVReportViolateEntity } from "../../../../_core/domains/entities/meeyreview/mrv.reportviolate.entity";

@Component({
    templateUrl: "./view.reportviolate.component.html",
    styleUrls: ["./view.reportviolate.component.scss"],
})
export class ViewReportViolateComponent implements OnInit {
    id: string;
    viewer: boolean;
    loading: boolean;
    imageUrl: string;
    isActived: boolean;
    @Input() params: any;
    isFullscreen = false;
    event: AdminEventService;
    authen: AdminAuthService;
    service: AdminApiService;
    dialog: AdminDialogService;
    item: MRVReportViolateEntity;
    @ViewChild("uploadImage") uploadImage: EditorComponent;

    constructor() {
        this.service = AppInjector.get(AdminApiService);
        this.authen = AppInjector.get(AdminAuthService);
        this.event = AppInjector.get(AdminEventService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.id = this.params && this.params["id"];
        this.viewer = this.params && this.params["viewer"];
        if (this.id) {
            await this.service
                .item("mrvreportviolate/items", this.id)
                .then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        this.item = EntityHelper.createEntity(
                            MRVReportViolateEntity,
                            result.Object as MRVReportViolateEntity
                        );
                        this.item.Media = this.renderFiles(this.item.Media);
                    } else ToastrHelper.ErrorResult(result);
                });
        } else this.item = new MRVReportViolateEntity();
    }

    delete(number: Number, item: any): void {
        let obj = {
            report: item.Id,
            comment: item.comment._id,
            updatedBy: {
                id: this.authen.account.Id,
                email: this.authen.account.Email,
                name: this.authen.account.FullName,
            }
        };
        if (number == 1) {
            obj['type'] = 1;
            this.dialog.ConfirmAsync("Bạn có chắc chắn muốn xóa nội dung này, cũng như tất cả các phản hồi liên quan nội dung này?", async () => {
                this.service.callApiByUrl("mrvreportviolate/update", obj, MethodType.Post).then(async (result) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success("Xử lý báo cáo vi phạm thành công");
                        this.event.RefreshGrids.emit();
                    } else ToastrHelper.ErrorResult(result);
                }, (e: any) => {
                    ToastrHelper.Exception(e);
                });
            });
        } else {
            obj['type'] = 2;
            this.dialog.ConfirmAsync("Bạn có chắc chắn rằng nội dung báo cáo vi phạm này không hợp lệ?", async () => {
                this.service.callApiByUrl("mrvreportviolate/update", obj, MethodType.Post).then(async (result) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success("Xử lý báo cáo vi phạm thành công");
                        this.event.RefreshGrids.emit();
                    } else ToastrHelper.ErrorResult(result);
                }, (e: any) => {
                    ToastrHelper.Exception(e);
                });
            });
        }
    }

    private renderFiles(files: any[]): FileData[] {
        let itemFiles: FileData[] = [];
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                itemFiles.push({
                    Path: file.url,
                    Code: file.code || file._id,
                    Name: file.title || file.name,
                    ResultUpload: {
                        _id: file._id,
                        uri: file.uri,
                        url: file.url,
                        name: file.name,
                        size: file.size,
                        s3Key: file.s3Key,
                        width: file.width,
                        height: file.height,
                        mimeType: file.mimeType,
                    },
                });
            }
        }
        return itemFiles;
    }
}
