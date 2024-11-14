import { BaseEntity } from "../base.entity";
import { DateTimeType } from "../../enums/data.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { FileDecorator } from "../../../../_core/decorators/file.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";

@TableDecorator({ title: 'Import Text Link' })
export class MSFileImportEntity extends BaseEntity {
    @FileDecorator({
        required: true,
        label: 'Import Auto',
        description: 'Định dạng: xlsx',
        customUpload: {
            data: [{ key: 'file', value: 'data' }],
            url: AppConfig.MeeySeoConfig.Api + '/v4/admin/tag-import/auto',
            authorization: { key: AppConfig.MeeySeoConfig.UserName, value: AppConfig.MeeySeoConfig.Password },
        },
        accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    FileAuto: string;
}

@TableDecorator({ title: 'File Import' })
export class MSSeoFileEntity extends BaseEntity {
    @NumberDecorator()
    Size: number;

    @DateTimeDecorator({ type: DateTimeType.Date, label: 'Ngày cập nhật' })
    DateTime: Date;
}

@TableDecorator({ title: 'Tag File Import' })
export class MSSeoTagFileEntity extends BaseEntity {    
    @StringDecorator()
    Name: boolean = false;
}