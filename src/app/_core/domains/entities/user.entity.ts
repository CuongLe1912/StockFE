import { CityEntity } from "./city.entity";
import { RoleEntity } from "./role.entity";
import { BaseEntity } from "./base.entity";
import { TeamEntity } from "./team.entity";
import { CountryEntity } from "./country.entity";
import { GenderType } from "../enums/gender.type";
import { PositionEntity } from "./position.entity";
import { DistrictEntity } from "./district.entity";
import { DepartmentEntity } from "./department.entity";
import { UserStatusType } from "../enums/user.status.type";
import { DateTimeType, StringType } from "../enums/data.type";
import { ImageDecorator } from "../../decorators/image.decorator";
import { TableDecorator } from "../../decorators/table.decorator";
import { LookupData, LookupUniqueData } from "../data/lookup.data";
import { StringDecorator } from "../../decorators/string.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator, DateTimeFormat } from "../../decorators/datetime.decorator";

@TableDecorator()
export class UserEntity extends BaseEntity {
    @BooleanDecorator()
    Locked: boolean;

    @DropDownDecorator({ allowSearch: true, lookup: LookupData.ReferenceEnum(UserStatusType) })
    LockedStatus: UserStatusType;

    @ImageDecorator({ url: 'upload/uploadavatar' })
    Avatar: string;

    @BooleanDecorator()
    IsAdmin: boolean;

    @BooleanDecorator()
    IsSale: boolean;

    @BooleanDecorator()
    IsSupport: boolean;

    @BooleanDecorator({ label: 'Điều chuyển tin đăng' })
    IsAutoTransferArticle: boolean;

    @BooleanDecorator({ label: 'Điều chuyển khách hàng' })
    IsAutoTransferCustomer: boolean;

    @StringDecorator({ required: true, type: StringType.Account, max: 100 })
    FullName: string;

    @StringDecorator({ required: true, type: StringType.Email, max: 80, unique: LookupUniqueData.Reference(UserEntity, 'Email') })
    Email: string;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10, unique: LookupUniqueData.Reference(UserEntity, 'Phone') })
    Phone: string;

    @StringDecorator({ required: true, type: StringType.MultiText, max: 200 })
    ReasonLock: string;

    @DateTimeDecorator({ type: DateTimeType.Date, format: DateTimeFormat.DMY, view: 'years', max: new Date() })
    Birthday: Date;

    @StringDecorator({ type: StringType.MultiText, max: 500 })
    Description: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(GenderType) })
    Gender: GenderType;

    @DropDownDecorator({ required: true, allowSearch: true, multiple: true, lookup: LookupData.Reference(DepartmentEntity) })
    DepartmentIds: number[];

    @DropDownDecorator({ required: true, allowSearch: true, multiple: true, lookup: LookupData.Reference(TeamEntity) })
    TeamIds: number[];

    @DropDownDecorator({ required: true, allowSearch: true, multiple: true, lookup: LookupData.Reference(PositionEntity) })
    PositionIds: number;

    @DropDownDecorator({ required: true, allowSearch: true, multiple: true, lookup: LookupData.Reference(RoleEntity) })
    RoleIds: number[];

    @DropDownDecorator({ lookup: LookupData.Reference(CountryEntity) })
    CountryId: number;

    @DropDownDecorator({ allowSearch: true, lookup: LookupData.Reference(CityEntity) })
    CityId: number;

    @DropDownDecorator({ allowSearch: true, multiple: true, lookup: LookupData.Reference(DistrictEntity, null, null, 'CityId') })
    DistrictIds: number;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(PositionEntity) })
    PositionId: number;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(DepartmentEntity) })
    DepartmentId: number[];
}