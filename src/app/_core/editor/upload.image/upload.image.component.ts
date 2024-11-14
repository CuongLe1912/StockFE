declare var $: any
import * as _ from "lodash";
import { AppConfig } from "../../helpers/app.config";
import { ApiUrl } from "../../helpers/api.url.helper";
import { KeyValue } from "../../domains/data/key.value";
import { FileData } from "../../domains/data/file.data";
import { FileDto } from "../../domains/objects/file.dto";
import { FileType } from "../../domains/enums/file.type";
import { ResultApi } from "../../domains/data/result.api";
import { StoreType } from "../../domains/enums/data.type";
import { ImageEx } from "../../decorators/image.decorator";
import { UploadData } from "../../domains/data/upload.data";
import { UtilityExHelper } from "../../helpers/utility.helper";
import { ValidatorHelper } from "../../helpers/validator.helper";
import { AdminApiService } from "../../services/admin.api.service";
import { ModalSizeType } from "../../domains/enums/modal.size.type";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { AdminDialogService } from "../../services/admin.dialog.service";
import { PopupViewImageComponent } from "./popup.view.image/popup.view.image.component";
import { PopupEditImageComponent } from "./popup.edit.image/popup.edit.image.component";
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";

@Component({
    selector: 'editor-upload-image',
    styleUrls: ['./upload.image.component.scss'],
    templateUrl: './upload.image.component.html',
})
export class UploadImageComponent implements OnInit, OnChanges {
    index: number;
    StoreType = StoreType;
    removedFile: FileData;
    items: FileData[] = [];
    needCheckOnChange: boolean = true;

    @Input() value: any;
    @Input() decorator: ImageEx;
    @ViewChild('fileInput') fileInput: ElementRef;
    @Output() valueChange = new EventEmitter<any>();

    constructor(
        public service: AdminApiService,
        public dialog: AdminDialogService) {
    }

    ngOnInit() {
        this.decorator.id = UtilityExHelper.randomText(8);
        setTimeout(() => {
            this.renderImage();
        }, 500);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            if (changes.value && this.needCheckOnChange) {
                if (typeof changes.value.currentValue != 'string') {
                    setTimeout(() => {
                        this.renderImage();
                    }, 500);
                }
            }
        }
    }

    public clearValue() {
        this.items = [];
        this.updateValueChange(null);
    }
    public viewImage(i: number) {
        this.dialog.WapperAboveAsync({
            title: 'Xem ảnh',
            cancelText: 'Đóng',
            size: ModalSizeType.ExtraLarge,
            object: PopupViewImageComponent,
            objectExtra: {
                index: i,
                items: _.cloneDeep(this.items)
            },
        });
    }
    public openArchive() {
        if (this.decorator.popupArchive) {
            this.dialog.WapperAsync(this.decorator.popupArchive, async (images: any) => {
                if (this.decorator.multiple) {
                    images.forEach(image => {
                        if (image) {
                            this.items.push({
                                Path: image?.url,
                                Name: image?.name,
                                Size: image?.size,
                                ResultUpload: image,
                                Code: UtilityExHelper.randomText(10),
                            })
                        }
                    });
                    this.valueChange.emit(this.items);
                } else {
                    let image = images && images[0];
                    this.items = [];
                    this.items.push({
                        Path: image?.url,
                        Name: image?.name,
                        Size: image?.size,
                        ResultUpload: image,
                        Code: UtilityExHelper.randomText(10),
                    });
                    this.valueChange.emit(this.items);
                }
                if (this.decorator.popupArchive.okFunction)
                    this.decorator.popupArchive.okFunction(images);
            });
        }
    }
    public renderImage() {
        this.items = [];
        if (!this.value) return;
        if (this.decorator.store == StoreType.DatabaseBase64 || this.decorator.store == StoreType.DatabaseByte) {
            if (this.value) {
                let items: string[];
                if (this.decorator.multiple) {
                    items = Array.isArray(this.value)
                        ? this.value as string[]
                        : JSON.parse(this.value);
                } else {
                    items = Array.isArray(this.value)
                        ? this.value as string[]
                        : [this.value];
                }
                if (items && items.length > 0) {
                    items.forEach((item: string) => {
                        let data = item.indexOf('data:image') < 0
                            ? 'data:image/png;base64,' + item
                            : item;
                        let size = item.lastIndexOf('==')
                            ? item.length * 3 / 4 - 2
                            : item.length * 3 / 4 - 1;
                        this.items.push({
                            Size: size,
                            Data: data,
                        });
                    });
                }
            }
        } else {
            let items: string[];
            if (this.decorator.multiple) {
                items = Array.isArray(this.value)
                    ? this.value as any[]
                    : JSON.parse(this.value);
            } else {
                items = Array.isArray(this.value)
                    ? this.value as any[]
                    : [this.value];
            }
            if (items && items.length > 0) {
                items.forEach((item: any) => {
                    let value = typeof item === 'string' || item instanceof String
                        ? { Path: item, Name: item.substring(item.lastIndexOf('/') + 1).substring(item.lastIndexOf('\\') + 1) }
                        : item;
                    let url = value.Path || value.Url || value.url;
                    if (url && url.indexOf('http') >= 0) {
                        this.items.push({
                            Path: url,
                            Note: value.Note,
                            Name: value.Name,
                            NativeData: value.NativeData,
                            ResultUpload: value.ResultUpload,
                            S3Key: value.s3Key || value.ResultUpload?.s3Key,
                            Code: value.Code || UtilityExHelper.randomText(10),
                        });
                        this.toDataUrl(url, (result: string) => {
                            this.renderBgColor(result, url);
                        });
                    } else {
                        if (value.Data) {
                            let name = value.Name || UtilityExHelper.randomText(10);
                            this.items.push({
                                Name: name,
                                Data: value.Data,
                                Note: value.Note,
                                NativeData: value.NativeData,
                                ResultUpload: value.ResultUpload,
                                S3Key: value.s3Key || value.ResultUpload?.s3Key,
                                Code: value.Code || UtilityExHelper.randomText(10),
                            });
                            this.renderBgColor(value.Data, value.Code);
                        } else {
                            if (url) {
                                if (url.indexOf('data:image/') >= 0) {
                                    this.items.push({
                                        Data: url,
                                        Name: value.Name,
                                        Note: value.Note,
                                        NativeData: value.NativeData,
                                        ResultUpload: value.ResultUpload,
                                        S3Key: value.s3Key || value.ResultUpload?.s3Key,
                                        Code: value.Code || UtilityExHelper.randomText(10),
                                    });
                                    this.renderBgColor(url, value.Code);
                                } else {
                                    let imageUrl = AppConfig.ApiUrl + '/' + url;
                                    this.items.push({
                                        Path: imageUrl,
                                        Note: value.Note,
                                        Name: value.Name,
                                        NativeData: value.NativeData,
                                        ResultUpload: value.ResultUpload,
                                        S3Key: value.s3Key || value.ResultUpload?.s3Key,
                                        Code: value.Code || UtilityExHelper.randomText(10),
                                    });
                                    this.toDataUrl(url, (result: string) => {
                                        this.renderBgColor(result, url);
                                    });
                                }
                            }
                        }
                    }
                });
            }
        }

        if (this.items && this.items.length > 0 && this.decorator.choice) {
            let selected = this.items.find(c => c.Selected);
            if (!selected) this.items[0].Selected = true;
        }
        this.updateValueChange(this.items);
        this.valueChange.emit(this.value);
    }
    clearNote(item: FileData) {
        item.Note = null;
    }
    public readFile(files: any) {
        if (files && files.length > 0) {
            let max = this.decorator.max;
            let length = files.length > max ? max : files.length;
            for (let i = 0; i < length; i++) {
                const file = files[i];
                let item: FileData = {
                    Path: null,
                    Percent: 0,
                    Selected: false,
                    Name: file.name,
                    NativeData: file,
                    Size: file.size / 1024 / 1024,
                };
                let fileDb = this.decorator.duplicate ? this.items && this.items.find(c => c.Name == item.Name && c.Size == item.Size) : null;
                if (!fileDb) {
                    let FR = new FileReader();
                    FR.onload = () => {
                        item.Data = FR.result;
                        item.Code = UtilityExHelper.randomText(10);
                        if (this.removedFile) {
                            let index = this.items.findIndex(c => c.Code == this.removedFile.Code);
                            if (index >= 0) this.items[index] = item;
                            this.removedFile = null;
                        } else this.items.push(item);

                        // selected
                        let selected = this.items.find(c => c.Selected);
                        if (!selected && this.items && this.items.length > 0)
                            this.items[0].Selected = true;

                        // bgcolor
                        this.renderBgColor(item.Data, item.Code)

                        this.updateValueChange(this.items);
                        this.valueChange.emit(this.value);
                        this.fileInput.nativeElement.value = '';
                    };
                    FR.onerror = () => {
                        this.dialog.Error('Ảnh ' + file.name + ' bị lỗi, vui lòng chọn ảnh khác');
                    };
                    FR.readAsDataURL(file);
                } else if (files.length == 1) {
                    this.dialog.Error('Ảnh ' + fileDb.Name + ' đã tồn tại, vui lòng chọn tệp khác');
                }
            }
        }
    }
    public setValue(value: any) {
        this.updateValueChange(value);
        this.renderImage();
    }
    public editImage(item: FileData) {
        this.dialog.WapperAboveAsync({
            title: 'Sửa ảnh',
            cancelText: 'Đóng',
            confirmText: 'Đồng ý',
            size: ModalSizeType.ExtraLarge,
            object: PopupEditImageComponent,
            objectExtra: { item: item },
        }, async (newItem: FileData) => {
            item = newItem;
        });
    }
    public removeFile(item: FileDto) {
        if (!this.decorator.multiple) {
            this.items = [];
            this.fileInput.nativeElement.value = null;
        }
        else {
            _.remove(this.items, (c: FileData) => c.Code == item.Code);

            // selected
            if (this.items && this.items.length > 0) {
                let selected = this.items.find(c => c.Selected);
                if (!selected && this.items && this.items.length > 0)
                    this.items[0].Selected = true;
            }
        }
        this.updateValueChange(this.items);
        this.valueChange.emit(this.value);
        this.fileInput.nativeElement.value = '';
    }
    public selectChange(item: FileData) {
        if (this.items && this.items.length > 0) {
            this.items.forEach((itm: FileData) => {
                itm.Selected = itm.Name == item.Name ? true : false;
            });
        }
    }
    drop(event: CdkDragDrop<FileData[]>) {
        if (this.items && this.items.length > 1)
            moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    }
    public async selectedFile(event: any) {
        let files = event.srcElement.files;
        this.validateImages(files);
    }
    public selectFileToUpload(item?: FileData) {
        this.removedFile = item;
        this.fileInput.nativeElement.click();
    }
    public async upload(keyValues: KeyValue[] = null, url: string = null): Promise<FileData[]> {
        let api = url
            ? ApiUrl.ToUrl('/admin/' + url)
            : ApiUrl.ToUrl('/admin/' + this.decorator.url);
        if (this.items && this.items.length > 0) {
            for (let i = 0; i < this.items.length; i++) {
                const item = this.items[i];
                if (item.NativeData) {
                    let obj: UploadData = {
                        type: FileType.Image,
                        data: item.NativeData,
                        processFunction: (percent: number) => {
                            item.Percent = percent;
                        }
                    };
                    if (this.decorator.customUpload) {
                        await this.service.customUpload(this.decorator.customUpload, obj, keyValues, url).then(async (resultUpload: ResultApi) => {
                            if (ResultApi.IsSuccess(resultUpload)) {
                                if (this.decorator.customUpload.needMove) {
                                    // move files
                                    await this.service.moveCustomUpload(this.decorator.customUpload, resultUpload.Object, FileType.Image).then((result: ResultApi) => {
                                        if (ResultApi.IsSuccess(result)) {
                                            item.NativeData = null;
                                            item.ResultUpload = result.Object;
                                            if (result.Object) {
                                                let images = result.Object.images || result.Object;
                                                item.Path = images.map((c: any) => c && Array.isArray(c) ? c[0] : c).map((c: any) => c.url)[0];
                                                item.S3Key = images.map((c: any) => c && Array.isArray(c) ? c[0] : c).map((c: any) => c.s3Key)[0];
                                            }
                                        }
                                    });
                                } else {
                                    item.NativeData = null;
                                    item.ResultUpload = resultUpload.Object;
                                    if (resultUpload.Object) {
                                        let images = resultUpload.Object.images || resultUpload.Object;
                                        item.Path = images.map((c: any) => c && Array.isArray(c) ? c[0] : c).map((c: any) => c.url)[0];
                                        item.S3Key = images.map((c: any) => c && Array.isArray(c) ? c[0] : c).map((c: any) => c.s3Key)[0];
                                    }
                                }
                            }
                        });
                    } else {
                        if (this.decorator.store == StoreType.DatabaseByte || this.decorator.store == StoreType.DatabaseBase64) {
                            this.items.forEach((item: FileData) => {
                                item.Percent = 100;
                                item.Success = true;
                                if (this.decorator.store == StoreType.DatabaseBase64) {
                                    if (!item.Base64Data) {
                                        item.Base64Data = item.Data.indexOf(',') >= 0
                                            ? item.Data.split(',')[1]
                                            : item.Data;
                                    } else {
                                        item.Base64Data = item.Base64Data.indexOf(',') >= 0
                                            ? item.Data.split(',')[1]
                                            : item.Data;
                                    }
                                } else {
                                    if (!item.ByteData)
                                        item.ByteData = Uint8Array.from(atob(item.Base64Data), c => c.charCodeAt(0));
                                }
                            });
                        } else {
                            await this.service.uploadPercent(api, obj).then((result: ResultApi) => {
                                if (ResultApi.IsSuccess(result)) {
                                    item.Path = result.Object as string;
                                    item.NativeData = null;
                                }
                            });
                        }
                    }
                }
            }
        }
        return this.items;
    }

    public onDragOver(event: any) {
        event.preventDefault();
    }
    public onDropSuccess(event: any) {
        event.preventDefault();
        if (!this.decorator.multiple) {
            this.clearValue();
        }
        this.validateImages(event.dataTransfer.files);
    }

    private getAverageRGB(imgEl: any) {
        var blockSize = 5,
            defaultRGB = { r: 0, g: 0, b: 0 },
            canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data: any, width: number, height: number, length: number,
            i: number = -4, rgb = { r: 0, g: 0, b: 0 }, count: number = 0;
        if (!context) {
            return defaultRGB;
        }
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        context.drawImage(imgEl, 0, 0);

        try {
            data = context.getImageData(0, 0, width, height);
        } catch (e) {
            return defaultRGB;
        }
        length = data.data.length;

        while ((i += blockSize * 4) < length) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
        }

        // ~~ used to floor values
        rgb.r = ~~(rgb.r / count);
        rgb.g = ~~(rgb.g / count);
        rgb.b = ~~(rgb.b / count);

        return rgb;
    }
    private validateImages(files: any[]) {
        if (files && files.length > 0) {
            let count = 0;
            let currentUpload = []
            if (this.items) {
                currentUpload = this.items.filter(c => !c.Path);
                count = currentUpload.length;
                if (this.removedFile)
                    count -= 1;
            }
            if (count > 0 && count + files.length > this.decorator.max) {
                let messageError = '<p>Hệ thống cho phép tối đa 1 lần tải ' + this.decorator.max + ' ảnh!</p>';
                messageError += '<p>Bạn chỉ được tải lên thêm <b>' + (this.decorator.max - count) + '</b> Ảnh!</p>';
                messageError += '<p>Bạn có muốn tiếp tục tải lên (<b>' + (this.decorator.max - count) + '/' + files.length + '</b> Ảnh) ?</p>';

                if (this.decorator.max - count > 0) {
                    this.dialog.Confirm(messageError, () => {
                        let fileBuffer = []
                        Array.prototype.push.apply(fileBuffer, files);
                        files = fileBuffer.splice(0, this.decorator.max - count);
                        ValidatorHelper.validImages(files, this.decorator, this.fileInput, this.dialog, currentUpload, (files) => { this.readFile(files) })
                    }, () => {
                        this.fileInput.nativeElement.value = null;
                    });
                } else {
                    this.dialog.Error('<p>Hệ thống cho phép tối đa 1 lần tải ' + this.decorator.max + ' ảnh!</p>')
                }
            } else
                ValidatorHelper.validImages(files, this.decorator, this.fileInput, this.dialog, currentUpload, (files) => { this.readFile(files) })
        }
    }
    private updateValueChange(item: any) {
        this.needCheckOnChange = false;
        this.value = item;
        setTimeout(() => this.needCheckOnChange = true, 300);
    }
    private toDataUrl(url: string, callback: any) {
        if (url.indexOf('?w=') >= 0)
            url = url.split('?')[0];
        var xhr = new XMLHttpRequest();
        xhr.onload = () => {
            var reader = new FileReader();
            reader.onloadend = () => {
                if (callback) callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = (e) => {

        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
    private renderBgColor(result: any, codeOrUrl: string) {
        if (result.indexOf('?w=') >= 0)
            result = result.split('?')[0];
        let image = <HTMLImageElement>document.createElement('img');
        image.src = result;
        image.onload = () => {
            let rgb = this.getAverageRGB(image);
            let item = this.items.find(c => c.Code == codeOrUrl || c.Path == codeOrUrl);
            if (item) item.BgColor = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 1)';
        };
    }
}