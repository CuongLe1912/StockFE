import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MBBannerService } from '../banner.service';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { ResultType } from '../../../_core/domains/enums/result.type';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { EditorComponent } from '../../../_core/editor/editor.component';
import { DimensionType } from '../../../_core/domains/enums/dimension.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { AdminAuthService } from '../../../_core/services/admin.auth.service';
import { AdminEventService } from '../../../_core/services/admin.event.service';
import { Component, Input, OnInit, QueryList, ViewChildren } from "@angular/core";
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { clearValidation, validation } from '../../../_core/decorators/validator';
import { MBBannerRunningComponent } from '../banner.running/banner.running.component';
import { ActionType, ControllerType } from '../../../_core/domains/enums/action.type';
import { MBStatusType } from '../../../_core/domains/entities/meeybanner/enums/mb.status.type';
import { MBBannerType } from '../../../_core/domains/entities/meeybanner/enums/mb.banner.type';
import { MBSourceType } from '../../../_core/domains/entities/meeybanner/enums/mb.source.type';
import { MCRMCustomerEntity } from '../../../_core/domains/entities/meeycrm/mcrm.customer.entity';
import { MBPlatformType } from '../../../_core/domains/entities/meeybanner/enums/mb.platform.type';
import { MBBannerEntity, MBBannerUpdateStatusEntity, MBBannerZoneEntity } from '../../../_core/domains/entities/meeybanner/mb.banner.entitty';

@Component({
    templateUrl: './add.banner.component.html',
    styleUrls: [
        './add.banner.component.scss',
        '../../../../assets/css/modal.scss'
    ],
})
export class AddBannerComponent implements OnInit {
    viewer: boolean;
    BannerType: any;
    loading: boolean;
    prevData: string;
    item: MBBannerEntity;
    @Input() params: any;
    coordinates: number[];
    viewLocation: boolean;
    disableChange: boolean;
    disabled: boolean = true;
    loadingCustomer: boolean;
    service: MBBannerService;
    //isDisable: boolean = false;
    dialog: AdminDialogService;
    MBStatusType = MBStatusType;
    customer: MCRMCustomerEntity;
    DimensionType = DimensionType;
    authService: AdminAuthService;
    eventService: AdminEventService;
    MBPlatformType = MBPlatformType;
    zones: MBBannerZoneEntity[] = [];
    @ViewChildren('uploadImages') uploadImages: QueryList<EditorComponent>;
    @ViewChildren('uploadImages2') uploadImages2: QueryList<EditorComponent>;

    // permissions
    allowStop: boolean = true;
    allowPlay: boolean = true;
    allowPause: boolean = true;
    allowDelete: boolean = true;
    allowReject: boolean = true;
    allowApprove: boolean = true;

    constructor() {
        this.service = AppInjector.get(MBBannerService);
        this.dialog = AppInjector.get(AdminDialogService);
        this.authService = AppInjector.get(AdminAuthService);
        this.eventService = AppInjector.get(AdminEventService);
    }

    async ngOnInit() {
        await this.loadItem();
        await this.allowPermissions();
    }

    customeChange(id: string) {
        if (id) {
            this.loadingCustomer = true;
            this.service.item('MCRMCustomer/item', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.customer = EntityHelper.createEntity(MCRMCustomerEntity, result.Object);
                }
                this.loadingCustomer = false;
            });
        } else {
            this.customer = null;
        }

    }

    private async loadItem() {
        this.loading = true;
        let id = this.params && this.params['id'];
        this.viewer = this.params && this.params['viewer'];
        this.viewLocation = this.params && this.params['viewLocation'];
        if (id) {
            await this.service.item('mbbanner/item', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MBBannerEntity, result.Object as MBBannerEntity);
                    //if (this.item.Status == MBStatusType.Approve || this.item.Status == MBStatusType.Running) this.isDisable = true;
                    this.item.Products = JSON.parse(result.Object?.Products);
                    this.item.ZoneCount = this.item.Zones.length;
                    this.customeChange(this.item.CustomerId);
                    let zones = _.cloneDeep(this.item.Zones);
                    let zoneWebHome = zones.find(z => z.Platform === 1 && z.ZoneClass === 'web_home');
                    if (zoneWebHome) {
                        let zoneWebDetail = zones.find(z => z.Platform === 1 && z.ZoneClass === 'web_home_detail');
                        zoneWebHome.Image2 = zoneWebDetail?.Image;
                    }
                    this.zones = EntityHelper.createEntities(MBBannerZoneEntity, zones.filter(x => x.ZoneClass != 'web_home_detail'));
                    for (let i = 0; i < this.zones.length && this.zones.filter(x => x.ZoneClass == 'app_home' || x.ZoneClass == 'web_mobile'); i++) {
                        if (this.zones[i].ZoneClass == 'web_home') {
                            this.zones[i].Width = this.item.BannerType == MBBannerType.BannerAds ? 1044 : this.item.BannerType == MBBannerType.BannerHome ? 1920 : 244;
                            this.zones[i].Height = this.item.BannerType == MBBannerType.BannerAds ? 180 : this.item.BannerType == MBBannerType.BannerHome ? 820 : 220;
                        }
                        if (this.zones[i].ZoneClass == 'app_home') {
                            this.zones[i].Width = this.item.BannerType == MBBannerType.BannerAds ? 343 : this.item.BannerType == MBBannerType.BannerHome ? 1125 : 320;
                            this.zones[i].Height = this.item.BannerType == MBBannerType.BannerAds ? 180 : this.item.BannerType == MBBannerType.BannerHome ? 1680 : 180;
                        }
                        if (this.zones[i].ZoneClass == 'web_mobile') {
                            this.zones[i].Width = this.item.BannerType == MBBannerType.BannerAds ? 343 : this.item.BannerType == MBBannerType.BannerHome ? 1125 : 244;
                            this.zones[i].Height = this.item.BannerType == MBBannerType.BannerAds ? 180 : this.item.BannerType == MBBannerType.BannerHome ? 1680 : 220;
                        }
                    }

                    if (this.zones.findIndex(c => c.ZoneClass == 'web_home') < 0) {
                        this.zones.push(EntityHelper.createEntity(MBBannerZoneEntity, {
                            Size: 3,
                            Width: this.item.BannerType == MBBannerType.BannerAds ? 1044 : this.item.BannerType == MBBannerType.BannerHome ? 1920 : 244,
                            Height: this.item.BannerType == MBBannerType.BannerAds ? 180 : this.item.BannerType == MBBannerType.BannerHome ? 820 : 220,
                            Name: 'Website',
                            ZoneClass: 'web_home',
                            BannerId: this.item.Id,
                            Platform: MBPlatformType.Web,
                            Description: 'Banner trang chủ & chi tiết',
                        }));

                    }

                    if (this.zones.findIndex(c => c.ZoneClass == 'app_home') < 0) {
                        this.zones.push(EntityHelper.createEntity(MBBannerZoneEntity, {
                            Size: 3,
                            Width: this.item.BannerType == MBBannerType.BannerAds ? 343 : this.item.BannerType == MBBannerType.BannerHome ? 1125 : 320,
                            Height: this.item.BannerType == MBBannerType.BannerAds ? 180 : this.item.BannerType == MBBannerType.BannerHome ? 1680 : 180,
                            Name: 'App',
                            ZoneClass: 'app_home',
                            BannerId: this.item.Id,
                            Platform: MBPlatformType.App,
                            Description: 'Banner trên app',
                        }));
                    }

                    if (this.zones.findIndex(c => c.ZoneClass == 'web_mobile') < 0) {
                        this.zones.push(EntityHelper.createEntity(MBBannerZoneEntity, {
                            Size: 3,
                            Width: this.item.BannerType == MBBannerType.BannerAds ? 343 : this.item.BannerType == MBBannerType.BannerHome ? 1125 : 244,
                            Height: this.item.BannerType == MBBannerType.BannerAds ? 180 : this.item.BannerType == MBBannerType.BannerHome ? 1680 : 220,
                            Name: 'WebApp',
                            BannerId: this.item.Id,
                            ZoneClass: 'web_mobile',
                            Platform: MBPlatformType.WebMobile,
                            Description: 'Banner trang mobile',
                        }));
                    }
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else {
            this.item = new MBBannerEntity();
            this.zones.push(EntityHelper.createEntity(MBBannerZoneEntity, {
                Size: 3,
                Width: this.item.BannerType == MBBannerType.BannerAds ? 1044 : this.item.BannerType == MBBannerType.BannerHome ? 1920 : 244,
                Height: this.item.BannerType == MBBannerType.BannerAds ? 180 : this.item.BannerType == MBBannerType.BannerHome ? 820 : 220,
                Name: 'Website',
                ZoneClass: 'web_home',
                BannerId: this.item.Id,
                Platform: MBPlatformType.Web,
                Description: 'Banner trang chủ & chi tiết',
            }));
            this.zones.push(EntityHelper.createEntity(MBBannerZoneEntity, {
                Size: 3,
                Width: this.item.BannerType == MBBannerType.BannerAds ? 343 : this.item.BannerType == MBBannerType.BannerHome ? 1125 : 320,
                Height: this.item.BannerType == MBBannerType.BannerAds ? 180 : this.item.BannerType == MBBannerType.BannerHome ? 1680 : 180,
                Name: 'App',
                ZoneClass: 'app_home',
                BannerId: this.item.Id,
                Platform: MBPlatformType.App,
                Description: 'Banner trên app',
            }));
            this.zones.push(EntityHelper.createEntity(MBBannerZoneEntity, {
                Size: 3,
                Width: this.item.BannerType == MBBannerType.BannerAds ? 343 : this.item.BannerType == MBBannerType.BannerHome ? 1125 : 244,
                Height: this.item.BannerType == MBBannerType.BannerAds ? 180 : this.item.BannerType == MBBannerType.BannerHome ? 1680 : 220,
                Name: 'WebApp',
                BannerId: this.item.Id,
                ZoneClass: 'web_mobile',
                Platform: MBPlatformType.WebMobile,
                Description: 'Banner trang mobile',
            }));
        }
        this.zones.forEach((zone: MBBannerZoneEntity) => {
            if (zone.ZoneClass == 'web_home') zone.Order = 1;
            else if (zone.ZoneClass == 'app_home') zone.Order = 2;
            else if (zone.ZoneClass == 'web_mobile') zone.Order = 3;
        });
        this.zones = this.zones.sort((a: MBBannerZoneEntity, b: MBBannerZoneEntity) => a.Order - b.Order);
        this.prevData = JSON.stringify(this.item);
        this.loading = false;
    }

    private async allowPermissions() {
        this.allowPlay = this.item[ActionType.Play] && await this.authService.permissionAllow(ControllerType.MBBanner, ActionType.Play);
        this.allowStop = this.item[ActionType.Stop] && await this.authService.permissionAllow(ControllerType.MBBanner, ActionType.Stop);
        this.allowPause = this.item[ActionType.Pause] && await this.authService.permissionAllow(ControllerType.MBBanner, ActionType.Pause);
        this.allowReject = this.item[ActionType.Reject] && await this.authService.permissionAllow(ControllerType.MBBanner, ActionType.Reject);
        this.allowDelete = this.item[ActionType.Delete] && await this.authService.permissionAllow(ControllerType.MBBanner, ActionType.Delete);
        this.allowApprove = this.item[ActionType.Approve] && await this.authService.permissionAllow(ControllerType.MBBanner, ActionType.Approve);
    }

    async confirm() {
        let column = ['Name', 'Products', 'Code', 'BannerType'];
        if (!this.item.BannerType) {
            column = ['Name', 'Products', 'Code', 'BannerType'];
        }
        if (this.item.BannerType == MBBannerType.BannerAds) {
            (this.item.SourceType == MBSourceType.Customer || !this.item.SourceType)
                ? column = ['Name', 'Products', 'Code', 'StartDate', 'EndDate', 'DisplayTime', 'SourceType', 'CustomerId']
                : column = ['Name', 'Products', 'Code', 'StartDate', 'EndDate', 'DisplayTime'];
        };
        if (this.item.BannerType == MBBannerType.BannerHome) {
            column = ['Name', 'Products', 'Code', 'StartDate', 'EndDate', 'DisplayTime'];
        };
        if (this.item.BannerType == MBBannerType.BannerSystem) {
            column = ['Name', 'Products', 'Code', 'Description', 'StartDate', 'EndDate', 'DisplayTime'];
        };
        let valid = false;
        clearValidation(this.zones);
        for (let i = 0; i < this.zones.length; i++) {
            let zone = this.zones[i];
            let columnZone = this.item.BannerType == MBBannerType.BannerHome
                ? ['Image']
                : ['Link', 'Image'];

            if (zone.Link || (zone.Image && zone.Image.length > 0)) {
                if (zone.Link) {
                    columnZone.push('Link');
                    valid = await validation(this.zones[i], columnZone, false, i);
                    if (!valid)
                        break;
                } else {
                    valid = await validation(this.zones[i], columnZone, false, i);
                    if (!valid)
                        break;
                }
            }
        }
        // if (!valid) await validation(this.zones[validIndex], columnZone, false, validIndex);

        // if (this.item.Id) {
        //     // đang chạy hoặc đã duyệt
        //     if (this.item.Status == MBStatusType.Approve || this.item.Status == MBStatusType.Running) {
        //         column = column.filter(c => c != 'StartDate').filter(c => c != 'EndDate');
        //     }
        // }
        if (await validation(this.item, column) && valid) {
            // upload image
            for (let i = 0; i < this.zones.length; i++) {
                let zone = this.zones[i];
                let image = (await this.uploadImages.toArray()[i].upload())[0];
                if (image){
                    zone.Image = image.Path;
                    zone.Uri = image.ResultUpload?.images[0].uri;
                } 
            }

            // call api
            let zones = _.cloneDeep(this.zones),
                cloneZone = _.cloneDeep(zones[0]);
            cloneZone.Name = 'Website Detail';
            cloneZone.Image = cloneZone.Image2;
            cloneZone.ZoneClass = 'web_home_detail';
            zones.push(cloneZone);
            this.item.Zones = zones.filter((c: MBBannerZoneEntity) => c.Image && c.Image.length > 0);
            return await this.service.callApi('MBBanner', 'AddOrUpdate', this.item, MethodType.Put).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = this.item.Id
                        ? 'Cập nhật banner thành công'
                        : 'Thêm mới banner thành công';
                    ToastrHelper.Success(message);
                    return true;
                }
                ToastrHelper.ErrorResult(result);
                return false;
            }, (e: any) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
        return false;
    }

    approve(item: any) {
        const endDate = new Date(item.EndDate).getTime();
        const currentDate = new Date().getTime();
        if (item.EndDate && endDate < currentDate) this.runningBanner(item, MBStatusType.Approve);
        else
            this.updateStatus(item, MBStatusType.Approve);
    }

    rejectBanner(item) {
        this.updateStatus(item, MBStatusType.Reject);
    }

    reject() {
        let jsonData = JSON.stringify(this.item);
        if (this.prevData == jsonData) {
            this.dialog.HideAllDialog();
            return;
        } else
            this.dialog.Confirm('Bạn có chắc chắn muốn hủy các thông tin đã tạo?', () => {
                this.dialog.HideAllDialog();
                return true;
            }, null, 'Xác nhận thay đổi');
        return false;
    }

    deleteBanner(item: any) {
        this.delete(item);
    }

    running(item: any) {
        const endDate = new Date(item.EndDate).getTime();
        const currentDate = new Date().getTime();
        if (item.EndDate && endDate < currentDate) this.runningBanner(item, MBStatusType.Running);
        else this.updateStatus(item, MBStatusType.Running);
    }

    pause(item: any) {
        this.updateStatus(item, MBStatusType.Pause);
    }

    stop(item: any) {
        this.updateStatus(item, MBStatusType.Stop);
    }

    updateStatus(item: any, status: MBStatusType) {
        var helper = ConstantHelper.MB_BANNER_STATUS_TYPES.find(c => c.value == status);
        this.dialog.ConfirmAsync('Bạn có muốn ' + helper.confirm + ' banner: <b>' + item.Name + '</b>', async () => {
            let id = item.Id;
            await this.service.updateStatus(id, status).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success(helper.label + ' banner thành công');
                    this.dialog.HideAllDialog();
                    this.eventService.RefreshGrids.emit();
                } else ToastrHelper.ErrorResult(result);
            });
        }, null, 'Xác nhận', 'Xác nhận');
    }

    delete(id: any) {
        if (typeof (id) == 'object') {
            id = id.Id;
        }
        this.dialog.Confirm('Có phải bạn muốn xóa dữ liệu banner này?', () => {
            this.service.delete('mbbanner', id).then(async (result: ResultApi) => {
                if (result && result.Type == ResultType.Success) {
                    ToastrHelper.Success('Xóa banner thành công');
                    this.dialog.HideAllDialog();
                    this.eventService.RefreshGrids.emit();
                } else ToastrHelper.ErrorResult(result);
            });
        });
    }

    runningBanner(item: any, status: MBStatusType) {
        let obj: MBBannerUpdateStatusEntity = {
            Id: item.Id,
            Status: status,
            EndDate: item.EndDate,
            StartDate: item.StartDate,
            DisplayTime: item.DisplayTime,
        };
        this.dialog.WapperAboveAsync({
            cancelText: 'Bỏ qua',
            confirmText: 'Xác nhận',
            objectExtra: { item: obj },
            size: ModalSizeType.Medium,
            object: MBBannerRunningComponent,
            title: 'Cập nhật thời gian chạy',
        }, async () => {
            this.dialog.HideAllDialog();
            this.eventService.RefreshGrids.emit();
        });
    }

    async enabledSave() {
        for (let i = 0; i < this.zones.length; i++) {
            let zone = this.zones[i];
            if (this.item?.BannerType == MBBannerType.BannerHome && zone?.Image?.length > 0) {
                this.disabled = false;
                break;
            } else if (zone?.Image?.length > 0 && zone?.Link) {
                this.disabled = false;
                break;
            }
            this.disabled = true;
        }
    }

    zonesChange() {
        if (!this.item.Id) {
            this.zones = [];
            this.zones.push(EntityHelper.createEntity(MBBannerZoneEntity, {
                Size: 3,
                Width: this.item.BannerType == MBBannerType.BannerAds ? 1044 : this.item.BannerType == MBBannerType.BannerHome ? 1920 : 244,
                Height: this.item.BannerType == MBBannerType.BannerAds ? 180 : this.item.BannerType == MBBannerType.BannerHome ? 820 : 220,
                Name: 'Website',
                ZoneClass: 'web_home',
                BannerId: this.item.Id,
                Platform: MBPlatformType.Web,
                Description: 'Banner trang chủ & chi tiết',
            }));
            this.zones.push(EntityHelper.createEntity(MBBannerZoneEntity, {
                Size: 3,
                Width: this.item.BannerType == MBBannerType.BannerAds ? 343 : this.item.BannerType == MBBannerType.BannerHome ? 1125 : 320,
                Height: this.item.BannerType == MBBannerType.BannerAds ? 180 : this.item.BannerType == MBBannerType.BannerHome ? 1680 : 180,
                Name: 'App',
                ZoneClass: 'app_home',
                BannerId: this.item.Id,
                Platform: MBPlatformType.App,
                Description: 'Banner trên app',
            }));
            this.zones.push(EntityHelper.createEntity(MBBannerZoneEntity, {
                Size: 3,
                Width: this.item.BannerType == MBBannerType.BannerAds ? 343 : this.item.BannerType == MBBannerType.BannerHome ? 1125 : 244,
                Height: this.item.BannerType == MBBannerType.BannerAds ? 180 : this.item.BannerType == MBBannerType.BannerHome ? 1680 : 220,
                Name: 'WebApp',
                BannerId: this.item.Id,
                ZoneClass: 'web_mobile',
                Platform: MBPlatformType.WebMobile,
                Description: 'Banner trang mobile',
            }));

            this.zones.forEach((zone: MBBannerZoneEntity) => {
                if (zone.ZoneClass == 'web_home') zone.Order = 1;
                else if (zone.ZoneClass == 'app_home') zone.Order = 2;
                else if (zone.ZoneClass == 'web_mobile') zone.Order = 3;
            });
            this.zones = this.zones.sort((a: MBBannerZoneEntity, b: MBBannerZoneEntity) => a.Order - b.Order);
        }
    }
}