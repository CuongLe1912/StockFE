declare var $: any
import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Subscription } from "rxjs/internal/Subscription";
import { FormData } from "../../../../_core/domains/data/form.data";
import { validation } from '../../../../_core/decorators/validator';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { FormType } from '../../../../_core/domains/enums/form.type';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { DialogData } from '../../../../_core/domains/data/dialog.data';
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
import { ColumnClassFormat, ObjectEx } from '../../../../_core/decorators/object.decorator';

@Component({
    selector: 'edit-popup',
    templateUrl: './edit.popup.component.html',
    styleUrls: ['../../../../../assets/css/modal.scss'],
})
export class GridEditPopupComponent implements OnInit, OnDestroy {
    item: any;
    id: string;
    obj: GridData;
    loading: boolean;
    disabled: boolean;
    sizeClass: string;
    dialog: DialogData;
    processing: boolean;
    confirmText: string;
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
                if (item.type == DialogType.AdminEdit) {
                    this.init(item);
                    this.disabled = false;
                    this.id = UtilityExHelper.randomText(8);
                    UtilityExHelper.activeDragable(this.id);
                    this.confirmText = (item.object ? 'Lưu ' : 'Tạo ') + this.obj.Title;
                    if (!this.dialog.title) this.dialog.title = (item.object ? 'Sửa ' : 'Thêm mới ') + this.obj.Title;
                } else if (item.type == DialogType.AdminView) {
                    this.init(item);
                    this.disabled = true;
                    this.id = UtilityExHelper.randomText(8);
                    UtilityExHelper.activeDragable(this.id);
                    if (!this.dialog.title) this.dialog.title = 'Xem thông tin ' + this.obj.Title;
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
        if (this.obj && this.obj.Reference) {
            let table = DecoratorHelper.decoratorClass(this.obj.Reference);
            if (this.dialog) {
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
                    this.service.save(table.name, this.item).then((result: ResultApi) => {
                        this.processing = false;
                        if (ResultApi.IsSuccess(result)) {
                            this.visible = false;
                            if (this.dialog.okFunction)
                                this.dialog.okFunction();
                            let message = (this.item.Id ? 'Sửa ' : 'Thêm mới ') + this.obj.Title.toLowerCase() + ' thành công';
                            ToastrHelper.Success(message);
                        } else ToastrHelper.ErrorResult(result);
                    });
                }
            }
        }
    }

    async loadItem(id?: number) {
        if (this.obj && this.obj.Reference) {
            let table = DecoratorHelper.decoratorClass(this.obj.Reference);
            if (id) {
                this.loading = true;
                await this.service.item(table.name, id).then((result: ResultApi) => {
                    this.loading = false;
                    if (ResultApi.IsSuccess(result)) {
                        this.item = EntityHelper.createEntity(this.obj.Reference, result.Object);
                    } else {
                        this.visible = false;
                        ToastrHelper.ErrorResult(result);
                    }
                }, () => {
                    this.visible = false;
                    this.loading = false;
                });
            }
            else this.item = EntityHelper.createEntity(this.obj.Reference);
        }

        this.activeProperties = _.cloneDeep(this.properties);
        if (this.obj.Forms && this.obj.Forms.length > 0) {
            let form: FormData;
            if (this.id) {
                if (this.disabled) {
                    form = this.obj.Forms.find(c => !c.Type || c.Type == FormType.View);
                    if (!form) form = this.obj.Forms.find(c => c.Type == FormType.AddOrEdit);
                } else {
                    form = this.obj.Forms.find(c => !c.Type || c.Type == FormType.Edit);
                    if (!form) form = this.obj.Forms.find(c => !c.Type || c.Type == FormType.AddOrEdit);
                }
            } else {
                form = this.obj.Forms.find(c => !c.Type || c.Type == FormType.Add);
                if (!form) form = this.obj.Forms.find(c => !c.Type || c.Type == FormType.AddOrEdit);
            }
            if (form && form.Propperties && form.Propperties.length > 0) {
                this.activeProperties = [];
                form.Propperties.forEach((property: string | ObjectEx) => {
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
        this.obj = _.cloneDeep(item.objectExtra);

        if (this.obj && this.obj.Reference) {
            this.properties = DecoratorHelper.decoratorProperties(this.obj.Reference, false);
            this.properties.forEach((property: ObjectEx) => {
                switch (this.obj.Size) {
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
        await this.loadItem(item.object as number);
        this.loading = false;
    }
}