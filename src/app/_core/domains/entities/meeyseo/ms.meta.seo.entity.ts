import { BaseEntity } from "../base.entity";
import { LookupData } from "../../data/lookup.data";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { BooleanType, DateTimeType, StringType } from "../../enums/data.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { MSMetaSeoCategoryType, MSMetaSeoCategoryTypeV2, MSMetaSeoType } from "./enums/ms.meta.seo.type";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";

@TableDecorator({ title: 'META SEO' })
export class MSMetaSeoEntity extends BaseEntity {
    @StringDecorator({ label: 'Id', type: StringType.Text, })
    _Id: string;

    @DropDownDecorator({ label: 'Loại', lookup: LookupData.ReferenceItems(ConstantHelper.MS_META_SEO_TYPES_V1) })
    Type: MSMetaSeoType;

    @StringDecorator({ label: 'Name', max: 300, type: StringType.Text, })
    Name: string;

    @DropDownDecorator({ label: 'Danh mục', lookup: LookupData.ReferenceItems(ConstantHelper.MS_META_SEO_CATEGORY_TYPES, null, null, 'Type'), autoHide: true })
    Category: MSMetaSeoCategoryType;

    @StringDecorator({ label: 'Url', type: StringType.Text, })
    Url: string;

    @StringDecorator({ label: 'Meta Title', max: 300, })
    MetaTitle: string;

    @StringDecorator({ label: 'Meta Keywords', max: 1000, })
    MetaKeyword: string;

    @StringDecorator({ label: 'Meta Description', max: 300, })
    MetaDescription: string;

    @StringDecorator({ label: 'Canonical URL', max: 300, customValidators: [{ pattern: /(^[\w!:.+\-\/]+$)/i, message: 'Canonical không đúng định dạng' }] })
    CanonicalUrl : string;

    @StringDecorator({ label: 'Body Content', type: StringType.Html, max: 500000 })
    Content: string;

    @BooleanDecorator({ label: 'Template', type: BooleanType.RadioButton, lookup: LookupData.ReferenceUrl('/MSMetaSeo/LookupTemplate', ['Name'], 'Content', ) })
    Template: string;

    @DateTimeDecorator({ label: 'Ngày cập nhật', type: DateTimeType.DateRange })
    FilterUpdateDate: Date;
}

@TableDecorator({ title: 'META SEO V2' })
export class MSMetaSeoV2Entity extends BaseEntity {
    @StringDecorator({ label: 'Id', type: StringType.Text, })
    _Id: string;

    @DropDownDecorator({ label: 'Loại', lookup: LookupData.ReferenceItems(ConstantHelper.MS_META_SEO_TYPES_V2) })
    Type: MSMetaSeoType;

    @StringDecorator({ label: 'Name', max: 300, type: StringType.Text, })
    Name: string;

    @DropDownDecorator({ label: 'Danh mục', lookup: LookupData.ReferenceItems(ConstantHelper.MS_META_SEO_CATEGORY_TYPES_V2, null, null, 'Type'), autoHide: true })
    Need: MSMetaSeoCategoryTypeV2;

    @StringDecorator({ label: 'Url', type: StringType.Text, })
    Url: string;

    @StringDecorator({ label: 'Meta Title', max: 300, })
    MetaTitle: string;

    @StringDecorator({ label: 'Meta Keywords', max: 1000, })
    MetaKeyword: string;

    @StringDecorator({ label: 'Meta Description', max: 300, })
    MetaDescription: string;

    @StringDecorator({ label: 'Canonical URL', max: 300, customValidators: [{ pattern: /(^[\w!:.+\-\/]+$)/i, message: 'Canonical không đúng định dạng' }] })
    CanonicalUrl : string;

    @StringDecorator({ label: 'Body Content', type: StringType.Html, max: 500000 })
    Content: string;

    @BooleanDecorator({ label: 'Template', type: BooleanType.RadioButton, lookup: LookupData.ReferenceUrl('/MSMetaSeo/LookupTemplate', ['Name'], 'Content', ) })
    Template: string;

    @DateTimeDecorator({ label: 'Ngày cập nhật', type: DateTimeType.DateRange })
    FilterUpdateDate: Date;
}