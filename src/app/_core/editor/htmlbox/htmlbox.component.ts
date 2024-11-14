declare let $;
declare let tinymce: any;
import * as _ from 'lodash';
import { ApiUrl } from '../../helpers/api.url.helper';
import { FileType } from '../../domains/enums/file.type';
import { ResultApi } from '../../domains/data/result.api';
import { StringType } from '../../domains/enums/data.type';
import { UploadData } from '../../domains/data/upload.data';
import { StringEx } from '../../decorators/string.decorator';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { AdminApiService } from '../../services/admin.api.service';
import { EditorParamData } from '../../domains/data/editor.param.data';
import { AdminDialogService } from '../../services/admin.dialog.service';
import { Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output } from '@angular/core';

@Component({
    selector: 'editor-htmlbox',
    templateUrl: 'htmlbox.component.html',
    styleUrls: ['htmlbox.component.scss']
})
export class HtmlBoxComponent implements OnInit, OnChanges {
    bookmark: any;
    length: number;
    focused: boolean;
    selectedContent: any;
    @Input() value: string;
    @Input() decorator: StringEx;
    @Output() valueChange = new EventEmitter<string>();

    constructor(
        public zone: NgZone,
        public service: AdminApiService,
        public dialog: AdminDialogService) {
    }

    ngOnInit() {
        if (!this.decorator)
            this.decorator = new StringEx();
        if (!this.decorator.min) this.decorator.min = 0;
        this.decorator.id = UtilityExHelper.randomText(8);
        if (!this.value && this.decorator.defaultValue) {
            this.value = this.decorator.defaultValue;
        }
        if (!this.decorator.max) this.decorator.max = 5000;
        if (!this.decorator.placeholder) this.decorator.placeholder = '';
        if (!this.decorator.type) this.decorator.type = StringType.Html;
        setTimeout(() => {
            let elementId = 'textarea#' + this.decorator.id,
                $element = $(elementId);
            if ($element && $element.length > 0) {
                let variables = this.decorator.variables && this.decorator.variables.length > 0,
                    toolbar = this.decorator.htmlToolbar;
                if (variables) toolbar = 'menuVariables | ' + toolbar;
                tinymce.remove(elementId);
                tinymce.init({
                    height: 500,
                    skin: "snow",
                    icons: "thin",
                    language: 'vi',
                    toolbar: toolbar,
                    selector: elementId,
                    menubar: this.decorator.htmlMenubar,
                    readonly: this.decorator.readonly ? 1 : null,
                    custom_elements: "style,link,~link,html,body",
                    extended_valid_elements: "style,link[href|rel],html,body",
                    contextmenu: "link image inserttable | cell row column deletetable | uploadFileMenu | uploadImageMenu",
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor textcolor',
                        'searchreplace visualblocks code fullscreen variable code',
                        'insertdatetime media table paste help wordcount'
                    ],
                    setup: (editor: any) => {
                        if (variables) {
                            this.decorator.variables.forEach((item: EditorParamData) => {
                                let name = 'F1_' + item.name + '_Icon';
                                editor.ui.registry.addIcon(name.toLowerCase(), item.icon);
                                if (item.childrens && item.childrens.length > 0) {
                                    item.childrens.forEach((child: EditorParamData) => {
                                        name = 'F2_' + child.name + '_Icon';
                                        editor.ui.registry.addIcon(name.toLowerCase(), child.icon);
                                    });
                                }
                            });
                            editor.ui.registry.addMenuButton('menuVariables', {
                                text: 'Tham số',
                                title: 'Tham số',
                                fetch: (callback: any) => {
                                    let items = [];
                                    for (let i = 0; i < this.decorator.variables.length; i++) {
                                        let item: any = {},
                                            itemVarible = this.decorator.variables[i];
                                        item.type = itemVarible.childrens && itemVarible.childrens.length > 0
                                            ? 'nestedmenuitem'
                                            : 'menuitem';
                                        item.icon = ('F1_' + itemVarible.name + '_Icon').toLowerCase();
                                        item.text = itemVarible.title || UtilityExHelper.createLabel(itemVarible.name);
                                        if (itemVarible.name) {
                                            item.onAction = () => {
                                                editor.plugins.variable.addVariable(itemVarible.name);
                                            }
                                        }
                                        if (itemVarible.childrens && itemVarible.childrens.length > 0) {
                                            let childItems = [];
                                            for (let j = 0; j < itemVarible.childrens.length; j++) {
                                                let itemF2: any = {},
                                                    itemVaribleF2 = itemVarible.childrens[j];
                                                itemF2.type = 'menuitem';
                                                itemF2.icon = ('F2_' + itemVaribleF2.name + '_Icon').toLowerCase();
                                                itemF2.text = itemVaribleF2.title || UtilityExHelper.createLabel(itemVaribleF2.name);
                                                if (itemVaribleF2.name) {
                                                    itemF2.onAction = () => {
                                                        editor.plugins.variable.addVariable(itemVaribleF2.name);
                                                    }
                                                }
                                                childItems.push(itemF2);
                                            }
                                            item.getSubmenuItems = () => {
                                                return childItems;
                                            }
                                        }
                                        items.push(item);
                                    }
                                    callback(items);
                                }
                            });
                        }
                        if (this.decorator.popupFile) {
                            editor.ui.registry.addButton('uploadFile', {
                                text: 'Quản lý tệp',
                                onAction: () => {
                                    this.popupFile();
                                }
                            });
                            editor.ui.registry.addMenuItem('uploadFileMenu', {
                                text: 'Quản lý tệp',
                                onAction: () => {
                                    this.popupFile();
                                }
                            });
                        }
                        if (this.decorator.popupImage) {
                            editor.ui.registry.addButton('uploadImage', {
                                text: 'Quản lý ảnh',
                                onAction: () => {
                                    this.popupImage();
                                }
                            });
                            editor.ui.registry.addMenuItem('uploadImageMenu', {
                                text: 'Quản lý ảnh',
                                onAction: () => {
                                    this.popupImage();
                                }
                            });
                        }
                    },
                    init_instance_callback: (editor: any) => {
                        editor.on('focus', () => {
                            this.zone.run(() => {
                                this.focused = true;
                            });
                        });
                        editor.on('click', () => {
                            this.zone.run(() => {
                                this.focused = true;
                            });
                        });
                        editor.on('blur', () => {
                            this.zone.run(() => {
                                this.bookmark = tinymce.get(this.decorator.id).selection.getBookmark(2, true);
                                this.selectedContent = tinymce.get(this.decorator.id).selection.getContent();
                                this.value = tinymce.get(this.decorator.id).getContent();
                                this.valueChange.emit(this.value);
                                this.focused = false;
                            });
                        });
                        editor.on('keyup', () => {
                            this.zone.run(() => {
                                this.value = tinymce.get(this.decorator.id).getContent();
                                this.length = UtilityExHelper.lengthHtml(this.value);
                                this.decorator.error = null;
                                this.focused = true;
                            });
                        });
                    },
                    images_upload_handler: this.decorator.customUpload ? async (blobInfo: any, success: any, failure: any, progress: any) => {
                        let obj: UploadData = {
                            type: FileType.Image,
                            data: blobInfo.blob(),
                            processFunction: (percent: number) => {
                                progress(percent);
                            }
                        };
                        let url = ApiUrl.ToUrl(this.decorator.customUpload.url);
                        await this.service.customUpload(this.decorator.customUpload, obj, null, url).then(async (resultUpload: ResultApi) => {
                            if (ResultApi.IsSuccess(resultUpload)) {
                                if (this.decorator.customUpload.needMove) {
                                    // move files
                                    await this.service.moveCustomUpload(this.decorator.customUpload, resultUpload.Object, FileType.Image).then((result: ResultApi) => {
                                        if (ResultApi.IsSuccess(result)) {
                                            if (result.Object) {
                                                let images = result.Object.images || result.Object;
                                                let path = images.map((c: any) => c && Array.isArray(c) ? c[0] : c).map((c: any) => c.url)[0];
                                                success(path);
                                            }
                                        }
                                    });
                                } else {
                                    if (resultUpload.Object) {
                                        let images = resultUpload.Object.images || resultUpload.Object;
                                        let path = images.map((c: any) => c && Array.isArray(c) ? c[0] : c).map((c: any) => c.url)[0];
                                        success(path);
                                    }
                                }
                            } else failure(resultUpload.Description);
                        });
                    } : null,
                    content_style: "p { margin: 0; } .variable{cursor:default;background-color:#5867dd;color:#FFF;padding:0px 6px;border-radius:3px;font-style:normal;display:inline-block;}"
                });
            }
        }, 1000);
    }

    ngOnChanges(changes: any) {
        if (changes) {
            if (changes.value) {
                if (changes.value.currentValue != changes.value.previousValue) {
                    this.setValue();
                }
            }
        }
    }

    private setValue() {
        let elementId = 'textarea#' + this.decorator.id,
            $element = $(elementId);
        if ($element && $element.length > 0) {
            if (this.value) {
                if (tinymce.get(this.decorator.id)) {
                    tinymce.get(this.decorator.id).setContent(this.value);
                    this.valueChange.emit(this.value);
                } else {
                    setTimeout(() => {
                        if (tinymce.get(this.decorator.id)) {
                            tinymce.get(this.decorator.id).setContent(this.value);
                            this.valueChange.emit(this.value);
                        }
                    }, 500);
                }
            } else {
                if (tinymce.get(this.decorator.id)) {
                    tinymce.get(this.decorator.id).setContent('');
                }
            }
        }
    }

    private popupFile() {
        this.dialog.WapperAsync(this.decorator.popupFile, async (files: any) => {
            this.dialog.HideAllDialog();
            if (files) {
                if (Array.isArray(files)) {
                    if (files.length > 0) {
                        if (files.length == 1) {
                            let file = files[0],
                                url = file.Link || file.url,
                                name = file.Name || file.name,
                                editor = tinymce.get(this.decorator.id);
                            if (this.selectedContent)
                                editor.execCommand('mceReplaceContent', true, '<a href="' + url + '" target="_blank">' + this.selectedContent + '</a>');
                            else {
                                if (this.bookmark) {
                                    editor.focus();
                                    editor.selection.moveToBookmark(this.bookmark);
                                } else {
                                    editor.selection.select(editor.getBody(), true);
                                    editor.selection.collapse(false);
                                }
                                editor.execCommand('mceInsertContent', false, '<a href="' + url + '" target="_blank">' + name + '</a>');
                            }
                        } else {
                            files.forEach((file: any) => {
                                if (file) {
                                    let url = file.Link || file.url,
                                        name = file.Name || file.name,
                                        editor = tinymce.get(this.decorator.id);

                                    if (this.bookmark) {
                                        editor.focus();
                                        editor.selection.moveToBookmark(this.bookmark);
                                    } else {
                                        editor.selection.select(editor.getBody(), true);
                                        editor.selection.collapse(false);
                                    }
                                    editor.execCommand('mceInsertContent', false, '<p><a href="' + url + '" target="_blank">' + name + '</a></p>');
                                }
                            });
                        }
                    } else {
                        this.dialog.Error('Vui lòng chọn ít nhất 1 tệp để đặt đường dẫn');
                    }
                } else {
                    let file = files,
                        url = file.Link || file.url,
                        name = file.Name || file.name,
                        editor = tinymce.get(this.decorator.id);
                    if (this.selectedContent)
                        editor.execCommand('mceReplaceContent', true, '<a href="' + url + '" target="_blank">' + this.selectedContent + '</a>');
                    else {
                        if (this.bookmark) {
                            editor.focus();
                            editor.selection.moveToBookmark(this.bookmark);
                        } else {
                            editor.selection.select(editor.getBody(), true);
                            editor.selection.collapse(false);
                        }
                        editor.execCommand('mceInsertContent', false, '<a href="' + url + '" target="_blank">' + name + '</a>');
                    }
                }
            } else {
                this.dialog.Error('Vui lòng chọn ít nhất 1 tệp để đặt đường dẫn');
            }
        });
    }

    private popupImage() {
        this.dialog.WapperAsync(this.decorator.popupImage, async (images: any[]) => {
            this.dialog.HideAllDialog();
            if (images && images.length > 0) {
                images.forEach(image => {
                    if (image) {
                        let url = image.Path || image.url,
                            name = image.Name || image.name,
                            editor = tinymce.get(this.decorator.id);

                        if (this.bookmark) {
                            editor.focus();
                            editor.selection.moveToBookmark(this.bookmark);
                        } else {
                            editor.selection.select(editor.getBody(), true);
                            editor.selection.collapse(false);
                        }
                        editor.execCommand('mceInsertContent', false, '<img src="' + url + '" alt="' + name + '" style="width: 300px;" />');
                    }
                });
                if (this.decorator.popupImage.okFunction)
                    this.decorator.popupImage.okFunction(images);
            } else {
                this.dialog.Error('Vui lòng chọn ít nhất một ảnh');
            }
        });
    }
}
