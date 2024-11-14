import * as _ from 'lodash';
import { MSSeoService } from '../seo.service';
import { AppInjector } from '../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { AppConfig } from '../../../_core/helpers/app.config';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { ActionData } from '../../../_core/domains/data/action.data';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { MSFurnitureType } from '../../../_core/domains/entities/meeyseo/enums/ms.furniture.type';
import { MSLocationEntity, MSSeoEntity } from '../../../_core/domains/entities/meeyseo/ms.seo.entity';

@Component({
    templateUrl: './edit.tag.component.html',
    styleUrls: [
        './edit.tag.component.scss',
        '../../../../assets/css/modal.scss'
    ],
})
export class EditTagComponent extends EditComponent implements OnInit {
    id: string;
    tagType: any;
    options: any;
    viewer: boolean;
    fields: string[];
    loading: boolean;
    prevData: string;
    isUpdate: boolean;
    prevContent: string;
    @Input() params: any;
    service: MSSeoService;
    overview: string = '';
    disableChange: boolean;
    citys: OptionItem[] = [];
    isManual: boolean = false;
    dialog: AdminDialogService;
    templateDefault: OptionItem;
    isSearchTag: boolean = false;
    districts: OptionItem[] = [];
    overviewItems: OptionItem[] = [];
    location: MSLocationEntity[] = [];
    enableEventChange: boolean = true;
    isTypeOfRealEstate: boolean = true;
    item: MSSeoEntity = new MSSeoEntity();

    constructor() {
        super();
        this.service = AppInjector.get(MSSeoService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    async ngOnInit(): Promise<void> {
        this.id = this.getParam('id');
        this.viewer = this.getParam('viewer');
        this.breadcrumbs.push({
            Name: 'Xem/Cập nhật thông tin'
        });
        await this.loadItem();
        this.renderActions();
        this.loading = false;
    }

    async loadItem() {
        if (this.id) {
            this.loading = true;
            await this.service.getTag(this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    //Property |
                    this.item = EntityHelper.createEntity(MSSeoEntity, result.Object);
                    if (this.item && this.item.Content) {
                        this.templateDefault = {
                            label: 'Mặc định',
                            value: this.item.Content,
                        };
                    }
                    this.prevContent = this.item.Content;
                    this.item.Template = this.item.Content;
                    if (result.Object.Name) this.item.TagName = result.Object.Name;
                    if (result.Object.Property.need) this.item.Demand = result.Object.Property.need;
                    if (result.Object.Property.typeOfHouse?.length > 0) this.item.TypeOfHouse = result.Object.Property.typeOfHouse;
                    if (result.Object.Property.price?.length > 0) this.item.Price = result.Object.Property.price;
                    if (result.Object.Property.area?.length > 0) this.item.Area = result.Object.Property.area;
                    if (result.Object.Property.legalPaper?.length > 0) this.item.LegalPaper = result.Object.Property.legalPaper;
                    if (result.Object.Property.wideRoad?.length > 0) this.item.WideRoad = result.Object.Property.wideRoad;
                    if (result.Object.Property.direction?.length > 0) this.item.Direction = result.Object.Property.direction;
                    if (result.Object.Property.facade?.length > 0) this.item.Facade = result.Object.Property.facade;
                    if (result.Object.Property.advantage?.length > 0) this.item.Advantage = result.Object.Property.advantage;
                    if (result.Object.Property.floor?.length > 0) this.item.Floor = result.Object.Property.floor;
                    if (result.Object.Property.bedroom?.length > 0) this.item.Bedroom = result.Object.Property.bedroom;
                    if (result.Object.Property.typeOfRealEstate?.length > 0) this.item.TypeOfRealEstate = result.Object.Property.typeOfRealEstate;
                    if (result.Object.Property.havingFE != null) this.item.Furniture = result.Object.Property.havingFE ? MSFurnitureType.Have : MSFurnitureType.No;
                    if (result.Object.Property.utility?.length > 0) this.item.Utility = result.Object.Property.utility;
                    if (result.Object.Content) this.item.Content = result.Object.Content;
                    if (result.Object.Property.location?.filter(c => c.city).length > 0) this.item.City = result.Object.Property.location.map(c => c.city).filter((value, index, self) => self.indexOf(value) === index);
                    if (result.Object.Property.location?.filter(c => c.ward).length > 0) this.item.Ward = result.Object.Property.location.map(c => c.ward).filter((value, index, self) => self.indexOf(value) === index);
                    if (result.Object.Property.location?.filter(c => c.street).length > 0) this.item.Street = result.Object.Property.location.map(c => c.street).filter((value, index, self) => self.indexOf(value) === index);
                    if (result.Object.Property.location?.filter(c => c.district).length > 0) this.item.District = result.Object.Property.location.map(c => c.district).filter((value, index, self) => self.indexOf(value) === index);
                    if (result.Object.Property.location?.length > 0) {
                        this.location = result.Object.Property.location;
                        for (let i = 0; i < result.Object.Property.location.length; i++) {
                            const element = result.Object.Property.location[i];
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
                                this.citys.push(city);
                            }
                            if (element?.district != '') {
                                district.value = element.district;
                                district.label = element.districtName;
                                district.group = element.cityName;
                                this.districts.push(district);
                            }
                        }
                    };
                    let option: OptionItem = ConstantHelper.MS_TAG_TYPES.find(c => c.value == this.item.Type);
                    this.item.TagType = option.label;
                    this.item.Total = result.Object.TotalArticle;

                    //Overview
                    if (result.Object.Property.needLabel?.length > 0) this.overviewItems.push({ value: 'Nhu cầu', label: result.Object.Property.needLabel });
                    if (result.Object.Property.typeOfHouseLabel?.length > 0) this.overviewItems.push({ value: 'Loại nhà đất', label: result.Object.Property.typeOfHouseLabel });
                    if (result.Object.Property.priceLabel?.length > 0) this.overviewItems.push({ value: 'Giá', label: result.Object.Property.priceLabel });
                    if (result.Object.Property.areaLabel?.length > 0) this.overviewItems.push({ value: 'Diện tích', label: result.Object.Property.areaLabel });
                    if (result.Object.Property.location?.filter(c => c.cityName).length > 0) {
                        let lstCity = result.Object.Property.location
                        this.overviewItems.push({
                            value: 'Tỉnh/thành phố', label: result.Object.Property.location.map(c => c.cityName).filter((value, index, self) => self.indexOf(value) === index).filter((element): element is string => {
                                return element !== null && element !== '';
                            })
                        });
                    }
                    if (result.Object.Property.location?.filter(c => c.districtName).length > 0) {
                        let district = result.Object.Property.location.map(c => {
                            return {
                                district: c.district,
                                districtName: c.districtName
                            }
                        }).filter((element): element is string => {
                            return element.districtName !== null && element.districtName !== '';
                        });
                        let arrayUniqueByKey: any = [...new Map(district.map(item =>
                            [item['district'], item])).values()];
                        this.overviewItems.push({ value: 'Quận/huyện', label: arrayUniqueByKey.map(c => c.districtName) });
                    }
                    if (result.Object.Property.location?.filter(c => c.wardName).length > 0) {
                        let ward = result.Object.Property.location.map(c => {
                            return {
                                ward: c.ward,
                                wardName: c.wardName
                            }
                        }).filter((element): element is string => {
                            return element.wardName !== null && element.wardName !== '';
                        });
                        let arrayUniqueByKey: any = [...new Map(ward.map(item =>
                            [item['ward'], item])).values()];
                        this.overviewItems.push({ value: 'Phường/xã', label: arrayUniqueByKey.map(c => c.wardName) });
                    }
                    if (result.Object.Property.location?.filter(c => c.streetName).length > 0) {
                        let street = result.Object.Property.location.map(c => {
                            return {
                                street: c.street,
                                streetName: c.streetName
                            }
                        }).filter((element): element is string => {
                            return element.streetName !== null && element.streetName !== '';
                        });
                        let arrayUniqueByKey: any = [...new Map(street.map(item =>
                            [item['street'], item])).values()];
                        this.overviewItems.push({ value: 'Đường, phố', label: arrayUniqueByKey.map(c => c.streetName) });
                    }
                    if (result.Object.Property.legalPaperLabel?.length > 0) this.overviewItems.push({ value: 'Giấy tờ pháp lý', label: result.Object.Property.legalPaperLabel });
                    if (result.Object.Property.wideRoadLabel?.length > 0) this.overviewItems.push({ value: 'Đường rộng', label: result.Object.Property.wideRoadLabel });
                    if (result.Object.Property.directionLabel?.length > 0) this.overviewItems.push({ value: 'Hướng nhà/đất', label: result.Object.Property.directionLabel });
                    if (result.Object.Property.facadeLabel?.length > 0) this.overviewItems.push({ value: 'Mặt tiền', label: result.Object.Property.facadeLabel });
                    if (result.Object.Property.advantageLabel?.length > 0) this.overviewItems.push({ value: 'Ưu điểm BĐS', label: result.Object.Property.advantageLabel });
                    if (result.Object.Property.floorLabel?.length > 0) this.overviewItems.push({ value: 'Số tầng', label: result.Object.Property.floorLabel });
                    if (result.Object.Property.bedroomLabel?.length > 0) this.overviewItems.push({ value: 'Số phòng ngủ', label: result.Object.Property.bedroomLabel });
                    if (result.Object.Property.typeOfRealEstateLabel?.length > 0) this.overviewItems.push({ value: 'Loại hình BĐS', label: result.Object.Property.typeOfRealEstateLabel });
                    if (result.Object.Property.havingFELabel?.length > 0) this.overviewItems.push({ value: 'Nội thất, thiết bị', label: result.Object.Property.havingFELabel });
                    if (result.Object.Property.utilityLabel?.length > 0) this.overviewItems.push({ value: 'Tiện ích', label: result.Object.Property.utilityLabel });
                    this.overview = this.overviewItems.map(c => {
                        return c.value + ': ' + c.label
                    }).join(' | ');
                    this.prevData = JSON.stringify(this.item);
                } else {
                    this.dialog.Alert('Thông báo', 'Tag không tồn tại hoặc kết nối bị hỏng, vui lòng thử lại sau');
                }
            });
            this.loading = false;
        }
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.backNotSave() }),
        ];

        actions.push({
            name: 'Xem',
            icon: 'la la-eye',
            className: 'btn btn-primary',
            systemName: ActionType.Empty,
            click: () => {
                let url = AppConfig.MeeyLandConfig.Url + '/tags/' + this.item.Url;
                window.open(url, "_blank");
            }
        });

        // Save && Publish
        actions.push({
            name: 'Lưu',
            icon: 'la la-plus',
            processButton: true,
            className: 'btn btn-success',
            systemName: ActionType.Edit,
            click: () => {
                this.confirm();
            }
        });
        this.actions = await this.authen.actionsAllow(MSSeoEntity, actions);
    }

    backNotSave() {
        let jsonData = JSON.stringify(this.item);
        if (this.prevData == jsonData) {
            this.back();
            return;
        }
        this.dialogService.Confirm('Bạn chưa lưu các thông tin này, bạn có chắc muốn thoát ra?', () => {
            if (this.state)
                this.router.navigate([this.state.prevUrl], { state: { params: JSON.stringify(this.state) } });
            else
                window.history.back();
        }, null, 'Quay lại')
    }

    async confirm() {
        this.processing = true;
        let valid = await validation(this.item, ['TagName', 'Prioritized', 'Demand', 'Title', 'MetaTitle', 'MetaKeyword', 'MetaDescription', 'Url', 'Content']);
        if (valid) {
            // call api
            let havingFE: boolean = false;
            let data = {
                "adminUserId": this.authen.account.Id,
                "name": this.item.TagName,
                "prioritized": this.item.Prioritized,
                "content": this.item.Content,
                "type": this.item.Type.toString(),
                "title": this.item.Title,
                "metaTitle": this.item.MetaTitle,
                "metaKeyword": this.item.MetaKeyword,
                "metaDescription": this.item.MetaDescription,
                "url": this.item.Url,
                "property": {
                    "need": this.item.Demand,
                    "typeOfHouse": this.item.TypeOfHouse ? this.item.TypeOfHouse : [],
                    "price": this.item.Price ? this.item.Price : [],
                    "area": this.item.Area ? this.item.Area : [],
                    "location": this.location,
                    "legalPaper": this.item.LegalPaper ? this.item.LegalPaper : [],
                    "wideRoad": this.item.WideRoad ? this.item.WideRoad : [],
                    "direction": this.item.Direction ? this.item.Direction : [],
                    "facade": this.item.Facade ? this.item.Facade : [],
                    "advantage": this.item.Advantage ? this.item.Advantage : [],
                    "floor": (this.item.Floor) ? this.item.Floor.map(c => c.toString()) : [],
                    "bedroom": (this.item.Bedroom) ? this.item.Bedroom.map(c => c.toString()) : [],
                    "typeOfRealEstate": this.item.TypeOfRealEstate ? this.item.TypeOfRealEstate : [],
                    "utility": this.item.Utility ? this.item.Utility : [],
                },
            };
            if (this.item.Furniture == MSFurnitureType.Have || this.item.Furniture == MSFurnitureType.No) {
                havingFE = this.item.Furniture == MSFurnitureType.Have ? true : false;
                data['property']['havingFE'] = havingFE;
            } else data['property']['havingFE'] = null;
            return await this.service.callApi('MSSeo', 'UpdateTags/' + this.item.Id, data, MethodType.Put).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Cập nhật tag thành công');
                    this.processing = false;
                    this.back();
                    return true;
                }
                ToastrHelper.ErrorResult(result);
                this.processing = false;
                return false;
            }, (e: any) => {
                ToastrHelper.Exception(e);
                this.processing = false;
                return false;
            });
        };
        this.processing = false;
        return false;
    }

    clearValue(type: string) {
        // remove
        if (type) {
            this.overviewItems = this.overviewItems?.filter(c => c.value !== type);
            this.overview = this.overviewItems.map(c => {
                return c.value + ': ' + c.label
            }).join(' | ');

            if (type == 'Tỉnh/thành phố') {
                this.location = []
            }
            if (type == 'Quận/huyện') {
                for (let i = 0; i < this.location.length; i++) {
                    const element = this.location[i];
                    element.district = '';
                    element.ward = '';
                    element.street = '';
                    element.districtName = '';
                    element.wardName = '';
                    element.streetName = '';
                }
            }
            if (type == 'Phường/xã') {
                for (let i = 0; i < this.location.length; i++) {
                    const element = this.location[i];
                    element.ward = '';
                    element.wardName = '';
                }
            }
            if (type == 'Đường, phố') {
                for (let i = 0; i < this.location.length; i++) {
                    const element = this.location[i];
                    element.street = '';
                    element.streetName = '';
                }
            }
        }
        return;
    }

    changePropertyOption(item: OptionItem | OptionItem[], type: string, index: number) {
        let items = Array.isArray(item)
            ? _.cloneDeep(item)
            : [_.cloneDeep(item)];
        if (!items || items.length == 0 || items[0] == null) {
            // remove
            if (type) {

                if (type == 'Tỉnh/thành phố') {
                    this.location = [];
                    this.overviewItems = this.overviewItems?.filter(c => c.value != 'Quận/huyện' && c.value !== 'Phường/xã' && c.value !== 'Đường, phố');
                }
                if (type == 'Quận/huyện') {
                    this.overviewItems = this.overviewItems?.filter(c => c.value !== 'Phường/xã' && c.value !== 'Đường, phố');
                    for (let i = 0; i < this.location.length; i++) {
                        const element = this.location[i];
                        element.district = '';
                        element.ward = '';
                        element.street = '';
                        element.districtName = '';
                        element.wardName = '';
                        element.streetName = '';
                    }
                }
                if (type == 'Phường/xã') {
                    for (let i = 0; i < this.location.length; i++) {
                        const element = this.location[i];
                        element.ward = '';
                        element.wardName = '';
                    }
                }
                if (type == 'Đường, phố') {
                    for (let i = 0; i < this.location.length; i++) {
                        const element = this.location[i];
                        element.street = '';
                        element.streetName = '';
                    }
                }
                if (type == 'Nhu cầu') {
                    this.item.TypeOfHouse = null;
                    this.item.Price = null;
                    this.item.TypeOfRealEstate = null;
                    this.item.Utility = null;
                    this.overviewItems = this.overviewItems?.filter(c => c.value !== 'Loại nhà đất' && c.value !== 'Giá' && c.value !== 'Loại hình BĐS' && c.value !== 'Tiện ích');
                }

                let option = this.overviewItems?.find(c => c.value == type);
                if (option) {
                    let index = this.overviewItems?.indexOf(option);
                    this.overviewItems.splice(index, 1);
                    this.overview = this.overviewItems.map(c => {
                        return c.value + ': ' + c.label
                    }).join(' | ');
                }
            }
            return;
        }

        if (type == 'Tỉnh/thành phố') {
            this.citys = items;
            items.forEach((item: OptionItem) => {
                let obj = {
                    city: item.value,
                    district: '',
                    ward: '',
                    street: '',
                }
                let currentLocation = this.location?.find(c => c.city == item.value);
                if (!currentLocation) this.location.push(obj);
            });
            for (let i = 0; i < this.location.length; i++) {
                const element = this.location[i];
                let location = items?.filter(c => c.value == element.city);
                if (!location || location.length == 0)
                    this.location = this.location.filter(x => x.city !== element.city);
            }
        }

        if (type == 'Quận/huyện') {
            this.districts = items;
            items.forEach((item: OptionItem) => {
                let city = this.citys?.find(c => c.label == item.group);

                let obj = {
                    district: item.value,
                    city: city.value,
                    ward: '',
                    street: '',
                }
                let existsLocation: boolean = false;
                this.location.forEach((loItem, index) => {
                    if (this.location[index].district == item.value) existsLocation = true;
                });
                let currentLocation = this.location?.find(c => c.city == city.value && c.district == '');
                if (currentLocation) currentLocation.district = item.value;
                else if (!currentLocation && !existsLocation) {
                    this.location.push(obj);
                };
            });
            for (let i = 0; i < this.location.length; i++) {
                const element = this.location[i];
                let location = items?.filter(c => c.value == element.district);
                if (!location || location.length == 0)
                    this.location = this.location.filter(x => x.district !== element.district);
            }
        }

        if (type == 'Phường/xã') {
            items.forEach((item: OptionItem) => {
                let group = item.group.replace('Thành phố ', '');
                let district = this.districts?.find(c => c.label == group);
                let city = this.citys?.find(c => c.label == district.group);
                let obj = {
                    ward: item.value,
                    district: district.value,
                    city: city.value,
                    street: '',
                }

                let existsLocation: boolean = false;
                this.location.forEach((loItem, index) => {
                    if (loItem.ward == item.value) existsLocation = true;
                });
                let currentLocation = this.location?.find(c => c.district == district.value && c.ward == '');
                if (currentLocation) currentLocation.ward = item.value;
                else if (!currentLocation && !existsLocation) {
                    this.location.push(obj);
                };
            });
            for (let i = 0; i < this.location.length; i++) {
                const element = this.location[i];
                let location = items?.filter(c => c.value == element.ward);
                if (!location || location.length == 0) {
                    let lstDelete = this.location?.filter(c => c.ward == element.ward);
                    for (let j = 0; j < lstDelete.length; j++) {
                        const deleteObj = lstDelete[j];
                        deleteObj.ward = '';
                    }
                }
                this.location = this.location.filter(x => x.city !== element.district);
            }
        }

        if (type == 'Đường, phố') {
            items.forEach((item: OptionItem) => {
                let group = item.group.replace('Thành phố ', '');
                let district = this.districts?.find(c => c.label == group);
                let city = this.citys?.find(c => c.label == district.group);
                let obj = {
                    street: item.value,
                    district: district.value,
                    city: city.value,
                    ward: '',
                }

                let existsLocation: boolean = false;
                this.location.forEach((loItem, index) => {
                    if (this.location[index].street == item.value) existsLocation = true;
                });
                let currentLocation = this.location?.find(c => c.district == district.value && c.street == '');
                if (currentLocation) currentLocation.street = item.value;
                else if (!currentLocation && !existsLocation) {
                    this.location.push(obj);
                };
            });
            for (let i = 0; i < this.location.length; i++) {
                const element = this.location[i];
                let location = items?.filter(c => c.value == element.street);
                if (!location || location.length == 0) {
                    let lstDelete = this.location?.filter(c => c.street == element.street);
                    for (let j = 0; j < lstDelete.length; j++) {
                        const deleteObj = lstDelete[j];
                        deleteObj.street = '';
                    }
                }
                this.location = this.location.filter(x => x.city !== element.district);
            }
        }

        if (type == 'Nhu cầu' && items[0].value == 'sang_nhuong') {
            this.isTypeOfRealEstate = false;
        } else this.isTypeOfRealEstate = true;

        let option = this.overviewItems.find(c => c.value == type);
        if (option) {
            if (type == 'Nội thất, thiết bị') {
                let furniture = ConstantHelper.MS_TAG_FURNITURE_TYPES.find(c => c.value == this.item.Furniture);
                option.label = furniture.label;
            } else
                option.label = items.map((c: OptionItem) => c.label).join(', ');
        } else {
            if (type == 'Nội thất, thiết bị') {
                let furniture = ConstantHelper.MS_TAG_FURNITURE_TYPES.find(c => c.value == this.item.Furniture);
                option = {
                    value: type,
                    label: furniture.label,
                    index: index,
                };
            } else {
                option = {
                    value: type,
                    label: items.map((c: OptionItem) => c.label).join(', '),
                    group: items.map((c: OptionItem) => c.group).join(', '),
                    index: index,
                };
            }
            this.overviewItems.push(option);
        };
        this.overviewItems = this.overviewItems.sort((a, b) => a.index - b.index);
        this.overview = this.overviewItems.map(c => {
            return c.value + ': ' + c.label
        }).join(' | ');
    }

    typeOfHouseChange() {
        if (this.enableEventChange) {
            this.loadConfig();
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }

    private loadConfig() {
        this.fields = null;
        this.options = null;
        this.enableEventChange = false;
        if (this.item.Demand && this.item.TypeOfHouse) {
            let item = {
                Need: this.item.Demand,
                ObjectType: 1,
                TypeOfHouses: this.item.TypeOfHouse,
            };
            this.service.loadConfig(item).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let options = result.Object as any[],
                        names = options && options.map(c => c.Id);
                    if (options && options.length > 0) {
                        this.fields = names;
                        options.forEach((option: any) => {
                            if (option.Options && option.Options.length > 0) {
                                if (!this.options) this.options = {};
                                this.options[option.Id] = option.Options.map((c: any) => new OptionItem(c.Id, c.Name));
                            }
                        });
                    }
                }
            });
        } else this.fields = [];
    }

    tag: string;
    tagNameChange() {
        if (this.item.TagName) this.tag = this.item.TagName;
    }

    tagNameBlur() {
        if (!this.item.TagName) this.item.TagName = this.tag;
    }

    templateChange() {
        if (!this.item.Content) {
            this.prevContent = this.item.Template;
            this.item.Content = this.item.Template;
        } else {
            if (this.prevContent !== this.item.Content) {
                this.dialogService.Confirm('Các thông tin đã nhập sẽ không được giữ lại. Bạn có chắc chắn muốn thay đổi nội dung không?', () => {
                    this.prevContent = this.item.Template;
                    this.item.Content = this.item.Template;
                }, () => {
                    this.item.Template = null;
                }, 'Xác nhận thay đổi');
                return;
            } else {
                this.prevContent = this.item.Template;
                this.item.Content = this.item.Template;
            }
        }
    }
}