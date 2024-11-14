import { TableData } from '../domains/data/table.data';
import { Injectable, EventEmitter } from '@angular/core';
import { ObjectEx } from '../decorators/object.decorator';
import { QuickPanelType } from '../domains/enums/quick.panel.type';
import { RefreshOptionItem } from '../domains/data/refresh.option.item';

@Injectable()
export class AdminEventService {
    public GtelNotify: EventEmitter<any> = new EventEmitter<any>();
    public HideCombobox: EventEmitter<any> = new EventEmitter<any>();
    public SignalrNotify: EventEmitter<any> = new EventEmitter<any>();
    public Validate: EventEmitter<ObjectEx> = new EventEmitter<ObjectEx>();
    public ConfirmProcessReport: EventEmitter<any> = new EventEmitter<any>();
    public RefreshLimitTextLink: EventEmitter<any> = new EventEmitter<any>();
    public RefreshVideosManager: EventEmitter<any> = new EventEmitter<any>();
    public RefreshSubGrids: EventEmitter<string> = new EventEmitter<string>();
    public ResetValidate: EventEmitter<ObjectEx> = new EventEmitter<ObjectEx>();
    public RefreshGrids: EventEmitter<TableData> = new EventEmitter<TableData>();
    public RefreshItems: EventEmitter<RefreshOptionItem> = new EventEmitter<RefreshOptionItem>();
    public RefreshDateTime: EventEmitter<RefreshOptionItem> = new EventEmitter<RefreshOptionItem>();
    public QuickPanel: EventEmitter<{type: QuickPanelType, value: any}> = new EventEmitter<{type: QuickPanelType, value: any}>();
    public QuickTopupPanel: EventEmitter<{type: QuickPanelType, value: any}> = new EventEmitter<{type: QuickPanelType, value: any}>();
}
