import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { EditComponent } from '../../edit/edit.component';
import { FormData } from "../../../../_core/domains/data/form.data";
import { validation } from '../../../../_core/decorators/validator';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { FormType } from '../../../../_core/domains/enums/form.type';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AlignType } from '../../../../_core/domains/enums/align.type';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { DecoratorHelper } from '../../../../_core/helpers/decorator.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from "@angular/core";
import { ColumnClassFormat, ObjectEx } from '../../../../_core/decorators/object.decorator';

@Component({
    templateUrl: './edit.auto.component.html',
    styleUrls: ['../../../../../assets/css/modal.scss'],
})
export class GridEditAutoComponent extends EditComponent implements OnInit, OnDestroy {
    item: any;
    id: string;
    obj: GridData;
    loading: boolean;
    disabled: boolean;
    sizeClass: string;
    alignClass: string;
    processing: boolean;
    properties: ObjectEx[];
    service: AdminApiService;
    state: NavigationStateData;
    activeProperties: ObjectEx[];
    @ViewChildren('upload') uploads: QueryList<EditorComponent>;

    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
    }

    async ngOnInit() {
        this.state = this.getUrlState();
        if (this.state && this.state.object) {
            this.disabled = this.state.viewer;
            await this.init(this.state.object);
            this.renderActions();
        }
    }

    ngOnDestroy() {
    }

    async confirm() {
        UtilityExHelper.clearSelectElement();
        if (this.obj) {
            let reference = this.obj.Reference || this.state.className,
                table = DecoratorHelper.decoratorClass(reference);
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
                return await this.service.save(table.name, this.item).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        let message = (this.item.Id ? 'Sửa ' : 'Thêm mới ') + this.obj.Title.toLowerCase() + ' thành công';
                        ToastrHelper.Success(message);
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                });
            }
        }
        return false;
    }

    async loadItem() {
        if (this.obj) {
            let reference = this.obj.Reference || this.state.className,
                table = DecoratorHelper.decoratorClass(reference);
            if (this.state.id) {
                this.loading = true;
                await this.service.item(table.name, this.state.id).then((result: ResultApi) => {
                    this.loading = false;
                    if (ResultApi.IsSuccess(result)) {
                        this.item = EntityHelper.createEntity(reference, result.Object);
                    } else {
                        ToastrHelper.ErrorResult(result);
                    }
                }, () => {
                    this.loading = false;
                });
            }
            else this.item = EntityHelper.createEntity(reference);
        }
        this.activeProperties = _.cloneDeep(this.properties);
        if (this.obj.Forms && this.obj.Forms.length > 0) {
            let form: FormData;
            if (this.state.id) {
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
                let align = form.Align || AlignType.Center;
                this.alignClass = align == AlignType.Left
                    ? 'left'
                    : (align == AlignType.Center ? 'center' : 'right');
                this.sizeClass = form.Width || ColumnClassFormat.Column6;
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
        } else {
            this.alignClass = 'center';
            this.sizeClass = ColumnClassFormat.Column6;
        }
    }

    async init(item: GridData) {
        this.loading = true;
        this.obj = _.cloneDeep(item);
        if (this.obj) {
            let reference = this.obj.Reference || this.state.className;
            this.properties = DecoratorHelper.decoratorProperties(reference, false);
            this.properties.forEach((property: ObjectEx) => {
                property.columnClass = property.columnClass || ColumnClassFormat.Column12;
            });
        }
        await this.loadItem();
        this.loading = false;
    }
    public async confirmAndBack() {
        let result = await this.confirm();
        if (result) {
            this.back();
        }
    }
    private async renderActions() {
        let actions: ActionData[] = this.state.id
            ? [
                ActionData.back(() => { this.back() }),
                ActionData.saveUpdate('Lưu thay đổi', () => { this.confirmAndBack() }),
            ]
            : [
                ActionData.back(() => { this.back() }),
                ActionData.saveAddNew('Tạo ' + this.obj.Title, () => { this.confirmAndBack() })
            ];
        this.actions = await this.authen.actionsAllowName(this.state.className, actions);
    }
}