import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { StringType } from "../enums/data.type";
import { MessageStatusType } from "../enums/message.status.type";

TableDecorator()
export class MessageDto {
    Files?: string;
    DateTime?: Date;
    Right?: boolean;
    Status?: MessageStatusType;

    @StringDecorator({ required: true, max: 200, min: 1, placeholder: 'Nhập tin nhắn...', type: StringType.Text })
    Content: string;
    
    SendId?: number;
    SendName?: string;
    SendAvatar?: string;
    SendShortName?: string;

    ReceiveId?: number;
    ReceiveName?: string;
    ReceiveAvatar?: string;
    ReceiveShortName?: string;

    TeamId?: number;
    TeamName?: string;
    TeamAvatar?: string;
    
    GroupId?: number;
    GroupName?: string;
    GroupAvatar?: string;
}