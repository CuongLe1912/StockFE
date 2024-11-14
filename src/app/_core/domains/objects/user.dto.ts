import { GenderType } from '../enums/gender.type';
import { UserEntity } from '../entities/user.entity';
import { UserActivityDto } from './user.activity.dto';
import { ProductionType } from '../enums/project.type';
import { CountryEntity } from '../entities/country.entity';
import { PositionEntity } from '../entities/position.entity';
import { DepartmentEntity } from '../entities/department.entity';
import { ImageDecorator } from '../../decorators/image.decorator';
import { TableDecorator } from '../../decorators/table.decorator';
import { LookupData, LookupUniqueData } from '../data/lookup.data';
import { StringDecorator } from '../../decorators/string.decorator';
import { NumberDecorator } from '../../decorators/number.decorator';
import { OrganizationEntity } from '../entities/organization.entity';
import { BooleanDecorator } from '../../decorators/boolean.decorator';
import { DropDownDecorator } from '../../decorators/dropdown.decorator';
import { BooleanType, DateTimeType, NumberType, StringType } from '../enums/data.type';
import { DateTimeDecorator, DateTimeFormat } from '../../decorators/datetime.decorator';

@TableDecorator()
export class UserDto {
    @NumberDecorator()
    Id: number;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @StringDecorator({ required: true, type: StringType.Email, max: 150 })
    Email: string;

    @BooleanDecorator({ type: BooleanType.RadioButton, lookup: LookupData.ReferenceEnum(GenderType) })
    Gender: GenderType;

    @ImageDecorator({ url: 'upload/uploadavatar' })
    Avatar: string;

    @BooleanDecorator()
    Locked: boolean;

    @DateTimeDecorator({ type: DateTimeType.Date, format: DateTimeFormat.DMY, view: 'years', max: new Date() })
    Birthday: Date;

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    FullName: string;

    @DropDownDecorator({ label: 'Tài khoản', lookup: LookupData.ReferenceUrl('/user/Lookup', ['FullName', 'Email'], 'Email'), autoSelect: true })
    Account: string;

    Expires?: Date;
    Token?: string;
    Allow?: boolean;
    Activities?: UserActivityDto[];
}

export class UserLoginDto {
    Email: string;
    Password?: string;
    DialingCode: string;
    Phone: string;
    Activity?: UserActivityDto
}

export class UserUpdateDto {
    Birthday: Date;
    Avatar: string;
    FullName: string;
    Gender: GenderType;
}

export class UserForgotDto {
    Email: string;
    Channel: string;
    Password: string;
    DialingCode: string;
    Phone: string;
    VertifyCode: string;
    ConfirmPassword: string;

    constructor() {
        this.Channel = 'sms';
    }
}

export class UserRegisterDto {
    RefBy?: string;
    Email: string;
    Channel: string;
    FullName: string;
    Password: string;
    DialingCode: string;
    Phone: string;
    VertifyCode?: string;
    Activity?: UserActivityDto;

    constructor() {
        this.Channel = 'sms';
    }
}

export class UserResetPasswordDto {
    Email: string;
    Channel: string;
    Password: string;
    DialingCode: string;
    Phone: string;
    VertifyCode: string;
    ConfirmPassword: string;
    Activity?: UserActivityDto;

    constructor() {
        this.Channel = 'sms';
    }
}

export class AdminUserDto {
    Id: number;
    Email: string;
    Expires?: Date;
    Token?: string;
    Avatar?: string;
    Balance: number;
    MeeyId: string;
    RefCode: string;
    FullName: string;
    Locked?: boolean;
    UserName: string;
    IsSale?: boolean;
    IsAdmin?: boolean;
    Gender: GenderType;
    IsSupport?: boolean;
    DepartmentId?: number;
    ExtPhoneNumber: number;
    Activities: UserActivityDto[];
    ProductionType?: ProductionType;
    NeedOTP?: boolean;
}

@TableDecorator()
export class AdminUserLoginDto {
    @StringDecorator({ required: true, type: StringType.Account, max: 100 })
    UserName: string;

    @StringDecorator({ required: true, type: StringType.Password, min: 8, max: 100 })
    Password?: string;

    @StringDecorator({ required: true, type: StringType.Password, min: 8, max: 100, requiredMatch: 'Password' })
    ConfirmPassword?: string;

    @BooleanDecorator({ label: 'Ghi nhớ đăng nhập' })
    RememberMe?: boolean;

    @StringDecorator({ required: true, type: StringType.Otp, min: 6, max: 6 })
    Otp?: string;

    Activity?: UserActivityDto
}

@TableDecorator()
export class AdminUserUpdateDto {
    @NumberDecorator()
    Id: number;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10, unique: LookupUniqueData.Reference(UserEntity, 'PhoneNumber') })
    Phone: string;

    @StringDecorator({ required: true, type: StringType.Email, max: 150, unique: LookupUniqueData.Reference(UserEntity, 'Email') })
    Email: string;

    @BooleanDecorator({ type: BooleanType.RadioButton, lookup: LookupData.ReferenceEnum(GenderType) })
    Gender: GenderType;

    @ImageDecorator({ url: 'upload/uploadavatar' })
    Avatar: string;

    @BooleanDecorator()
    Locked: boolean;

    @StringDecorator({ type: StringType.MultiText, max: 550 })
    Address: string;

    @NumberDecorator({ label: 'Số máy lẻ', type: NumberType.Text })
    ExtPhoneNumber: number;

    @StringDecorator({ label: 'Mã giới thiệu', type: StringType.Code })
    RefCode: string;

    @DateTimeDecorator({ type: DateTimeType.Date, format: DateTimeFormat.DMY, view: 'years', max: new Date() })
    Birthday: Date;

    @StringDecorator({ required: true, type: StringType.Account, max: 100 })
    FullName: string;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(CountryEntity) })
    CountryId: number;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(PositionEntity) })
    PositionId: number;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(DepartmentEntity) })
    DepartmentId: number;

    @BooleanDecorator({ placeholder: 'Website', lookup: LookupData.Reference(OrganizationEntity) })
    RoleOrganizationId: number[];

    @BooleanDecorator({ placeholder: 'Website', lookup: LookupData.Reference(OrganizationEntity) })
    TeamOrganizationId: number[];

    Status: string;
    TeamIds: number[];
    RoleIds: number[];
    Permissions: any[];
    ProductIds: number[];
    DistrictIds: number[];
}

@TableDecorator()
export class AdminUserProfileDto {
    @NumberDecorator()
    Id: number;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10, unique: LookupUniqueData.ReferenceUrl('/user/profileExists', 'PhoneNumber') })
    Phone: string;

    @StringDecorator({ required: true, type: StringType.Email, max: 150, unique: LookupUniqueData.ReferenceUrl('/user/profileExists', 'Email') })
    Email: string;

    @ImageDecorator({ url: 'upload/uploadavatar' })
    Avatar: string;

    @DateTimeDecorator({ type: DateTimeType.Date, format: DateTimeFormat.DMY, view: 'years', max: new Date() })
    Birthday: Date;

    @StringDecorator({ required: true, type: StringType.Account, max: 100 })
    FullName: string;

    @StringDecorator({ type: StringType.Text })
    Team: string;

    @StringDecorator({ type: StringType.Text })
    Role: string;

    @StringDecorator({ type: StringType.Text })
    Department: string;

    @StringDecorator({ type: StringType.Text })
    Position: string;

    @DateTimeDecorator({ type: DateTimeType.DateTime })
    LastLogin: Date;

    @StringDecorator({ label: 'Số máy lẻ' })
    ExtPhoneNumber: string;

    @StringDecorator({ label: 'Mã giới thiệu', type: StringType.Code })
    RefCode: string;
}

@TableDecorator()
export class AdminUserResetPasswordDto {
    @StringDecorator({ required: true, type: StringType.Password, min: 8, max: 100 })
    OldPassword: string;

    @StringDecorator({ required: true, type: StringType.Password, min: 8, max: 100 })
    Password: string;

    @StringDecorator({ required: true, type: StringType.Password, min: 8, max: 100, requiredMatch: 'Password' })
    ConfirmPassword: string;

    Activity?: UserActivityDto;
}

@TableDecorator()
export class AdminUserForgotPasswordDto {
    @StringDecorator({ required: true, type: StringType.Email })
    Email: string;
}