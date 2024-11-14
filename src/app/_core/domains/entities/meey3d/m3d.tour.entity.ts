import { BaseEntity } from "../base.entity";
import { M3DTourType } from "./enums/tour.type";
import { LookupData } from "../../data/lookup.data";
import { M3DTourStatusType } from "./enums/tour.status.type";
import { DateTimeType, StringType } from "../../enums/data.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { M3DCensorshipType } from "./enums/tour.censorship.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";

@TableDecorator()
export class M3DTourEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên Tour 3D', required: true })
    Title: string;

    @StringDecorator({ label: 'Mô tả tour' })
    Description: string;

    @ImageDecorator({
        multiple: false,
        label: 'Ảnh thumb',
        // accept: 'image/jpg,image/png',
        // description: 'Định dạng: jpg, png',
        customUpload: {
            needMove: true,
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyLandConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Image: string;

    @DropDownDecorator({ label: 'Loại tour', lookup: { items: ConstantHelper.M3D_TOUR_TYPE } })
    TourType: M3DTourType;

    @DropDownDecorator({ label: 'Danh mục', lookup: { items: ConstantHelper.M3D_TOUR_CATEGORY_TYPE } })
    CategoryId: string;

    @DropDownDecorator({ label: 'Mặt bằng', lookup: LookupData.ReferenceItems(ConstantHelper.M3D_GROUND_TOUR_TYPE)  })
    Ground: string;

    @StringDecorator({ label: 'Số điện thoại', type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @StringDecorator({ label: 'Link tour', type: StringType.Link })
    LinkTour: string;

    @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceItems(ConstantHelper.M3D_TOUR_STATUS_TYPE) })
    Status: M3DTourStatusType;
    // @StringDecorator({ label: 'Trạng thái tour', required: true })
    // Status: string;
    Slug : string;

    CreatedMeeyId : string;

    CreatedPhone : string;
    @DateTimeDecorator({ label: 'Ngày tạo', type: DateTimeType.DateTime })
    CreatedAt : Date
    @DateTimeDecorator({ label: 'Ngày sửa', type: DateTimeType.DateTime })
    UpdatedAt : Date
    @DropDownDecorator({ label: 'Trạng thái kiểm duyệt', lookup: LookupData.ReferenceItems(ConstantHelper.M3D_CENSORSHIP_TYPE) })
    Censorship: M3DCensorshipType
    CensorshipString : String
    @StringDecorator({ label: 'Lý do từ chối', max: 500, required: true })
    RejectReason:String
    _Id: string;

}
