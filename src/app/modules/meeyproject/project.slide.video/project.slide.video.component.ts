import * as _ from "lodash";
import { AppInjector } from "../../../app.module";
import { MPOProjectService } from "../project.service";
import { Component, Input, OnInit, } from "@angular/core";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { EditComponent } from "../../../_core/components/edit/edit.component";
import { AdminAuthService } from "../../../_core/services/admin.auth.service";
import { AdminDialogService } from "../../../_core/services/admin.dialog.service";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { ActionType, ControllerType } from "../../../_core/domains/enums/action.type";
import { VideoDetailComponent } from "../project.video/detail.video/video.detail.component";
import { MPOProjectItemEntity } from "../../../_core/domains/entities/meeyproject/mpo.project.entity";

@Component({
    selector: "app-project.videos",
    templateUrl: "./project.slide.video.component.html",
    styleUrls: ["./project.slide.video.component.scss"],
})
export class MPOProjectSlideVideosComponent extends EditComponent implements OnInit {
    @Input() params: any;
    actions: ActionData[] = [];
    loading: boolean = false;
    unFeatured: boolean = false;
    item: MPOProjectItemEntity = new MPOProjectItemEntity();
    videos: any;
    listVideoOutput: any;
    listDeleteVideo: any
    service: MPOProjectService;
    dialog: AdminDialogService;
    authen: AdminAuthService;
    // permissions
    allowEdit: boolean = true;

    constructor() {
        super();
        this.service = AppInjector.get(MPOProjectService);
        this.dialog = AppInjector.get(AdminDialogService);
        this.authen = AppInjector.get(AdminAuthService);

        let navigation = this.router.getCurrentNavigation();
        if (navigation && navigation?.extras?.state && navigation?.extras?.state['params']) {
            const params = JSON.parse(navigation.extras.state['params']);
            if (params) this.listVideoOutput = params?.object?.listItem;
        }
    }
    async ngOnInit() {
        this.breadcrumbs = [];
        this.breadcrumbs.push({
            Name: 'Meey Project'
        });
        this.breadcrumbs.push({
            Name: 'Cấu hình hiển thị slide video',
        });
        await this.loadItem();
        this.allowEdit = await this.authen.permissionAllow(ControllerType.MPOProjectSlideVideos, ActionType.Edit)
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.videos, event.previousIndex, event.currentIndex);
    }

    async loadItem() {
        this.loading = true;
        await this.service.videoFeature().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.listDeleteVideo = [];
                this.videos = result.Object;
                if (this.listVideoOutput && this.listVideoOutput.length > 0) {
                    this.videos.push(...this.listVideoOutput);
                }
            }
        });
        setTimeout(() => {
            this.loading = false;
        }, 500);
    }

    search() {
        let obj: NavigationStateData = {
            object: {
                ids: this.videos?.map(x => { return x._id })?.toString(),
            },
            prevUrl: "/admin/mpoproject/slide",
        };
        this.router.navigateByUrl("/admin/mpoproject/video?slide=true", {
            state: { params: JSON.stringify(obj) },
        });
    }

    getName(name) {
        return UtilityExHelper.shortcutString(name, 25);
    }

    clear() {
        this.listVideoOutput = null;
        this.loadItem();
    }

    view(item: any) {
        this.dialogService.WapperAsync({
            title: item.title,
            cancelText: 'Đóng',
            object: VideoDetailComponent,
            size: ModalSizeType.ExtraLarge,
            objectExtra: {
                id: item._id,
                readonly: true,
            },
        }, () => this.loadItem());
    }

    public async updateFeature(): Promise<boolean> {
        if (this.listDeleteVideo.length > 0) {
            let dataDelete = {
                videoFeatured: this.listDeleteVideo,
                unFeatured: true,
                updatedBy: {
                    data: {
                        _id: this.authen.account.Id,
                        fullname: this.authen.account.FullName
                    },
                    source: "admin"
                }
            }
            return await this.service.updateVideoFeature(dataDelete).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Cập nhật thành công');
                    return true;
                } else {
                    ToastrHelper.ErrorResult(result);
                    return false;
                };
            })
        }
        if (this.listVideoOutput) {
            let data = {
                videoFeatured: this.videos.map((v, index) => {
                    return {
                        "_id": v._id,
                        "orderFeatured": index + 1
                    };
                }),
                updatedBy: {
                    data: {
                        _id: this.authen.account.Id,
                        fullname: this.authen.account.FullName
                    },
                    source: "admin"
                }
            }
            return await this.service.updateVideoFeature(data).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Cập nhật thành công');
                    return true;
                } else {
                    ToastrHelper.ErrorResult(result);
                    return false;
                };
            });
        } else {
            ToastrHelper.Error('Không có gì thay đổi');
            return false;
        }
    }

    async removeFeature(item: any) {
        this.dialogService.ConfirmAsync("Bạn có muốn xóa video này không?", async () => {
            this.videos = this.videos?.filter(x => x._id != item._id);
            this.listDeleteVideo.push({
                _id: item._id,
                orderFeatured: 0
            });
        })
    }
}
