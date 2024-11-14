import { ActionType } from "../enums/action.type";

export class ButtonData {
    public name?: string;
    public icon?: string;
    public hide?: boolean;
    public tooltip?: string;
    public className?: string;
    public systemName: string;
    public controllerName?: string;
    public processButton?: boolean;
    public toggleCheckbox?: boolean; //ẩn hiện theo checkbox
    public click?: (obj?: any) => any;
    public ctrClick?: (obj?: any) => any;
    public processSecondButton?: boolean;
    public hidden?: (obj?: any) => boolean;
}

export class ActionData extends ButtonData {
    public static back(click?: () => any): ActionData {
        let item: ActionData = {
            name: 'Quay lại',
            icon: 'la la-hand-o-left',
            systemName: ActionType.Empty,
            className: 'btn btn-outline-secondary',
            click: () => {
                if (click) click();
                else history.back();
            }
        }
        return item;
    }

    public static addNew(click?: () => any): ActionData {
        let item: ActionData = {
            icon: 'la la-plus',
            name: ActionType.AddNew,
            className: 'btn btn-primary',
            systemName: ActionType.AddNew,
            click: () => {
                if (click) click();
            }
        }
        return item;
    }

    public static reload(click?: () => any): ActionData {
        let item: ActionData = {
            name: 'Tải lại',
            icon: 'la la-refresh',
            systemName: ActionType.Empty,
            className: 'btn btn-success',
            click: () => {
                if (click) click();
            }
        }
        return item;
    }

    public static resetCache(click?: () => any): ActionData {
        let item: ActionData = {
            name: 'Xóa bộ nhớ',
            icon: 'la la-retweet',
            className: 'btn btn-warning',
            systemName: ActionType.ResetCache,
            click: () => {
                if (click) click();
            }
        }
        return item;
    }

    public static edit(click?: (item: any) => any): ActionData {
        let item: ActionData = {
            icon: 'la la-pencil',
            name: ActionType.Edit,
            systemName: ActionType.Edit,
            className: 'btn btn-primary',
            click: (item: any) => {
                if (click) click(item);
            }
        }
        return item;
    }

    public static cancel(click?: (item: any) => any): ActionData {
        let item: ActionData = {
            icon: 'la la-remove',
            name: ActionType.Cancel,
            className: 'btn btn-danger',
            systemName: ActionType.Cancel,
            click: (item: any) => {
                if (click) click(item);
            }
        }
        return item;
    }

    public static confirm(click?: (item: any) => any): ActionData {
        let item: ActionData = {
            icon: 'la la-check',
            name: ActionType.Edit,
            systemName: ActionType.Edit,
            className: 'btn btn-primary',
            click: (item: any) => {
                if (click) click(item);
            }
        }
        return item;
    }

    public static view(click?: (item: any) => any): ActionData {
        let item: ActionData = {
            icon: 'la la-eye',
            name: ActionType.View,
            systemName: ActionType.View,
            className: 'btn btn-warning',
            click: (item: any) => {
                if (click) click(item);
            }
        }
        return item;
    }

    public static viewDetail(click?: (item: any) => any): ActionData {
        let item: ActionData = {
            icon: 'la la-eye',
            name: ActionType.View,
            systemName: ActionType.ViewDetail,
            className: 'btn btn-warning',
            click: (item: any) => {
                if (click) click(item);
            }
        }
        return item;
    }

    public static active(click?: (item: any) => any): ActionData {
        let item: ActionData = {
            name: ActionType.Publish,
            icon: 'la la-toggle-off',
            className: 'btn btn-warning',
            systemName: ActionType.Publish,
            click: (item: any) => {
                if (click) click(item);
            }
        }
        return item;
    }

    public static delete(click?: (item: any) => any): ActionData {
        let item: ActionData = {
            icon: 'la la-trash',
            name: ActionType.Delete,
            className: 'btn btn-danger',
            systemName: ActionType.Delete,
            click: (item: any) => {
                if (click) click(item);
            }
        }
        return item;
    }

    public static history(click?: (item?: any) => any): ActionData {
        let item: ActionData = {
            icon: 'la la-history',
            name: ActionType.History,
            systemName: ActionType.History,
            className: 'btn btn-outline-primary',
            click: (item: any) => {
                if (click) click(item);
            }
        }
        return item;
    }

    public static saveAddNew(name: string, click?: () => any): ActionData {
        let item: ActionData = {
            name: name,
            processButton: true,
            icon: 'la la-plus-circle',
            className: 'btn btn-primary',
            systemName: ActionType.AddNew,
            click: () => {
                if (click) click();
            }
        }
        return item;
    }

    public static saveUpdate(name: string, click?: () => any): ActionData {
        let item: ActionData = {
            icon: 'la la-save',
            processButton: true,
            systemName: ActionType.Edit,
            name: name || 'Lưu thay đổi',
            className: 'btn btn-primary',
            click: () => {
                if (click) click();
            }
        }
        return item;
    }

    public static gotoEdit(name: string, click?: (item: any) => any): ActionData {
        let item: ActionData = {
            name: name,
            icon: 'la la-pencil',
            systemName: ActionType.Edit,
            className: 'btn btn-primary',
            click: (item: any) => {
                if (click) click(item);
            }
        }
        return item;
    }

    public static gotoView(name: string, click?: (item: any) => any): ActionData {
        let item: ActionData = {
            name: name,
            icon: 'la la-eye',
            systemName: ActionType.View,
            className: 'btn btn-primary',
            click: (item: any) => {
                if (click) click(item);
            }
        }
        return item;
    }

    public static downloadFile(click?: () => any): ActionData {
        let item: ActionData = {
            name: 'Tải tệp mẫu',
            icon: 'la la-download',
            systemName: ActionType.Empty,
            className: 'btn btn-warning',
            click: (item: any) => {
                if (click) click();
            }
        }
        return item;
    }

    public static importData(click?: () => any): ActionData {
        let item: ActionData = {
            name: 'Import',
            icon: 'la la-recycle',
            systemName: ActionType.Import,
            className: 'btn btn-warning',
            click: (item: any) => {
                if (click) click();
            }
        }
        return item;
    }

    public static exportData(click?: () => any): ActionData {
        let item: ActionData = {
            name: 'Export',
            systemName: ActionType.Export,
            className: 'btn btn-success',
            click: (item: any) => {
                if (click) click();
            }
        }
        return item;
    }
}