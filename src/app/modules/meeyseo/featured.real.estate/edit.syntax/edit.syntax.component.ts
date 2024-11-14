declare var $: any
import * as _ from 'lodash';
import { MSSeoService } from '../../seo.service';
import { Component, OnInit } from "@angular/core";
import { AppInjector } from '../../../../app.module';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MSSyntaxEntity } from '../../../../_core/domains/entities/meeyseo/ms.featured.real.estate.entity';
@Component({
    templateUrl: './edit.syntax.component.html',
    styleUrls: [
        './edit.syntax.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditSyntaxComponent extends EditComponent implements OnInit {
    id: string;
    overview: string;
    showCombobox: boolean;
    service: MSSeoService;
    keyItems: string[] = [];
    event: AdminEventService;
    loading: boolean = false;
    postionItems: OptionItem[];
    dialog: AdminDialogService;
    overviewItems: string[] = [];
    allPostionItems: OptionItem[] = [];
    overviewPostionItems: OptionItem[] = [
        { value: 'need', label: 'Sau Nhu cầu' },
        { value: 'typeOfHouse', label: 'Sau Loại Nhà Đất' },
        { value: 'typeOfRealEstate', label: 'Sau Loại Hình BĐS' },
        { value: 'project', label: 'Sau Dự Án' },
        { value: 'street', label: 'Sau Đường, Phố' },
        { value: 'ward', label: 'Sau Phường/Xã' },
        { value: 'district', label: 'Sau Quận/Huyện' },
        { value: 'city', label: 'Sau Tỉnh/Thành Phố' },
        { value: 'price', label: 'Sau Giá' },
        { value: 'area', label: 'Sau Diện Tích' },
        { value: 'floor', label: 'Sau Số Tầng' },
        { value: 'bedroom', label: 'Sau Số Phòng Ngủ' },
        { value: 'direction', label: 'Sau Hướng' },
        { value: 'facade', label: 'Sau Mặt Tiền' },
        { value: 'feature', label: 'Sau Đặc Điểm Nổi Trội' },
        { value: 'wideRoad', label: 'Sau Đường Rộng' },
        { value: 'legalPaper', label: 'Sau Giấy Tờ Pháp Lý' },
        { value: 'havingFE', label: 'Sau Nội thất, thiết bị' },
        { value: 'utility', label: 'Sau Tiện ích' }
    ];
    item: MSSyntaxEntity = new MSSyntaxEntity();

    constructor() {
        super();
        this.service = AppInjector.get(MSSeoService);
        this.event = AppInjector.get(AdminEventService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        await this.loadItem();
        for (let i = 0; i < this.keyItems.length; i++) {
            const element = this.keyItems[i];
            let keyItem = this.overviewPostionItems?.find(c => c.value == element);
            let inputLabel = 'input_' + this.item.Position;
            let input = this.overviewItems.find(c => c == inputLabel);
            if (keyItem && !input) this.allPostionItems.push(keyItem);
        }
    }

    private async loadItem() {
        this.loading = true;
        this.id = this.params && this.params['id'];

        if (this.id) {
            await this.service.item('mshighlight/getproperty', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MSSyntaxEntity);
                    if (result.Object.data._id) this.item.Id = result.Object.data._id;
                    if (result.Object.data.limit) this.item.Limit = result.Object.data.limit;
                    if (result.Object.data.propertyId) this.item.SyntaxId = result.Object.data.propertyId;
                    if (result.Object.data.createdAt) this.item.CreatedDate = result.Object.data.createdAt;
                    if (result.Object.data.structure.name) this.overview = result.Object.data.structure.name;
                    if (result.Object.data.updatedDate) this.item.UpdatedDate = result.Object.data.updatedDate;
                    if (result.Object.data.status) this.item.Status = result.Object.data.status == 1 ? true : false;
                    if (result.Object.data.property?.length > 0) {
                        for (let i = 0; i < result.Object.data.property.length; i++) {
                            const element = result.Object.data.property[i];
                            if (element.type == 1) {
                                this.overviewItems.push(element.label);
                                this.keyItems.push(element.key);
                            } else {
                                let before = result.Object.data.property[i - 1];
                                let inputLabel = 'input_' + before.key;
                                this.overviewItems.push(inputLabel);
                                setTimeout(() => {
                                    $('#' + inputLabel).val(element.label);
                                }, 500);
                            }
                        }
                    }
                } else {
                    ToastrHelper.ErrorResult(result);
                    return;
                }
            });
        }
        this.buildPostionOptionItems();
        this.loading = false;
    }

    async confirm() {
        let valid = await validation(this.item);
        if (valid) {
            let data = {
                "adminUserId": this.authen.account.Id,
                "data": {
                    "limit": this.item.Limit,
                    "status": this.item.Status ? 1 : 2,
                },
            };
            let properties = [];
            for (let i = 0; i < this.overviewItems.length; i++) {
                let property = {};
                const element = this.overviewItems[i];
                if (element.indexOf('input_') >= 0) {
                    let id = element;
                    let value = $('#' + id).val().trim();
                    if (!value) continue;
                    property = {
                        "label": value,
                        "type": 2,
                    }
                } else {
                    let labelItem = 'Sau ' + element;
                    let index = this.overviewPostionItems.findIndex(c => c.label.toLowerCase() == labelItem.toLowerCase());
                    property = {
                        "key": this.overviewPostionItems[index].value,
                        "type": 1,
                    }
                }
                properties.push(property);
            }
            data['data']['property'] = properties;
            return await this.service.callApi('MSHighlight', 'UpdateSyntax?id=' + this.item.Id, data, MethodType.Post).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Cập nhật cú pháp thành công');
                    this.event.RefreshLimitTextLink.emit();
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

    closePosition() {
        this.showCombobox = false;
        this.buildPostionOptionItems();
    }

    choicePosition() {
        if (this.item.Position) {
            let inputLabel = 'input_' + this.item.Position;
            let input = this.overviewItems.find(c => c == inputLabel);
            if (!input) {
                let optionItem = this.allPostionItems.find(c => c.value == this.item.Position);
                if (optionItem) {
                    let label = optionItem.label.replace('Sau', '').trim().toLowerCase();
                    let index = this.overviewItems.findIndex(c => c.toLowerCase() == label);
                    if (index >= 0) {
                        this.overviewItems.splice(index + 1, 0, inputLabel);
                    }
                }
            }
        }
        this.closePosition();
    }

    addText() {
        this.showCombobox = true;
        this.buildPostionOptionItems();
    }

    private buildPostionOptionItems() {
        this.postionItems = [];
        setTimeout(() => {
            this.item.Position = null;
            this.allPostionItems.forEach((item: OptionItem) => {
                let inputLabel = 'input_' + item.value;
                let input = this.overviewItems.find(c => c == inputLabel);
                if (!input) {
                    this.postionItems.push(item);
                }
            });
        }, 300);
    }
}