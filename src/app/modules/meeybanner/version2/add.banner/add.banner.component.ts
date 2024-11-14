import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { FileData } from '../../../../_core/domains/data/file.data';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { MBStatusV2Type } from '../../../../_core/domains/entities/meeybanner/enums/mb.status.type';
import { MBBannerV2Entity } from '../../../../_core/domains/entities/meeybanner/version2/mb.bannerv2.entity';

@Component({
    templateUrl: './add.banner.component.html',
    styleUrls: ['./add.banner.component.scss'],
})
export class AddBannerV2Component implements OnInit {
    viewer: boolean;
    loading: boolean;
    locations: any[];
    item: MBBannerV2Entity;
    wards: OptionItem[] = [];
    cities: OptionItem[] = [];
    districts: OptionItem[] = [];

    auth: AdminAuthService;
    service: AdminApiService;

    @Input() params: any;
    @ViewChild('uploadImages') uploadImages: EditorComponent;

    constructor() {
        this.auth = AppInjector.get(AdminAuthService);
        this.service = AppInjector.get(AdminApiService);
    }

    async ngOnInit() {
        await this.loadItem();
    }

    private async loadItem() {
        this.loading = true;
        let id = this.params && this.params['id'];
        this.viewer = this.params && this.params['viewer'];
        if (id) {
            await this.service.callApiByUrl('mbbannerV2/item/' + id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let item: MBBannerV2Entity = EntityHelper.createEntity(MBBannerV2Entity, result.Object as MBBannerV2Entity);
                    if (item.Locations?.filter((c: any) => c.city).length > 0) item.CityIds = item.Locations.map(c => c.city).filter((value, index, self) => self.indexOf(value) === index);
                    if (item.Locations?.filter((c: any) => c.ward).length > 0) item.WardIds = item.Locations.map(c => c.ward).filter((value, index, self) => self.indexOf(value) === index);
                    if (item.Locations?.filter((c: any) => c.street).length > 0) item.StreetIds = item.Locations.map(c => c.street).filter((value, index, self) => self.indexOf(value) === index);
                    if (item.Locations?.filter((c: any) => c.district).length > 0) item.DistrictIds = item.Locations.map(c => c.district).filter((value, index, self) => self.indexOf(value) === index);
                    if (item.Locations?.length > 0) {
                        this.locations = item.Locations;
                        for (let i = 0; i < item.Locations.length; i++) {
                            const element = item.Locations[i];
                            let city: OptionItem = {
                                value: '',
                                label: ''
                            };
                            let district: OptionItem = {
                                value: '',
                                label: '',
                                group: ''
                            };
                            if (element?.city != '') {
                                city.value = element.city;
                                city.label = element.cityName;
                                this.cities.push(city);
                            }
                            if (element?.district != '') {
                                district.value = element.district;
                                district.label = element.districtName;
                                district.group = element.cityName;
                                this.districts.push(district);
                            }
                        }
                    }
                    if (item.ProjectIds && item.ProjectIds.length > 0) {
                        item.ProjectOptionItem = item?.Projects?.filter(c => c._id).map(c => {
                            return {
                                value: c._id,
                                label: c.title,
                            }
                        });
                    }
                    if (item.Images) item.Images = this.renderImages(item.Images);
                    this.item = item;
                } else ToastrHelper.ErrorResult(result);
            });
        } else {
            this.item = new MBBannerV2Entity();
            this.item.Order = 0;
            this.item.Status = MBStatusV2Type.Down;
        }
        this.loading = false;
    }

    async confirm() {
        let columns = ['Name', 'Type', 'Products', 'Position', 'Platform', 'Images', 'Order', 'Status'];
        if (!this.item.Id) {
            columns.push(...['StartDate', 'EndDate']);
        }
        if (await validation(this.item, columns, false, 1)) {
            // upload image
            let images = await this.uploadImages.upload();
            let s3Files = images?.map(c => c.S3Key);

            // call api
            let pages: number[] = [];
            if (this.item.Page && this.item.Page.length > 0) {
                this.item.Page.forEach((page: any) => {
                    pages.push(this.correctNumberInt(page));
                });
            }
            let data: any = {
                updatedBy: null,
                name: this.item.Name,
                endDate: this.item.EndDate,
                customer: this.item.Customer,
                redirectLink: this.item.Link,
                startDate: this.item.StartDate,
                createdBy: this.auth.account.Id,
                type: this.correctNumberInt(this.item.Type),
                page: pages && pages.length > 0 ? pages : [],
                order: this.correctNumberInt(this.item.Order),
                status: this.correctNumberInt(this.item.Status),
                product: this.correctNumberInt(this.item.Product),
                position: this.correctNumberInt(this.item.Position),
                platform: this.correctNumberInt(this.item.Platform),
                images: s3Files && s3Files.length > 0 ? s3Files : [],
                locations: this.locations && this.locations.length > 0 ? this.locations : [],
                projects: this.item.ProjectIds && this.item.ProjectIds.length > 0 ? this.item.ProjectIds : [],
                typeOfHouses: this.item.TypeOfHouse && this.item.TypeOfHouse.length > 0 ? this.item.TypeOfHouse : [],
            };
            if (this.item.Id) {
                data.updatedBy = this.auth.account.Id;
            }
            let url = this.item.Id
                ? 'mbbannerV2/update/' + this.item.Id
                : 'mbbannerV2/create';
            return await this.service.callApiByUrl(url, data, MethodType.Post).then((result: ResultApi) => {
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

    dateChange() {
        if (this.item.StartDate && this.item.EndDate) {
            debugger;
            let date = new Date(),
                day = date.getDate(),
                month = date.getMonth(),
                year = date.getFullYear();
            let now = new Date(year, month, day).getTime();
            let end = new Date(this.item.EndDate.getFullYear(), this.item.EndDate.getMonth(), this.item.EndDate.getDate()).getTime();
            let start = new Date(this.item.StartDate.getFullYear(), this.item.StartDate.getMonth(), this.item.StartDate.getDate()).getTime();
            if (start > now) {
                this.item.Status = null;
            } else if (start == now) {
                this.item.Status = MBStatusV2Type.Active;
            } else if (end < now) {
                this.item.Status = MBStatusV2Type.Down;
            }
        } else this.item.Status = null;
    }

    clearValue(type: string) {
        // remove
        if (type) {
            if (type == 'Tỉnh/thành phố') {
                this.locations = []
            }
            if (type == 'Quận/huyện') {
                for (let i = 0; i < this.locations.length; i++) {
                    const element = this.locations[i];
                    element.ward = '';
                    element.street = '';
                    element.district = '';
                    element.wardName = '';
                    element.streetName = '';
                    element.districtName = '';
                }
            }
            if (type == 'Phường/xã') {
                for (let i = 0; i < this.locations.length; i++) {
                    const element = this.locations[i];
                    element.ward = '';
                    element.wardName = '';
                }
            }
            if (type == 'Đường/phố') {
                for (let i = 0; i < this.locations.length; i++) {
                    const element = this.locations[i];
                    element.street = '';
                    element.streetName = '';
                }
            }
        }
        return;
    }

    changePropertyOption(item: OptionItem | OptionItem[], type: string) {
        let items = Array.isArray(item)
            ? _.cloneDeep(item)
            : [_.cloneDeep(item)];
        if (!items || items.length == 0 || items[0] == null) {
            // remove
            if (type) {
                if (type == 'Tỉnh/thành phố') {
                    this.locations = [];
                }
                if (type == 'Quận/huyện') {
                    for (let i = 0; i < this.locations.length; i++) {
                        const element = this.locations[i];
                        element.ward = '';
                        element.street = '';
                        element.district = '';
                        element.wardName = '';
                        element.streetName = '';
                        element.districtName = '';
                    }
                }
                if (type == 'Phường/xã') {
                    for (let i = 0; i < this.locations.length; i++) {
                        const element = this.locations[i];
                        element.ward = '';
                        element.wardName = '';
                    }
                }
                if (type == 'Đường/phố') {
                    for (let i = 0; i < this.locations.length; i++) {
                        const element = this.locations[i];
                        element.street = '';
                        element.streetName = '';
                    }
                }
            }
            return;
        }

        if (type == 'Tỉnh/thành phố') {
            this.cities = items;
            items.forEach((item: OptionItem) => {
                let obj = {
                    ward: '',
                    street: '',
                    district: '',
                    city: item.value,
                }
                let currentLocation = this.locations?.find(c => c.city == item.value);
                if (!currentLocation) this.locations.push(obj);
            });
            for (let i = 0; i < this.locations.length; i++) {
                const element = this.locations[i];
                let locations = items?.filter(c => c.value == element.city);
                if (!locations || locations.length == 0)
                    this.locations = this.locations.filter(x => x.city !== element.city);
            }
        }

        if (type == 'Quận/huyện') {
            this.districts = items;
            items.forEach((item: OptionItem) => {
                let city = this.cities?.find(c => c.label == item.group);

                let obj = {
                    ward: '',
                    street: '',
                    city: city?.value,
                    district: item.value,
                }
                let existsLocation: boolean = false;
                this.locations.forEach((loItem, index) => {
                    if (this.locations[index].district == item.value) existsLocation = true;
                });
                let currentLocation = this.locations?.find(c => c.city == city?.value && c.district == '');
                if (currentLocation) currentLocation.district = item.value;
                else if (!currentLocation && !existsLocation) {
                    this.locations.push(obj);
                };
            });
            for (let i = 0; i < this.locations.length; i++) {
                const element = this.locations[i];
                let locations = items?.filter(c => c.value == element.district);
                if (!locations || locations.length == 0)
                    this.locations = this.locations.filter(x => x.district !== element.district);
            }
        }

        if (type == 'Phường/xã') {
            items.forEach((item: OptionItem) => {
                let district = this.districts?.find(c => c.label == item.group);
                let city = this.cities?.find(c => c.label == district.group);
                let obj = {
                    street: '',
                    ward: item.value,
                    city: city?.value,
                    district: district?.value,
                };

                let existsLocation: boolean = false;
                this.locations.forEach((loItem, index) => {
                    if (this.locations[index].ward == item.value) existsLocation = true;
                });
                let currentLocation = this.locations?.find(c => c.district == district?.value && c.ward == '');
                if (currentLocation) currentLocation.ward = item.value;
                else if (!currentLocation && !existsLocation) {
                    this.locations.push(obj);
                };
            });
            for (let i = 0; i < this.locations.length; i++) {
                const element = this.locations[i];
                let locations = items?.filter(c => c.value == element.ward);
                if (!locations || locations.length == 0) {
                    let lstDelete = this.locations?.filter(c => c.ward == element.ward);
                    for (let j = 0; j < lstDelete.length; j++) {
                        const deleteObj = lstDelete[j];
                        deleteObj.ward = '';
                    }
                }
                this.locations = this.locations.filter(x => x.city !== element.district);
            }
        }

        if (type == 'Đường/phố') {
            items.forEach((item: OptionItem) => {
                let district = this.districts?.find(c => c.label == item.group);
                let city = this.cities?.find(c => c.label == district.group);
                let obj = {
                    ward: '',
                    city: city?.value,
                    street: item.value,
                    district: district?.value,
                }

                let existsLocation: boolean = false;
                this.locations.forEach((loItem, index) => {
                    if (this.locations[index].street == item.value) existsLocation = true;
                });
                let currentLocation = this.locations?.find(c => c.district == district?.value && c.street == '');
                if (currentLocation) currentLocation.street = item.value;
                else if (!currentLocation && !existsLocation) {
                    this.locations.push(obj);
                };
            });
            for (let i = 0; i < this.locations.length; i++) {
                const element = this.locations[i];
                let locations = items?.filter(c => c.value == element.street);
                if (!locations || locations.length == 0) {
                    let lstDelete = this.locations?.filter(c => c.street == element.street);
                    for (let j = 0; j < lstDelete.length; j++) {
                        const deleteObj = lstDelete[j];
                        deleteObj.street = '';
                    }
                }
                this.locations = this.locations.filter(x => x.city !== element.district);
            }
        }
    }

    private correctNumberInt(value: any) {
        if (typeof value == 'number') return value;
        else {
            if (value != null && value != undefined) {
                value = parseInt(value);
                return value;
            }
        }
        return value;
    }
    private renderImages(files: any[]): FileData {
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                return {
                    Path: file.url,
                    S3Key: file.s3Key,
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
                    }
                };
            }
        } return null;
    }
}