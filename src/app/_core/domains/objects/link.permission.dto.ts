export class LinkPermissionDto {
    Name?: string;
    Link?: string;
    Group?: string;
    Order?: number;
    Active?: boolean;
    CssIcon?: string;
    ParentId: number;
    GroupOrder?: number;
    Childrens?: LinkPermissionDto[];
}