import { NotifyType } from "../enums/notify.type";

export class NotifyDto {
    Title: string;
    UserId: number;
    DateTime: Date;
    IsRead: boolean;
    Content: string;
    Type: NotifyType;
    RelativeTime: string;
}