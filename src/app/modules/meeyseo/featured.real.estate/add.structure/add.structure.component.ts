import * as _ from 'lodash';
import { MSSeoService } from '../../seo.service';
import { Component, OnInit } from "@angular/core";
import { AppInjector } from '../../../../app.module';
import { EnumHelper } from '../../../../_core/helpers/enum.helper';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { StructureType } from '../../../../_core/domains/entities/meeyseo/enums/ms.structure.type';
import { MSStructureEntity } from '../../../../_core/domains/entities/meeyseo/ms.featured.real.estate.entity';

@Component({
    templateUrl: './add.structure.component.html',
    styleUrls: [
        './add.structure.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class AddStructureComponent extends EditComponent implements OnInit {
    id: string;
    loading: boolean;
    service: MSSeoService;
    overview: string = '';
    isUpadte: boolean = false;
    dialog: AdminDialogService;
    overviewItems: OptionItem[] = [];
    item: MSStructureEntity = new MSStructureEntity();
    prevItem: MSStructureEntity = new MSStructureEntity();

    constructor() {
        super();
        this.service = AppInjector.get(MSSeoService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        await this.loadItem();
    }

    private async loadItem() {
        this.loading = true;
        this.id = this.params && this.params['id'];
        if (this.id) {
            this.isUpadte = true;
            await this.service.item('mshighlight/getstructure', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MSStructureEntity);
                    if (result.Object.data._id) this.item.Id = result.Object.data._id;
                    if (result.Object.data.name) this.overview = result.Object.data.name;
                    if (result.Object.data.priority) this.item.Priority = result.Object.data.priority;
                    if (result.Object.data.createdAt) this.item.CreatedDate = result.Object.data.createdAt;
                    if (result.Object.data.updatedDate) this.item.UpdatedDate = result.Object.data.updatedDate;
                    if (result.Object.data.structureId) this.item.StructureId = result.Object.data.structureId;
                    if (result.Object.data.property?.length > 0) this.item.Structure = result.Object.data.property;
                    if (result.Object.data.havingProperty) this.item.HavingProperty = result.Object.data.havingProperty;
                    if (result.Object.data.applyDetail == false || result.Object.data.applyDetail == true) this.item.ApplyDetail = result.Object.data.applyDetail;
                } else {
                    ToastrHelper.ErrorResult(result);
                    return;
                }
            });
        } else {
            this.item = new MSStructureEntity();
            this.item.Structure.push(StructureType.Need);
            for (let i = 0; i < this.item.Structure.length; i++) {
                const element = this.item.Structure[i];
                let item = ConstantHelper.MS_STRUCTURE_TYPES.find((c) => c.value == element);
                this.overviewItems.push({ value: item.value, label: item.label });
            }
            this.overview = this.overviewItems.map(c => {
                return c.label
            }).join(' + ');
        }
        this.prevItem = _.cloneDeep(this.item);
        this.loading = false;
    }

    async confirm() {
        let valid = this.item.ApplyDetail
            ? await validation(this.item)
            : await validation(this.item, ['Structure', 'ApplyDetail']);
        if (valid) {
            let type = this.item.StructureId ? 2 : 1;
            let url = 'AddOrUpdateStructure/' + type;
            if (this.item.StructureId) url += '?id=' + this.item.Id;
            let data = {
                "adminUserId": this.authen.account.Id,
                "data": {
                    "applyDetail": this.item.ApplyDetail,
                    "priority": this.item.Priority,
                    "properties": this.item.Structure,
                },
            }
            return await this.service.callApi('MSHighlight', url, data, MethodType.Post).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = this.item.Id
                        ? 'Cập nhật cấu trúc thành công'
                        : 'Thêm mới cấu trúc thành công';
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

    async result() {
        let valid = this.item.ApplyDetail
            ? await validation(this.item)
            : await validation(this.item, ['Structure', 'ApplyDetail']);
        if (valid) {
            let type = this.item.StructureId ? 2 : 1;
            let url = 'AddOrUpdateStructure/' + type;
            if (this.item.StructureId) url += '?id=' + this.item.Id;
            let data = {
                "adminUserId": this.authen.account.Id,
                "data": {
                    "applyDetail": this.item.ApplyDetail,
                    "priority": this.item.Priority,
                    "properties": this.item.Structure,
                },
            }
            return await this.service.callApi('MSHighlight', url, data, MethodType.Post).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MSStructureEntity);
                    if (!this.item.Structure) this.item.Structure = [];
                    this.item.Structure.push(StructureType.Need);
                    this.item.ApplyDetail = false;
                    this.overviewItems = [];
                    this.overview = '';
                    let message = this.item.Id
                        ? 'Cập nhật cấu trúc thành công'
                        : 'Thêm mới cấu trúc thành công';
                    ToastrHelper.Success(message);
                    return this.item;
                }
                ToastrHelper.ErrorResult(result);
                return false;
            }, (e: any) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
    }

    changeStructure() {
        this.overviewItems = [];
        let items = this.formatStructureTypes(this.item?.Structure),
            prevItems = this.formatStructureTypes(this.prevItem?.Structure);

        // City
        let prevCity = prevItems.find(c => c == StructureType.City),
            nextCity = items.find(c => c == StructureType.City);
        if (prevCity && !nextCity) {
            items = items.filter(c => c != StructureType.Ward);
            items = items.filter(c => c != StructureType.Street);
            items = items.filter(c => c != StructureType.District);
        }

        // District
        let prevDistrict = prevItems.find(c => c == StructureType.District),
            nextDistrict = items.find(c => c == StructureType.District);
        if (prevDistrict && !nextDistrict) {
            items = items.filter(c => c != StructureType.Ward);
            items = items.filter(c => c != StructureType.Street);
        }

        // TypeOfHouse
        let prevTypeOfHouse = prevItems.find(c => c == StructureType.TypeOfHouse),
            nextTypeOfHouse = items.find(c => c == StructureType.TypeOfHouse);
        if (prevTypeOfHouse && !nextTypeOfHouse) {
            items = items.filter(c => c != StructureType.Utility);
            items = items.filter(c => c != StructureType.HavingFE);
        }

        for (let i = 0; i < items.length; i++) {
            const element = items[i];

            // District
            if (element == StructureType.District) {
                let city = items.find(c => c == StructureType.City);
                if (!city)
                    items.push(StructureType.City);
            }

            // Ward or Street
            if (element == StructureType.Ward || element == StructureType.Street) {
                let district = items.find(c => c == StructureType.District);
                if (!district)
                    items.push(StructureType.District);

                let city = items.find(c => c == StructureType.City);
                if (!city)
                    items.push(StructureType.City);
            }

            // HavingFE or Utility
            if (element == StructureType.HavingFE || element == StructureType.Utility) {
                let typeOfHouse = items.find(c => c == StructureType.TypeOfHouse);
                if (!typeOfHouse)
                    items.push(StructureType.TypeOfHouse);
            }
        }

        let sortItems = [];
        let keys = EnumHelper.exportOptionItems(StructureType);
        keys.forEach((option: OptionItem) => {
            let element = items.find(c => c == option.value);
            if (element) {
                sortItems.push(element);
            }
        });

        for (let i = 0; i < sortItems.length; i++) {
            const element = sortItems[i];
            let item = ConstantHelper.MS_STRUCTURE_TYPES.find((c) => c.value == element);
            this.overviewItems.push({ value: item.value, label: item.label });
        }
        this.overview = this.overviewItems.map(c => {
            return c.label
        }).join(' + ');
        this.item.Structure = sortItems;
        this.prevItem = _.cloneDeep(this.item);
    }

    private formatStructureTypes(structure: any): StructureType[] {
        let json: string = structure?.toString();
        if (json) {
            let items: StructureType[] = json.indexOf('[') >= 0
                ? JSON.parse(json)
                : json.split(',');
            return items;
        } return [];
    }
}