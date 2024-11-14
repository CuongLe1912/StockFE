import * as _ from 'lodash';
import { KeyValue } from "../../../_core/domains/data/key.value";
import { MSSeoService } from '../seo.service';
import { AppInjector } from '../../../app.module';
import { Component, Directive, Input, OnInit } from "@angular/core";
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ActionData } from '../../../_core/domains/data/action.data';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { MSTagType } from '../../../_core/domains/entities/meeyseo/enums/ms.tag.type';
import { MSFurnitureType } from '../../../_core/domains/entities/meeyseo/enums/ms.furniture.type';
import { MSLocationEntity, MSSeoEntity } from '../../../_core/domains/entities/meeyseo/ms.seo.entity';

@Component({
    templateUrl: './add.tag.component.html',
    styleUrls: [
        './add.tag.component.scss',
        '../../../../assets/css/modal.scss'
    ],
})
export class AddTagComponent extends EditComponent implements OnInit {
    tagType: any;
    options: any;
    fields: string[];
    loading: boolean;
    item: MSSeoEntity;
    citys: OptionItem[];
    @Input() params: any;
    service: MSSeoService;
    overview: string = '';
    disableChange: boolean;
    districts: OptionItem[];
    tagsName: string[] = [];
    items: MSSeoEntity[] = [];
    isSplit: boolean = false;
    isManual: boolean = false;
    isAutoTag: boolean = true;
    dialog: AdminDialogService;
    tagSplited: KeyValue[] = [];
    isSearchTag: boolean = false;
    overviewAuto: OptionItem[] = [];
    overviewItems: OptionItem[] = [];
    location: MSLocationEntity[] = [];
    processingAddTag: boolean = false;
    isTypeOfRealEstate: boolean = true;
    enableEventChange: boolean = true;

    constructor() {
        super();
        this.service = AppInjector.get(MSSeoService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        this.addBreadcrumb("Thêm mới tag");
        await this.loadItem();
        this.renderActions();
        this.loading = false;
    }

    private async loadItem() {
        this.loading = true;
        this.item = new MSSeoEntity();
        this.tagType = MSTagType.AutoTag;
        this.loading = false;
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.backNotSave() }),
        ];
        actions.push({
            icon: 'la la-eye',
            name: 'Xem thuộc tính',
            className: 'btn btn-primary',
            systemName: ActionType.Empty,
            hidden: () => {
                return !this.isAutoTag;
            },
            click: () => {
                this.splitProperty();
            }
        });
        actions.push({
            name: 'Thêm mới',
            icon: 'la la-plus',
            processButton: true,
            className: 'btn btn-success',
            systemName: ActionType.AddNew,
            click: async () => {
                await this.confirm();
            }
        });
        this.actions = await this.authen.actionsAllow(MSSeoEntity, actions);
    }

    backNotSave() {
        if ((this.item.Type == MSTagType.ManualTag && this.item.Name && this.item.Demand && this.item.TypeOfHouse && this.item.Price && this.item.Area && (this.item.City || this.item.District || this.item.Ward || this.item.Street))
            || (this.item.Type == MSTagType.AutoTag && this.item.Name && this.isSplit)) {
            this.dialogService.Confirm('Bạn chưa lưu các thông tin này, bạn có chắc muốn thoát ra?', () => {
                if (this.state)
                    this.router.navigate([this.state.prevUrl], { state: { params: JSON.stringify(this.state) } });
                else
                    window.history.back();
            }, null, 'Quay lại');
        } else {
            this.back();
        }
    }

    async confirm() {
        this.processing = true;
        let valid: boolean = false;
        valid = this.item.Type == MSTagType.AutoTag
            ? await validation(this.item, ['Name', 'Type'])
            : await validation(this.item, ['Name', 'Type', 'Demand'])
        if (valid) {
            // call api
            let tagsNotSplit: string[] = [];
            let prevType = this.item.Type;
            let havingFE: boolean = false;
            havingFE = this.item.Furniture == MSFurnitureType.Have ? true : false;

            let datas = []
            let tags: string[] = this.item.Name.split(';')
            if (this.item.Type == MSTagType.ManualTag) {
                tags.forEach((tag: string) => {
                    let data = {
                        "name": tag,
                        "prioritized": this.item.Prioritized,
                        "type": this.item.Type.toString(),
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
                    }
                    if (this.item.Furniture) {
                        data['property']['havingFE'] = havingFE;
                    }
                    datas.push(data);
                });
            } else if (this.item.Type == MSTagType.AutoTag) {
                if (this.tagSplited && this.tagSplited?.filter(x => x.value == false).length > 0) {
                    let keys = this.tagSplited?.filter(x => x.value == false);
                    let message = 'Tag chưa được phân tách thuộc tính:';
                    for (let i = 0; i < keys.length; i++) {
                        message += '<br/>' + keys[i].key;
                    }
                    this.dialogService.Error(message);
                    return false;
                }
                let tagIndivisible = this.overviewAuto?.filter(c => c.label == '' || !c.label.includes('Nhu cầu'));
                if (tagIndivisible?.length > 0) {
                    let message = 'Tag không phân tách được thuộc tính hoặc thiếu nhu cầu:';
                    for (let i = 0; i < tagIndivisible.length; i++) {
                        const element = tagIndivisible[i];
                        message += '<br/>' + element.value;
                    }
                    this.dialogService.Error(message);
                    return false;
                }
                this.items.forEach((tag: MSSeoEntity) => {
                    if (tag.Demand?.length > 0 || tag.TypeOfHouse?.length > 0 || tag.Price?.length > 0 || tag.Area?.length > 0 || tag.Location?.length > 0 || tag.LegalPaper?.length > 0 || tag.WideRoad?.length > 0 || tag.Direction?.length > 0 || tag.Facade?.length > 0 || tag.Advantage?.length > 0 || tag.Floor?.length > 0 || tag.Bedroom?.length > 0 || tag.Utility?.length > 0) {
                        if (this.tagsName?.filter(x => x !== tag.TagName).length > 0) tagsNotSplit.push(tag.TagName);
                        havingFE = tag.Furniture == MSFurnitureType.Have ? true : false;

                        let data = {
                            "name": tag.TagName,
                            "prioritized": this.item.Prioritized,
                            "type": this.item.Type.toString(),
                            "property": {
                                "need": tag.Demand,
                                "typeOfHouse": tag.TypeOfHouse ? tag.TypeOfHouse : [],
                                "price": tag.Price ? tag.Price : [],
                                "area": tag.Area ? tag.Area : [],
                                "location": tag.Location,
                                "legalPaper": tag.LegalPaper ? tag.LegalPaper : [],
                                "wideRoad": tag.WideRoad ? tag.WideRoad : [],
                                "direction": tag.Direction ? tag.Direction : [],
                                "facade": tag.Facade ? tag.Facade : [],
                                "advantage": tag.Advantage ? tag.Advantage : [],
                                "floor": (tag.Floor) ? tag.Floor.map(c => c.toString()) : [],
                                "bedroom": (tag.Bedroom) ? tag.Bedroom.map(c => c.toString()) : [],
                                "typeOfRealEstate": tag.TypeOfRealEstate ? tag.TypeOfRealEstate : [],
                                "utility": tag.Utility ? tag.Utility : [],
                            },
                        };
                        if (this.item.Furniture) {
                            data['property']['havingFE'] = havingFE;
                        }
                        datas.push(data);
                    }
                });
            } else {
                tags.forEach((tag: string) => {
                    datas.push(
                        {
                            "name": tag,
                            "prioritized": this.item.Prioritized,
                            "content": "",
                            "type": this.item.Type.toString(),
                            "property": {
                                "need": this.item.Demand,
                            },
                        })
                });
            }

            let items = {
                "adminUserId": this.authen.account.Id,
                "data": datas,
            };

            return await this.service.callApi('MSSeo', 'AddTags', items, MethodType.Put).then((result: ResultApi) => {
                this.processing = false;
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Thêm mới tag thành công');
                    this.item = EntityHelper.createEntity(MSSeoEntity);
                    this.item.Type = prevType;
                    this.overviewItems = [];
                    this.overviewAuto = [];
                    this.overview = '';
                    this.items = [];
                    this.tagsName = [];
                    this.citys = [];
                    this.districts = [];
                    this.tagSplited = [];
                    this.location = [];
                    //this.back();
                } else ToastrHelper.ErrorResult(result);
            }, (e: any) => {
                this.processing = false;
                ToastrHelper.Exception(e);
            });
        };
        this.processing = false;
        return false;
    }

    changeTagType() {
        if (this.disableChange)
            return;
        this.disableChange = true;
        setTimeout(() => this.disableChange = false, 1000);

        if (this.tagType == MSTagType.ManualTag) {
            let prevType = this.item.Type;
            if (this.item.Name && this.item.Demand && this.item.TypeOfHouse && this.item.Price && this.item.Area && (this.item.City || this.item.District || this.item.Ward || this.item.Street)) {
                this.dialog.ConfirmAsync('Các thông tin đã nhập sẽ không được giữ lại <br/> Bạn có chắc chắn muốn thay đổi loại tag không?',
                    async () => {
                        if (prevType == MSTagType.SearchTag) {
                            this.isManual = false;
                            this.isAutoTag = false;
                            this.isSearchTag = true;
                        } else {
                            this.isAutoTag = true;
                            this.isManual = false;
                            this.isSearchTag = false;
                        }
                        this.tagType = this.item.Type;
                        this.item = EntityHelper.createEntity(MSSeoEntity);
                        this.item.Type = prevType;
                    },
                    () => {
                        this.disableChange = true;
                        this.item.Type = this.tagType;
                        setTimeout(() => { this.disableChange = false }, 1000);
                    }, 'Xác nhận', 'Xác nhận');
            } else {
                if (prevType == MSTagType.SearchTag) {
                    this.isManual = false;
                    this.isAutoTag = false;
                    this.isSearchTag = true;
                } else if (prevType == MSTagType.ManualTag) {
                    this.isManual = true;
                    this.isAutoTag = false;
                    this.isSearchTag = false;
                } else {
                    this.isManual = false;
                    this.isAutoTag = true;
                    this.isSearchTag = false;
                }
                this.tagType = this.item.Type;
                this.item = EntityHelper.createEntity(MSSeoEntity);
                this.item.Type = prevType;
            }
        } else if (this.tagType == MSTagType.AutoTag) {
            let prevType = this.item.Type;
            if (this.item.Name) {
                this.dialog.ConfirmAsync('Các thông tin đã nhập sẽ không được giữ lại <br/> Bạn có chắc chắn muốn thay đổi loại tag không?',
                    async () => {
                        if (prevType == MSTagType.ManualTag) {
                            this.isManual = true;
                            this.isAutoTag = false;
                            this.isSearchTag = false;
                        } else {
                            this.isManual = false;
                            this.isAutoTag = false;
                            this.isSearchTag = true;
                        }
                        this.tagType = this.item.Type;
                        this.item = EntityHelper.createEntity(MSSeoEntity);
                        this.item.Type = prevType;
                    }, () => {
                        this.disableChange = true;
                        this.item.Type = this.tagType;
                        setTimeout(() => { this.disableChange = false }, 1000);
                    }, 'Xác nhận thay đổi', 'Đồng ý');
            } else {
                if (prevType == MSTagType.ManualTag) {
                    this.isManual = true;
                    this.isSearchTag = false;
                    this.isAutoTag = false;
                } else if (prevType == MSTagType.SearchTag) {
                    this.isManual = false;
                    this.isSearchTag = true;
                    this.isAutoTag = false;
                } else {
                    this.isManual = false;
                    this.isSearchTag = false;
                    this.isAutoTag = true;
                }
                this.tagType = this.item.Type;
                this.item = EntityHelper.createEntity(MSSeoEntity);
                this.item.Type = prevType;
            }
        } else {
            let prevType = this.item.Type;
            if (prevType == MSTagType.ManualTag) {
                this.isManual = true;
                this.isSearchTag = false;
                this.isAutoTag = false;
            } else if (prevType == MSTagType.SearchTag) {
                this.isManual = false;
                this.isSearchTag = true;
                this.isAutoTag = false;
            } else {
                this.isManual = false;
                this.isSearchTag = false;
                this.isAutoTag = true;
            }
            this.tagType = this.item.Type;
            this.item = EntityHelper.createEntity(MSSeoEntity);
            this.item.Type = prevType;
        }

        this.overview = '';
        this.overviewItems = [];
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

    addTag() {
        let tags: string[] = this.item.Name.split(';');
        for (let i = 0; i < tags.length; i++) {
            let key = this.tagSplited?.find(x => x.key == tags[i]);
            if (!key) this.tagSplited.push({ key: tags[i], value: false });
        }
    }

    clearProperty(item: string) {
        let lstTag = item.split(';');
        if (this.tagSplited && this.tagSplited?.length > 0) {
            for (let i = 0; i < this.tagSplited.length; i++) {
                let tag = lstTag?.find(x => x == this.tagSplited[i].key);
                if (!tag) this.tagSplited = this.tagSplited?.filter(c => c.key !== this.tagSplited[i].key);
            }
        }
        if (this.isAutoTag && this.overviewAuto && this.overviewAuto.length > 0) {
            if (item) {
                let lstValueOverview = _.cloneDeep(this.overviewAuto?.map(x => x.value));
                for (let i = 0; i < lstValueOverview.length; i++) {
                    if (!lstTag.includes(lstValueOverview[i])) {
                        this.overviewAuto = this.overviewAuto?.filter(c => c.value !== lstValueOverview[i]);
                        this.tagsName = this.tagsName?.filter(c => c !== lstValueOverview[i]);
                        this.items = this.items?.filter(c => c.TagName !== lstValueOverview[i]);
                    }
                }
            } else {
                this.overviewAuto = [];
                this.tagsName = [];
                this.items = [];
            }
        }
        return;
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

    async splitProperty() {
        this.processingAddTag = true;
        if (this.item.Name) {
            let tags: string[] = this.item.Name.split(';');
            for (let i = 0; i < tags.length; i++) {
                let tag = tags[i];
                if (this.tagsName?.filter(x => x == tag).length == 0) {
                    await this.service.callApi('MSSeo', 'Split?tag=' + tag, null, MethodType.Get).then((result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                            this.isSplit = true;
                            //Property
                            let data = EntityHelper.createEntity(MSSeoEntity);
                            data.TagName = tag;
                            data.Type = this.item.Type;
                            if (result.Object.purpose?.length > 0) data.Demand = result.Object.purpose[0].ID_purpose;
                            if (result.Object.area?.length > 0) data.Area = result.Object.area.map(c => c.ID_area);
                            if (result.Object.frontage?.length > 0) data.Facade = result.Object.frontage.map(c => c.ID_frontage);
                            if (result.Object.price?.length > 0) data.Price = result.Object.price.map(c => c.ID_price);
                            if (result.Object.bedroom?.length > 0) data.Bedroom = result.Object.bedroom.map(c => c.ID_bedroom);
                            if (result.Object.floor?.length > 0) data.Floor = result.Object.floor.map(c => c.ID_floor);
                            if (result.Object.wide_road?.length > 0) data.WideRoad = result.Object.wide_road.map(c => c.ID_wide_road);
                            if (result.Object.utilities?.length > 0) data.Utility = result.Object.utilities.map(c => c.ID_utilities);
                            if (result.Object.advantages?.length > 0) data.Advantage = result.Object.advantages.map(c => c.ID_advantage);
                            if (result.Object.house_direction?.length > 0) data.Direction = result.Object.house_direction.map(c => c.ID_direction);
                            if (result.Object.type_of_houses?.length > 0) data.TypeOfHouse = result.Object.type_of_houses.map(c => c.ID_estate);
                            if (result.Object.typeOfRealEstate?.length > 0) data.TypeOfRealEstate = result.Object.typeOfRealEstate.map(c => c.ID_typeOfRealEstate);
                            if (result.Object.land_certificate?.length > 0) data.LegalPaper = result.Object.land_certificate.map(c => c.ID_land_certification);
                            if (result.Object.furniture) data.Furniture = result.Object.furniture == 1 ? MSFurnitureType.Have : MSFurnitureType.No;
                            if (result.Object.address?.filter(c => c.city).length > 0) data.City = result.Object.address.map(c => c.city).filter((value, index, self) => self.indexOf(value) === index);
                            if (result.Object.address?.filter(c => c.ward).length > 0) data.Ward = result.Object.address.map(c => c.ward).filter((value, index, self) => self.indexOf(value) === index);
                            if (result.Object.address?.filter(c => c.street).length > 0) data.Street = result.Object.address.map(c => c.street).filter((value, index, self) => self.indexOf(value) === index);
                            if (result.Object.address?.filter(c => c.district).length > 0) data.District = result.Object.address.map(c => c.district).filter((value, index, self) => self.indexOf(value) === index);
                            if (result.Object.address && result.Object.address.length > 0) {
                                for (let i = 0; i < result.Object.address.length; i++) {
                                    const item = result.Object.address[i];
                                    let obj = EntityHelper.createEntity(MSLocationEntity);
                                    obj.city = item.city;
                                    obj.district = item.district;
                                    if (item.hasOwnProperty('ward')) obj.ward = item.ward;
                                    if (item.hasOwnProperty('street')) obj.street = item.street;
                                    if (!data.Location) data.Location = [];
                                    data.Location.push(obj);
                                }
                            }
                            this.items.push(data);

                            //Overview
                            if (result.Object.purpose?.length > 0) this.overviewItems.push({ value: 'Nhu cầu', label: result.Object.purpose[0].value_purpose });
                            if (result.Object.type_of_houses?.length > 0) this.overviewItems.push({ value: 'Loại nhà đất', label: result.Object.type_of_houses.map(c => c.value_estate) });
                            if (result.Object.price?.length > 0) this.overviewItems.push({ value: 'Giá', label: result.Object.price.map(c => c.value_price) });
                            if (result.Object.area?.length > 0) this.overviewItems.push({ value: 'Diện tích', label: result.Object.area.map(c => c.value_area) });
                            if (result.Object.address && result.Object.address.length > 0) {
                                let address = result.Object.address[0];
                                if (address.hasOwnProperty('city_name'))
                                    this.overviewItems.push({ value: 'Tỉnh/thành phố', label: result.Object.address.map(c => c.city_name).filter((value, index, self) => self.indexOf(value) === index) });
                                if (address.hasOwnProperty('district_name'))
                                    this.overviewItems.push({ value: 'Quận/huyện', label: result.Object.address.map(c => c.district_name).filter((value, index, self) => self.indexOf(value) === index) });
                                result.Object.address.forEach((item: any) => {
                                    if (item.hasOwnProperty('ward_name')) {
                                        if (!this.overviewItems?.find(c => c.value == 'Phường/xã'))
                                            this.overviewItems.push({ value: 'Phường/xã', label: result.Object.address.map(c => c.ward_name).filter((value, index, self) => self.indexOf(value) === index) });
                                        else {
                                            let ward = this.overviewItems?.find(c => c.value == 'Phường/xã');
                                            ward.label += ', ' + item.ward_name;
                                        }
                                    }

                                    if (item.hasOwnProperty('street_name')) {
                                        if (!this.overviewItems?.find(c => c.value == 'Đường, phố'))
                                            this.overviewItems.push({ value: 'Đường, phố', label: result.Object.address.map(c => c.street_name).filter((value, index, self) => self.indexOf(value) === index) });
                                        else {
                                            let street = this.overviewItems?.find(c => c.value == 'Đường, phố');
                                            street.label += ', ' + item.street_name;
                                        }
                                    }
                                });
                            }
                            if (result.Object.land_certificate?.length > 0) this.overviewItems.push({ value: 'Giấy tờ pháp lý', label: result.Object.land_certificate.map(c => c.value_land_certification) });
                            if (result.Object.wide_road?.length > 0) this.overviewItems.push({ value: 'Đường rộng', label: result.Object.wide_road.map(c => c.value_wide_road) });
                            if (result.Object.house_direction?.length > 0) this.overviewItems.push({ value: 'Hướng nhà/đất', label: result.Object.house_direction.map(c => c.value_direction) });
                            if (result.Object.frontage?.length > 0) this.overviewItems.push({ value: 'Mặt tiền', label: result.Object.frontage.map(c => c.value_frontage) });
                            if (result.Object.advantages?.length > 0) this.overviewItems.push({ value: 'Ưu điểm BĐS', label: result.Object.advantages.map(c => c.value_advantage) });
                            if (result.Object.floor?.length > 0) this.overviewItems.push({ value: 'Số tầng', label: result.Object.floor.map(c => c.value_floor) });
                            if (result.Object.bedroom?.length > 0) this.overviewItems.push({ value: 'Số phòng ngủ', label: result.Object.bedroom.map(c => c.value_bedroom) });
                            if (result.Object.typeOfRealEstate?.length > 0) this.overviewItems.push({ value: 'Loại hình BĐS', label: result.Object.typeOfRealEstate.map(c => c.value_typeOfRealEstate) });
                            if (result.Object.furniture) this.overviewItems.push({ value: 'Nội thất, thiết bị', label: result.Object.furniture == 1 ? "Có" : "Không" });
                            if (result.Object.utilities?.length > 0) this.overviewItems.push({ value: 'Tiện ích', label: result.Object.utilities.map(c => c.value_utilities) });

                            this.overview = this.overviewItems.map(c => {
                                return c.value + ': ' + c.label
                            }).join(' | ');
                            this.overviewAuto.push({ value: tag, label: this.overview });
                            this.tagsName.push(tag);
                            this.overviewItems = [];
                            let key = this.tagSplited?.find(c => c.key == tags[i]);
                            if (key) key.value = true;
                            //ToastrHelper.Success('Thêm mới tag thành công');
                            return true;
                        }
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }, (e: any) => {
                        ToastrHelper.Exception(e);
                        return false;
                    });
                } else {
                    ToastrHelper.Error('Tag ' + tag + ' đã phân tách thuộc tính');
                }
            }
        } else {
            ToastrHelper.Error('Chưa nhập tag');
        }
        this.processingAddTag = false;
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
                let district = this.districts?.find(c => c.label == item.group);
                let city = this.citys?.find(c => c.label == district.group);
                let obj = {
                    ward: item.value,
                    district: district.value,
                    city: city.value,
                    street: '',
                }

                let existsLocation: boolean = false;
                this.location.forEach((loItem, index) => {
                    if (this.location[index].ward == item.value) existsLocation = true;
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
                let district = this.districts?.find(c => c.label == item.group);
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
}