import { BaseEntity } from "./base.entity";
import { FolderEntity } from "./folder.entity";
import { LookupData } from "../data/lookup.data";
import { DateTimeType, StringType } from "../enums/data.type";
import { FileDecorator } from "../../decorators/file.decorator";
import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator, DateTimeFormat } from "../../decorators/datetime.decorator";

@TableDecorator({ title: 'Tệp' })
export class FileEntity extends BaseEntity {
    @StringDecorator({ type: StringType.Text, max: 100 })
    Name: string;

    @StringDecorator({ type: StringType.Text, max: 500 })
    Link: string;

    @NumberDecorator()
    Size: number;

    @StringDecorator({ type: StringType.Text, max: 50 })
    Extension: string;

    @DropDownDecorator({ lookup: LookupData.Reference(FolderEntity) })
    FolderId: number;

    @DateTimeDecorator({ type: DateTimeType.DateTime, format: DateTimeFormat.DMYHM })
    DateTime?: Date;

    @FileDecorator({ label: 'Chọn tệp', multiple: true, url: 'File/Upload' })
    File: string;
    
    Active?: boolean;
}