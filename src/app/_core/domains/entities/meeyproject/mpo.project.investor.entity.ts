import { BaseEntity } from "../base.entity";
import { MethodType } from "../../enums/method.type";
import { LookupUniqueData } from "../../data/lookup.data";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { FileDecorator } from "../../../../_core/decorators/file.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";
import { BooleanType, DropdownLoadType, StringType } from "../../enums/data.type";

@TableDecorator({ title: 'Chủ đầu tư' })
export class MPOProjectInvestorEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên chủ đầu tư', required: true, type: StringType.AutoComplete, max: 150, unique: LookupUniqueData.ReferenceUrl('/mpoprojectInvestor/exists'), lookup: { url: '/MPOProject/LookupInvestor', loadType: DropdownLoadType.Ajax } })
    Name: string;

    // @StringDecorator({ label: 'Giới thiệu', required: true, type: StringType.MultiText, max: 200 })
    @StringDecorator({ label: 'Giới thiệu', required: true, type: StringType.MultiText, max: 10000 })
    Description: string;

    @BooleanDecorator({
        label: 'Trạng thái lựa chọn',
        type: BooleanType.RadioButton,
        lookup: {
            items: [
                { value: true, label: 'Cho phép Chọn', selected: true },
                { value: false, label: 'Không cho Chọn' }
            ]
        }
    })
    Active?: boolean;

    @ImageDecorator({
        size: 10,
        label: 'Logo',
        accept: 'image/jpg,image/jpeg,image/png,.heic',
        regexTypes: /.(png|jpg|jpeg|heic)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Logo: any;

    @FileDecorator({
        size: 10,
        required: true,
        label: 'Tên file',
        description: 'Định dạng: xls, xlxs',
        accept: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        customUpload: {
            method: MethodType.Post,
            url: AppConfig.MeeyProjectConfig.Api + '/v1/admin/import/investors',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyProjectConfig.UserName, value: AppConfig.MeeyProjectConfig.Password },
            data: [{ key: 'files', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    File: any;
}