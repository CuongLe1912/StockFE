import { HubType } from "../enums/hub.type";

export class HubDto {
    Id: number;
    Name: string;
    Code: string;
    Phone: string;
    Email: string;
    Type: HubType;
    Avatar: string;
    Letter?: string;
    Online: boolean;
    FullName: string;
    PulseCount: number;
}