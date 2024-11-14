declare var $: any
import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Subscription } from "rxjs/internal/Subscription";
import { validation } from '../../../../_core/decorators/validator';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { DialogType } from '../../../../_core/domains/enums/dialog.type';
import { ButtonType } from '../../../../_core/domains/enums/button.type';
import { StringEx } from '../../../../_core/decorators/string.decorator';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { DecoratorHelper } from '../../../../_core/helpers/decorator.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { DataType, StringType } from '../../../../_core/domains/enums/data.type';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from "@angular/core";
import { DialogAutoData, DialogData } from '../../../../_core/domains/data/dialog.data';
import { ColumnClassFormat, ObjectEx } from '../../../../_core/decorators/object.decorator';

@Component({
    selector: 'edit-popup-auto',
    templateUrl: './edit.popup.auto.component.html',
    styleUrls: ['../../../../../assets/css/modal.scss'],
})
export class GridEditPopupAutoComponent implements OnInit, OnDestroy {
    item: any;
    id: string;
    loading: boolean;
    disabled: boolean;
    sizeClass: string;
    dialog: DialogData;
    processing: boolean;
    confirmText: string;
    obj: DialogAutoData;
    properties: ObjectEx[];
    ButtonType = ButtonType;
    DialogType = DialogType;
    visible: boolean = false;
    service: AdminApiService;
    activeProperties: ObjectEx[];
    eventDialog: Subscription = null;
    dialogService: AdminDialogService;
    @ViewChildren('upload') uploads: QueryList<EditorComponent>;

    constructor() {
        this.service = AppInjector.get(AdminApiService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }

    ngOnInit() {
        if (this.eventDialog == null) {
            this.eventDialog = this.dialogService.EventDialog.subscribe((item: DialogData) => {
                if (item.type == DialogType.Automatic) {
                    this.init(item);
                    this.disabled = false;
                    this.confirmText = item.confirmText;
                    this.id = UtilityExHelper.randomText(8);
                    UtilityExHelper.activeDragable(this.id);
                }
            });
            this.dialogService.EventHideDialog.subscribe((item: DialogData) => {
                this.visible = false;
            });
        }
    }

    ngOnDestroy() {
        if (this.eventDialog != null) {
            this.eventDialog.unsubscribe();
            this.eventDialog = null;
            this.visible = false;
        }
    }

    public close() {
        UtilityExHelper.clearSelectElement();
        if (this.dialog) {
            this.visible = false;
            if (this.dialog.cancelFunction)
                this.dialog.cancelFunction();
        }
    }

    async confirm() {
        UtilityExHelper.clearSelectElement();
        if (await validation(this.item)) {
            this.processing = true;
            let properties = this.activeProperties;
            for (let i = 0; i < properties.length; i++) {
                let property: ObjectEx = properties[i];
                if (property.dataType == DataType.Image ||
                    property.dataType == DataType.Video ||
                    property.dataType == DataType.File) {
                    let multiple: boolean = property['multiple'];
                    for (let j = 0; j < this.uploads.length; j++) {
                        const upload = this.uploads.toArray()[j];
                        if (upload.property == property.property) {
                            let files = await upload.upload();
                            if (multiple) {
                                this.item[upload.property] = files && files.length > 0
                                    ? files.map(c => { return c.Path })
                                    : null;
                            } else {
                                this.item[upload.property] = files && files.length > 0
                                    ? files[0].Path || files[0].Base64Data || files[0].ByteData
                                    : null;
                            }
                        }
                    }
                }
            }
            if (this.obj.confirmFunction) {
                let success = await this.obj.confirmFunction();
                if (success) {
                    if (this.dialog?.okFunctionAsync)
                        await this.dialog.okFunctionAsync(success);
                    if (typeof success == 'boolean') {
                        this.visible = false;
                        this.dialog = null;
                    }
                }
            }
        }
    }

    async loadItem() {
        let reference = this.obj.objectValue?.Reference ||
            this.obj.objectValue?.object?.constructor.name;
        if (reference) {
            this.item = this.obj.objectValue && this.obj.objectValue.object
                ? EntityHelper.createEntity(reference, this.obj.objectValue.object)
                : EntityHelper.createEntity(reference);
            this.activeProperties = _.cloneDeep(this.properties);
            if (this.obj.objectValue.Propperties && this.obj.objectValue.Propperties.length > 0) {
                this.activeProperties = [];
                this.obj.objectValue.Propperties.forEach((property: string | ObjectEx) => {
                    let propertyName = typeof (property) == 'string' ? property : property.property;
                    let propertyItem = this.properties.find(c => c.property == propertyName);
                    if (propertyItem) {
                        propertyItem = _.cloneDeep(propertyItem);
                        if (typeof (property) != 'string') {
                            if (property.readonly) propertyItem.readonly = property.readonly;
                            if (property.columnClass) propertyItem.columnClass = property.columnClass;
                            if (property.defaultValue) propertyItem.defaultValue = property.defaultValue;
                        }
                        this.activeProperties.push(propertyItem);
                    }
                });
            }
        }
    }

    async init(item: DialogData) {
        this.dialog = item;
        this.visible = true;
        this.loading = true;
        this.obj = item.object;
        if (this.obj) {
            let reference = this.obj.objectValue?.Reference ||
                this.obj.objectValue?.object?.constructor.name;
            if (reference) {
                this.properties = DecoratorHelper.decoratorProperties(reference, false);
                this.properties.forEach((property: ObjectEx) => {
                    switch (this.obj.size) {
                        case ModalSizeType.Small:
                            this.sizeClass = 'modal-sm';
                            property.columnClass = property.columnClass || ColumnClassFormat.Column12;
                            break;
                        case ModalSizeType.Large:
                            this.sizeClass = 'modal-lg';
                            if (property.dataType == DataType.String && (<StringEx>property).type == StringType.MultiText)
                                property.columnClass = property.columnClass || ColumnClassFormat.Column12;
                            else
                                property.columnClass = property.columnClass || ColumnClassFormat.Column6;
                            break;
                        case ModalSizeType.ExtraLarge:
                            this.sizeClass = 'modal-xl';
                            property.columnClass = property.columnClass || ColumnClassFormat.Column4;
                            break;
                        case ModalSizeType.FullScreen:
                            this.sizeClass = 'modal-fs';
                            property.columnClass = property.columnClass || ColumnClassFormat.Column3;
                            break;
                        case ModalSizeType.Medium:
                            this.sizeClass = 'modal-md';
                            property.columnClass = property.columnClass || ColumnClassFormat.Column12;
                            break;
                        default:
                            this.sizeClass = 'modal-md';
                            property.columnClass = property.columnClass || ColumnClassFormat.Column12;
                            break;
                    }
                    if (property.dataType == DataType.String && (<StringEx>property).type == StringType.Html || (<StringEx>property).type == StringType.Json)
                        property.columnClass = property.columnClass || ColumnClassFormat.Column12;
                });
            }
        }
        await this.loadItem();
        this.loading = false;
    }
}