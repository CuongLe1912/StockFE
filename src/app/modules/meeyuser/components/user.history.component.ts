import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { MLUserEntity, MLUserHistoryEntity } from '../../../_core/domains/entities/meeyland/ml.user.entity';
import { MLPartnerEntity } from '../../../_core/domains/entities/meeyland/ml.partner.entity';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { TableData } from '../../../_core/domains/data/table.data';

@Component({
    selector: 'ml-user-history',
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLUserHistoryComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MLUserHistoryEntity,
        Size: ModalSizeType.ExtraLarge,
        PageSizes: [5, 10, 20, 50, 100],
        Title: 'Lịch sử thao tác tài khoản',
    };
    @Input() params: any;
    @Input() meeyId: string;
    @Input() item: MLUserEntity;

    mlpartner: MLPartnerEntity[];

    constructor() {
        super();
        this.properties = [
            {
                Property: 'MeeyId', Title: 'Id', Type: DataType.String,
                Format: (item: any) => {
                    return UtilityExHelper.renderIdFormat(null, item.MeeyId);
                }
            },
            { Property: 'DateTime', Title: 'Ngày tháng', Type: DataType.DateTime },
            { Property: 'Action', Title: 'Tác động', Type: DataType.String },
            {
                Property: 'StatusBefore', Title: 'Trạng thái trước', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    if (!item.StatusBefore) return '';
                    let option: OptionItem = ConstantHelper.ML_USER_STATUS_TYPES.find(c => c.value == item.StatusBefore);
                    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + '</p>';
                    return text;
                }
            },
            {
                Property: 'StatusAfter', Title: 'Trạng thái sau', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    if (!item.StatusAfter) return '';
                    let option: OptionItem = ConstantHelper.ML_USER_STATUS_TYPES.find(c => c.value == item.StatusAfter);
                    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + '</p>';
                    return text;
                }
            },
            { Property: 'Actor', Title: 'Người thực hiện', Type: DataType.String },
            { Property: 'Client', Title: 'Nơi thực hiện', Type: DataType.String },
            {
                Property: 'Note', Title: 'Ghi chú', Type: DataType.String,
                Format: (item: any) => {
                    if (item.Note && item.Note.startsWith('{')) {
                        let text: string = '',
                            obj = JSON.parse(item.Note);
                        if (obj) {
                            if (obj.name && obj.name.length >= 2) text += '<p>Tên: ' + (obj.name[0] || 'N/A') + ' -> ' + (obj.name[1] || 'N/A') + '</p>';
                            if (obj.sex && obj.sex.length >= 2) text += '<p>Giới tính : ' + (this.getSex(obj.sex[0]) || 'N/A') + ' -> ' + (this.getSex(obj.sex[1]) || 'N/A') + '</p>';
                            if (obj.dob && obj.dob.length >= 2) text += '<p>Ngày sinh : ' + (obj.dob[0] || 'N/A') + ' -> ' + (obj.dob[1] || 'N/A') + '</p>';
                            if (obj.email && obj.email.length >= 2) text += '<p>Email: ' + (obj.email[0] || 'N/A') + ' -> ' + (obj.email[1] || 'N/A') + '</p>';
                            if (obj.avatar && obj.avatar.length >= 2) text += '<p>Ảnh: ' + (obj.avatar[0] || 'N/A') + ' -> ' + (obj.avatar[1] || 'N/A') + '</p>';
                            if (obj.phone && obj.phone.length >= 2) text += '<p>Số điện thoại: ' + (obj.phone[0] || 'N/A') + ' -> ' + (obj.phone[1] || 'N/A') + '</p>';
                            if (obj.address && obj.address.length >= 2) text += '<p>Địa chỉ: ' + (obj.address[0] || 'N/A') + ' -> ' + (obj.address[1] || 'N/A') + '</p>';
                            if (obj.company && obj.company.length >= 2) text += '<p>Công ty: ' + (obj.company[0] || 'N/A') + ' -> ' + (obj.company[1] || 'N/A') + '</p>';
                            if (obj.website && obj.website.length >= 2) text += '<p>Website: ' + (obj.website[0] || 'N/A') + ' -> ' + (obj.website[1] || 'N/A') + '</p>';
                            if (obj.introduce && obj.introduce.length >= 2) text += '<p>Giới thiệu: ' + (obj.introduce[0] || 'N/A') + ' -> ' + (obj.introduce[1] || 'N/A') + '</p>';
                            if (obj.identityCard && obj.identityCard.length >= 2) text += '<p>CMND : ' + (obj.identityCard[0] || 'N/A') + ' -> ' + (obj.identityCard[1] || 'N/A') + '</p>';
                            if (obj.objectType && obj.objectType.length >= 2) text += '<p>Loại tài khoản: ' + (obj.objectType[0] || 'N/A') + ' -> ' + (obj.objectType[1] || 'N/A') + '</p>';
                            else if (obj.accountType && obj.accountType.length >= 2) text += '<p>Loại tài khoản: ' + (obj.accountType[0] || 'N/A') + ' -> ' + (obj.accountType[1] || 'N/A') + '</p>';
                            if (obj.detailAddress && obj.detailAddress.length >= 2) {
                                let cityAfter = (obj.detailAddress[1].city && obj.detailAddress[1].city.name) || 'N/A',
                                    wardAfter = (obj.detailAddress[1].ward && obj.detailAddress[1].ward.name) || 'N/A',
                                    cityBefore = (obj.detailAddress[0].city && obj.detailAddress[0].city.name) || 'N/A',
                                    wardBefore = (obj.detailAddress[0].ward && obj.detailAddress[0].ward.name) || 'N/A',
                                    districtAfter = (obj.detailAddress[1].district && obj.detailAddress[1].district.name) || 'N/A',
                                    districtBefore = (obj.detailAddress[0].district && obj.detailAddress[0].district.name) || 'N/A';
                                text += cityBefore != cityAfter ? '<p>Tỉnh/Thành phố: ' + cityBefore + ' -> ' + cityAfter + '</p>' : '';
                                text += districtBefore != districtAfter ? '<p>Quận/Huyện: ' + districtBefore + ' -> ' + districtAfter + '</p>' : '';
                                text += wardBefore != wardAfter ? '<p>Phường/Xã: ' + wardBefore + ' -> ' + wardAfter + '</p>' : '';
                            }
                            if (obj.affiliateId) {
                                const partner = this.mlpartner.find(c => c.Id == obj.affiliateId);
                                if (partner)
                                text += '<p>Nguồn: ' + partner.Name + '</p>'
                            };
                        }
                        return text;
                    }
                    return item.Note;
                }
            },
        ];
    }

    async ngOnInit() {
        if (!this.item) {
            this.item = this.params && this.params['item'];
            if (this.item)
                this.obj.IsPopup = true;
        }
        let itemData = new TableData();
        await this.service.callApi('mlpartner', 'items', itemData, MethodType.Post).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.mlpartner = result.Object;
            }
        }, (e) => {
            ToastrHelper.Exception(e);
        });
        this.setPageSize(20);
        this.obj.Url = this.meeyId
            ? '/admin/MLUser/HistoriesByMeeyId/' + this.meeyId
            : '/admin/MLUser/Histories/' + this.item.Id;
        if (this.meeyId) this.obj.HidePaging = true;
        this.render(this.obj);
    }

    getSex(sex: string) {
        if (!sex) return sex;
        return sex == 'male' ? 'Nam' : 'Nữ';
    }
}