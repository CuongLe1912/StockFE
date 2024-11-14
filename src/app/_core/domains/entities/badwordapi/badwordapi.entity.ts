import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { FileDecorator } from "../../../../_core/decorators/file.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";

@TableDecorator({ title: 'BadwordApi' })
export class BadwordApiEntity extends BaseEntity {
    @NumberDecorator()
    Index: number;
    @StringDecorator({ label: 'Tên', type: StringType.Text, max: 150, required: true })
    Text: string;

    createDate : Date;
    updateDate : Date;
    userUpdate: string;
    @FileDecorator({ label: 'Import Badwords', required: true, url: 'BadwordApi/Upload',size: 2, accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/octet-stream,text/csv', description: 'Định dạng: xlsx, xls', regexTypes: /.(xls|xlsx)/, })
    FileImport: string;
}
export class ResultApiBadword{
    success : boolean;
    message : string;
    data : BadwordApiEntity
}
export class ResponseImportBadword {
    success : boolean;
    countSuccess : number;
    wordSuccess : string;
}