import * as _ from 'lodash';
import { MSSeoService } from '../../seo.service';
import { Component, OnInit } from "@angular/core";
import { AppInjector } from '../../../../app.module';
import { validation } from '../../../../_core/decorators/validator';
import { KeyValue } from '../../../../_core/domains/data/key.value';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MSSeoReferenceType } from '../../../../_core/domains/entities/meeyseo/enums/ms.tag.type';
import { MSPropertiesEntity } from '../../../../_core/domains/entities/meeyseo/ms.featured.real.estate.entity';

@Component({
    templateUrl: './add.properties.component.html',
    styleUrls: [
        './add.properties.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class AddPropertiesComponent extends EditComponent implements OnInit {
    id: string;
    fields: any;
    options: any;
    needUrl: string;
    loading: boolean;
    structureId: string;
    prevItemJson: string;
    overview: string = '';
    service: MSSeoService;
    properties: string[] = [];
    isUpadte: boolean = false;
    dialog: AdminDialogService;
    eventService: AdminEventService;
    items: MSPropertiesEntity[] = [];
    isTypeOfRealEstate: boolean[] = [];
    enableEventChange: boolean = false;
    disableAddProperties: boolean = true;
    item: MSPropertiesEntity = new MSPropertiesEntity();

    constructor() {
        super();
        this.service = AppInjector.get(MSSeoService);
        this.dialog = AppInjector.get(AdminDialogService);
        this.eventService = AppInjector.get(AdminEventService);
    }

    async ngOnInit() {
        await this.loadItem();
        setTimeout(() => this.enableEventChange = true, 1000);
    }

    private async loadItem() {
        this.loading = true;
        this.id = this.params && this.params['id'];
        this.structureId = this.params && this.params['structureId'];
        if (this.structureId) {
            await this.service.item('mshighlight/getstructure', this.structureId).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    if (result.Object.data.name) this.overview = result.Object.data.name;
                    if (result.Object.data.property?.length > 0) this.properties = result.Object.data.property;
                    this.isTypeOfRealEstate[0] = true;
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else if (!this.structureId && !this.id) {
            ToastrHelper.Error('Lỗi ID cấu trúc không hợp lệ');
            return;
        }
        if (this.id) {
            await this.service.item('mshighlight/getproperty', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MSPropertiesEntity);
                    if (result.Object.data._id) this.item.Id = result.Object.data._id;
                    if (result.Object.data.limit) this.item.Limit = result.Object.data.limit;
                    if (result.Object.data.createdAt) this.item.CreatedDate = result.Object.data.createdAt;
                    if (result.Object.data.propertyId) this.item.PropertyId = result.Object.data.propertyId;
                    if (result.Object.data.structure.name) this.overview = result.Object.data.structure.name;
                    if (result.Object.data.structure._id) this.structureId = result.Object.data.structure._id;
                    if (result.Object.data.updatedDate) this.item.UpdatedDate = result.Object.data.updatedDate;
                    if (result.Object.data.status) this.item.Status = result.Object.data.status == 1 ? true : false;
                    if (result.Object.data.need) {
                        this.item.Need = result.Object.data.need;
                        this.properties.push('need');
                    };
                    if (result.Object.data.property?.length > 0) {
                        let properties = result.Object.data.structure.property;
                        for (let i = 1; i < properties.length; i++) {
                            const key = properties[i];
                            const value = result.Object.data.property.find(c => c.key == key)?.value;
                            this.properties.push(key);
                            switch (key) {
                                case 'typeOfHouse':
                                    this.item.TypeOfHouse = value;
                                    break;
                                case 'typeOfRealEstate': {
                                    this.item.TypeOfRealEstate = value;
                                    this.isTypeOfRealEstate[0] = true;
                                }
                                    break;
                                case 'project': {
                                    this.item.Project = value;
                                    let project = result.Object.data.property?.find(c => c.key == key);
                                    this.item.ProjectOptionItems = project?.rawValue.filter((c: any) => c.value).map((c: any) => {
                                        return {
                                            label: c.label,
                                            value: c.value,
                                        }
                                    });
                                }
                                    break;
                                case 'street':
                                    this.item.Street = value;
                                    break;
                                case 'ward':
                                    this.item.Ward = value;
                                    break;
                                case 'district':
                                    this.item.District = value;
                                    break;
                                case 'city':
                                    this.item.City = value;
                                    break;
                                case 'price':
                                    this.item.Price = value;
                                    break;
                                case 'area':
                                    this.item.Area = value;
                                    break;
                                case 'floor':
                                    this.item.Floor = value;
                                    break;
                                case 'bedroom':
                                    this.item.Bedroom = value;
                                    break;
                                case 'direction':
                                    this.item.Direction = value;
                                    break;
                                case 'facade':
                                    this.item.Facade = value;
                                    break;
                                case 'feature':
                                    this.item.Feature = value;
                                    break;
                                case 'wideRoad':
                                    this.item.WideRoad = value;
                                    break;
                                case 'legalPaper':
                                    this.item.LegalPaper = value;
                                    break;
                                case 'havingFE':
                                    this.item.HavingFE = value ? 1 : 2;
                                    break;
                                case 'utility':
                                    this.item.Utility = value;
                                    break;
                            }
                        }
                    };
                    this.items.push(this.item);
                    this.loadConfig(0);
                } else {
                    ToastrHelper.ErrorResult(result);
                    return;
                }
            });
        } else {
            let item = EntityHelper.createEntity(MSPropertiesEntity);
            item.Code = UtilityExHelper.randomText(6);
            item.Status = true;
            this.items.push(item);
        }
        this.prevItemJson = JSON.stringify(_.cloneDeep(this.item));

        // check 
        if (this.properties && this.properties.length > 0) {
            let typeOfRealEstate = this.properties.find(c => c == 'typeOfRealEstate');
            this.needUrl = typeOfRealEstate
                ? '/MSSeoConfig/LookupReference/' + MSSeoReferenceType.NeedLiteSell
                : '/MSSeoConfig/LookupReference/' + MSSeoReferenceType.NeedSell;
        }
        this.loading = false;
    }

    async reject() {
        let item = this.items[0];
        if (this.id) {
            let json = JSON.stringify(this.item);
            if (json != this.prevItemJson) {
                this.dialogService.Confirm('Bạn chưa lưu các thông tin này, bạn có chắc muốn hủy?', () => {
                    this.dialog.HideAllDialog();
                    return true;
                }, null, 'Xác nhận thay đổi');
            } else return true
        } else {
            if (this.id && item.Need && item.Limit > 0) {
                this.dialogService.Confirm('Bạn chưa lưu các thông tin này, bạn có chắc muốn hủy?', () => {
                    this.dialog.HideAllDialog();
                    return true;
                }, null, 'Xác nhận thay đổi');
            } else return true;
        }
        return false;
    }

    async confirm() {
        let valid = true;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            let columnns = this.columnValidates(i);
            valid = await validation(item, columnns, false, i);
            if (valid) {
                if (this.properties.indexOf('utility') >= 0 && !item.Utility) {
                    this.dialog.Error('Giá trị thuộc tính STT [' + (i + 1) + '] không đúng theo cấu trúc, vui lòng chọn giá trị thuộc tính phù hợp với cấu trúc');
                    return false;
                }
            }
            if (!valid) break;
        }
        if (valid) {
            let duplicates = this.validateDuplicate();
            if (duplicates && duplicates.length > 0) {
                let message: string = '';
                duplicates.forEach((item: KeyValue) => {
                    message += message
                        ? ', [' + item.key + ' và ' + item.value.join(', ') + ']'
                        : '[' + item.key + ' và ' + item.value.join(', ') + ']';
                });
                this.dialogService.Alert('Thông báo', 'Giá trị thuộc tính trùng nhau, các cặp trùng nhau: ' + message);
                return false;
            }
            let type = this.item.Id ? 2 : 1;
            let url = 'AddOrUpdateProperty/' + type;
            if (this.item.Id) url += '?id=' + this.item.Id;
            let dataItems = [];
            this.items.forEach((item: MSPropertiesEntity) => {
                let data = {};
                data['need'] = item.Need;
                data['limit'] = item.Limit;
                data['status'] = item.Status ? 1 : 2;
                let properties = [];
                this.properties.forEach((property: string) => {
                    let itemProperty = {};
                    switch (property) {
                        case 'typeOfHouse':
                            itemProperty['key'] = "typeOfHouse";
                            itemProperty['value'] = item.TypeOfHouse;
                            break;
                        case 'typeOfRealEstate': {
                            if (item.Need != 'sang_nhuong') {
                                itemProperty['key'] = "typeOfRealEstate";
                                itemProperty['value'] = item.TypeOfRealEstate;
                            } else itemProperty = null;
                        }
                            break;
                        case 'project':
                            itemProperty['key'] = "project";
                            itemProperty['value'] = item.Project;
                            break;
                        case 'street':
                            itemProperty['key'] = "street";
                            itemProperty['value'] = item.Street;
                            break;
                        case 'ward':
                            itemProperty['key'] = "ward";
                            itemProperty['value'] = item.Ward;
                            break;
                        case 'district':
                            itemProperty['key'] = "district";
                            itemProperty['value'] = item.District;
                            break;
                        case 'city':
                            itemProperty['key'] = "city";
                            itemProperty['value'] = item.City;
                            break;
                        case 'price':
                            itemProperty['key'] = "price";
                            itemProperty['value'] = item.Price;
                            break;
                        case 'area':
                            itemProperty['key'] = "area";
                            itemProperty['value'] = item.Area;
                            break;
                        case 'floor':
                            itemProperty['key'] = "floor";
                            itemProperty['value'] = item.Floor;
                            break;
                        case 'bedroom':
                            itemProperty['key'] = "bedroom";
                            itemProperty['value'] = item.Bedroom;
                            break;
                        case 'direction':
                            itemProperty['key'] = "direction";
                            itemProperty['value'] = item.Direction;
                            break;
                        case 'facade':
                            itemProperty['key'] = "facade";
                            itemProperty['value'] = item.Facade;
                            break;
                        case 'feature':
                            itemProperty['key'] = "feature";
                            itemProperty['value'] = item.Feature;
                            break;
                        case 'wideRoad':
                            itemProperty['key'] = "wideRoad";
                            itemProperty['value'] = item.WideRoad;
                            break;
                        case 'legalPaper':
                            itemProperty['key'] = "legalPaper";
                            itemProperty['value'] = item.LegalPaper;
                            break;
                        case 'havingFE':
                            itemProperty['key'] = "havingFE";
                            itemProperty['value'] = item.HavingFE == 1 ? true : false;
                            break;
                        case 'utility':
                            itemProperty['key'] = "utility";
                            itemProperty['value'] = item.Utility?.length > 0 ? item.Utility : [];
                            break;
                        default:
                            itemProperty = null;
                            break;
                    }
                    if (itemProperty) properties.push(itemProperty);
                });
                data['property'] = properties;
                if (data) dataItems.push(data);
            });
            let datas = {
                "adminUserId": this.authen.account.Id,
                "structureId": this.structureId,
            };
            if (type == 2) datas['data'] = dataItems[0];
            else datas['data'] = dataItems;
            return await this.service.callApi('MSHighlight', url, datas, MethodType.Post).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = this.item.Id
                        ? 'Cập nhật giá trị thuộc tính thành công'
                        : 'Thêm mới giá trị thuộc tính thành công';
                    ToastrHelper.Success(message);
                    this.eventService.RefreshLimitTextLink.emit();
                    return true;
                } else {
                    ToastrHelper.ErrorResult(result);
                    return false;
                }
            }, (e: any) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
        return false;
    }

    addNewItem() {
        if (this.items.length < 20) {
            let item = EntityHelper.createEntity(MSPropertiesEntity);
            item.Code = UtilityExHelper.randomText(6);
            item.Status = true;
            this.items.push(item);
        } else ToastrHelper.Error('Chỉ được phép thêm tối đa 20 giá trị thuộc tính');
        setTimeout(() => this.toggleDisableAddProperties(), 300);
    }

    validateDuplicate(): KeyValue[] {
        let checkeds: number[] = [],
            duplicates: KeyValue[] = [];
        for (let i = 0; i < this.items.length; i++) {
            let currentItem: MSPropertiesEntity = _.cloneDeep(this.items[i]);

            // remove fields not need check duplicate
            delete currentItem.Code;
            delete currentItem.Limit;
            delete currentItem.Status;
            const currentItemJson = JSON.stringify(currentItem);
            for (let j = i + 1; j < this.items.length; j++) {
                let index = checkeds.find(c => c == j + 1);
                if (index)
                    continue;
                let nextItem = _.cloneDeep(this.items[j]);

                // remove fields not need check duplicate
                delete nextItem.Code;
                delete nextItem.Limit;
                delete nextItem.Status;

                const nextItemJson = JSON.stringify(nextItem);
                if (currentItemJson == nextItemJson) {
                    let itemKeyValue = duplicates.find(c => c.key == (i + 1).toString());
                    if (itemKeyValue) {
                        itemKeyValue.value.push(j + 1);
                        checkeds.push(j + 1);
                    } else {
                        itemKeyValue = {
                            value: [j + 1],
                            key: (i + 1).toString(),
                        };
                        duplicates.push(itemKeyValue);
                        checkeds.push(j + 1);
                    }
                }
            }
        }
        return duplicates;
    }

    async toggleDisableAddProperties() {
        if (this.id)
            setTimeout(() => this.isUpadte = true, 1000);
        let valid = true;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            let columnns = this.columnValidates(i);
            valid = await validation(item, columnns, true);
            if (!valid)
                break;
        }
        this.disableAddProperties = !valid;
    }

    private columnValidates(i: number): string[] {
        let columnns = [];
        columnns.push('Limit');
        columnns.push('Status');
        this.properties.forEach((property: string) => {
            switch (property) {
                case 'need': columnns.push('Need'); break;
                case 'typeOfHouse': columnns.push('TypeOfHouse'); break;
                case 'typeOfRealEstate': {
                    if (this.items[i].Need != 'sang_nhuong') columnns.push('TypeOfRealEstate');
                } break;
                case 'project': columnns.push('Project'); break;
                case 'street': columnns.push('Street'); break;
                case 'ward': columnns.push('Ward'); break;
                case 'district': columnns.push('District'); break;
                case 'city': columnns.push('City'); break;
                case 'price': columnns.push('Price'); break;
                case 'area': columnns.push('Area'); break;
                case 'floor': columnns.push('Floor'); break;
                case 'bedroom': columnns.push('Bedroom'); break;
                case 'direction': columnns.push('Direction'); break;
                case 'facade': columnns.push('Facade'); break;
                case 'feature': columnns.push('Feature'); break;
                case 'wideRoad': columnns.push('WideRoad'); break;
                case 'legalPaper': columnns.push('LegalPaper'); break;
                case 'havingFE': columnns.push('HavingFE'); break;
                case 'utility': {
                    if (this.fields && this.fields[i] && this.fields[i].indexOf('utilities') >= 0) columnns.push('Utility');
                } break;
            }
        });
        return columnns;
    }

    removeItem(item: MSPropertiesEntity) {
        this.items = this.items.filter(c => c.Code != item.Code);
        setTimeout(() => this.toggleDisableAddProperties(), 300);
    }

    changeValue(item: OptionItem | OptionItem[], type: string, index: number) {
        let items = Array.isArray(item)
            ? _.cloneDeep(item)
            : [_.cloneDeep(item)];
        if (type == 'Nhu cầu' && items[0].value == 'sang_nhuong') {
            this.isTypeOfRealEstate[index] = false;
        } else this.isTypeOfRealEstate[index] = true;
    }

    cityChange(index: number) {
        if (this.enableEventChange) {
            this.enableEventChange = false;
            this.items[index].Project = null;
            setTimeout(() => this.enableEventChange = true, 300);
        }
        this.toggleDisableAddProperties();
    }
    projectChange(index: number) {
        if (this.enableEventChange) {
            this.enableEventChange = false;
            let projectIds = this.items[index].Project;
            if (projectIds?.length > 0) {
                this.service.selectedProject(projectIds).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result) && result.Object) {
                        let items = result.Object as any[];
                        if (items && items.length > 0) {
                            this.items[index].City = items.filter(c => c.CityId).length > 0
                                ? items.filter(c => c.CityId).map(c => c.CityId).filter((x, i, a) => a.indexOf(x) === i)
                                : null;
                            this.items[index].District = items.filter(c => c.DistrictId).length > 0
                                ? items.filter(c => c.DistrictId).map(c => c.DistrictId).filter((x, i, a) => a.indexOf(x) === i)
                                : null;
                            this.items[index].Ward = items.filter(c => c.WardId).length > 0
                                ? items.filter(c => c.WardId).map(c => c.WardId).filter((x, i, a) => a.indexOf(x) === i)
                                : null;
                            this.items[index].Street = items.filter(c => c.StreetId).length > 0
                                ? items.filter(c => c.StreetId).map(c => c.StreetId).filter((x, i, a) => a.indexOf(x) === i)
                                : null;
                        } else {
                            this.items[index].City = null;
                            this.items[index].Ward = null;
                            this.items[index].Street = null;
                            this.items[index].District = null;
                        }

                    }
                });
            } else {
                this.items[index].City = null;
                this.items[index].Ward = null;
                this.items[index].Street = null;
                this.items[index].District = null;
            }
            setTimeout(() => this.enableEventChange = true, 3000);
        }
        this.toggleDisableAddProperties();
    }
    districtChange(index: number) {
        if (this.enableEventChange) {
            this.enableEventChange = false;
            this.items[index].Project = null;
            setTimeout(() => this.enableEventChange = true, 300);
        }
        this.toggleDisableAddProperties();
    }

    typeOfHouseChange(index: number) {
        if (this.enableEventChange) {
            this.loadConfig(index);
        }
        setTimeout(() => this.enableEventChange = true, 1000);
        this.toggleDisableAddProperties();
    }

    private loadConfig(index: number) {
        if (!this.fields) this.fields = [];
        if (!this.options) this.options = [];

        this.fields[index] = null;
        this.options[index] = null;
        this.enableEventChange = false;
        if (this.items[index].Need && this.items[index].TypeOfHouse) {
            let item = {
                Need: this.items[index].Need,
                ObjectType: 1,
                TypeOfHouses: this.items[index].TypeOfHouse,
            };
            this.service.loadConfig(item).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let options = result.Object as any[],
                        names = options && options.map(c => c.Id);
                    if (options && options.length > 0) {
                        this.fields[index] = names;
                        options.forEach((option: any) => {
                            if (option.Options && option.Options.length > 0) {
                                if (!this.options[index]) this.options[index] = {};
                                this.options[index][option.Id] = option.Options.map((c: any) => new OptionItem(c.Id, c.Name));
                            }
                        });
                    }
                }
            });
        }
    }
}