import * as _ from "lodash";
import { AppConfig } from "../../helpers/app.config";
import { ApiUrl } from "../../helpers/api.url.helper";
import { KeyValue } from "../../domains/data/key.value";
import { FileData } from "../../domains/data/file.data";
import { FileEx } from "../../decorators/file.decorator";
import { FileType } from "../../domains/enums/file.type";
import { FileDto } from "../../domains/objects/file.dto";
import { StoreType } from "../../domains/enums/data.type";
import { ResultApi } from "../../domains/data/result.api";
import { UploadData } from "../../domains/data/upload.data";
import { UtilityExHelper } from "../../helpers/utility.helper";
import { ValidatorHelper } from "../../helpers/validator.helper";
import { AdminApiService } from "../../services/admin.api.service";
import { AdminDialogService } from "../../services/admin.dialog.service";
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";

@Component({
    selector: 'editor-upload-file',
    styleUrls: ['./upload.file.component.scss'],
    templateUrl: './upload.file.component.html',
})
export class UploadFileComponent implements OnInit, OnChanges {
    StoreType = StoreType;
    removedFile: FileData;
    items: FileData[] = [];
    needCheckOnChange: boolean = true;

    @Input() value: any;
    @Input() decorator: FileEx;
    @ViewChild('fileInput') fileInput: ElementRef;
    @Output() valueChange = new EventEmitter<any>();

    constructor(
        public service: AdminApiService,
        public dialog: AdminDialogService) {
    }

    ngOnInit() {
        this.decorator.id = UtilityExHelper.randomText(8);
        setTimeout(() => {
            this.renderFile();
        }, 500);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            if (changes.value && this.needCheckOnChange) {
                if (typeof changes.value.currentValue != 'string') {
                    setTimeout(() => {
                        this.renderFile();
                    }, 500);
                }
            }
        }
    }

    public clearValue() {
        this.items = [];
        this.updateValueChange(null);
    }
    public openArchive() {
        if (this.decorator.popupArchive) {
            this.dialog.WapperAsync(this.decorator.popupArchive, async (files: any) => {
                if (this.decorator.multiple) {
                    files.forEach(file => {
                        if (file) {
                            this.items.push({
                                Path: file?.url,
                                Name: file?.name,
                                S3Key: file?.s3Key,
                                ResultUpload: file,
                                Size: file?.size ? file.size / 1024 / 1024 : null,
                                Code: file?.Code || UtilityExHelper.randomText(10),
                            })
                        }
                    });
                    this.valueChange.emit(this.items);
                } else {
                    let file = files && files[0];
                    this.items = [];
                    this.items.push({
                        Path: file?.url,
                        Name: file?.name,
                        S3Key: file?.s3Key,
                        ResultUpload: file,
                        Size: file?.size ? file.size / 1024 / 1024 : null,
                        Code: file?.Code || UtilityExHelper.randomText(10),
                    });
                    this.valueChange.emit(this.items);
                }
                if (this.decorator.popupArchive.okFunction)
                    this.decorator.popupArchive.okFunction(files);
            });
        }
    }
    public renderFile() {
        this.items = [];
        if (!this.value) return;
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
            items.forEach((item: any) => {
                let value = typeof item === 'string' || item instanceof String
                    ? { Path: item, Name: item.substring(item.lastIndexOf('/') + 1).substring(item.lastIndexOf('\\') + 1) }
                    : item;
                let url = value.Path || value.Url;
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
                    } else {
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
                        }
                    }
                }
            });
        }
    }
    public setValue(value: any) {
        this.updateValueChange(value);
        this.renderFile();
    }
    public readFile(files: any) {
        if (files && files.length > 0) {
            // let max = this.decorator.max;
            let max = this.decorator.max;
            let length = files.length > max ? max : files.length;
            for (let i = 0; i < length; i++) {
                const file = files[i];
                let item: FileData = {
                    Path: null,
                    Percent: 0,
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

                        this.updateValueChange(this.items);
                        this.valueChange.emit(this.value);
                        this.fileInput.nativeElement.value = '';
                    };
                    FR.onerror = () => {
                        this.dialog.Error('Tệp ' + file.name + ' không đúng định dạng, vui lòng chọn tệp khác');
                    };
                    FR.readAsDataURL(file);
                } else if (files.length == 1) {
                    this.dialog.Error('Tệp ' + fileDb.Name + ' đã tồn tại, vui lòng chọn tệp khác');
                }
            }
        }
    }
    public selectedFile(event: any) {
        let files = event.srcElement.files;
        this.validateFiles(files);
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
    private updateValueChange(item: any) {
        this.needCheckOnChange = false;
        this.value = item;
        setTimeout(() => this.needCheckOnChange = true, 300);
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
                    let path = item.Path || item.Name,
                        type = ValidatorHelper.isImageFile(path)
                            ? FileType.Image
                            : ValidatorHelper.isVideoFile(path) ? FileType.Video : FileType.File;
                    let obj: UploadData = {
                        type: type,
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
                                    await this.service.moveCustomUpload(this.decorator.customUpload, resultUpload.Object, type).then((result: ResultApi) => {
                                        if (ResultApi.IsSuccess(result)) {
                                            item.ResultUpload = result.Object;
                                            if (result.Object) {
                                                let files: any;
                                                if (result.Object.files && result.Object.files.length > 0)
                                                    files = result.Object.files;
                                                else if (result.Object.images && result.Object.images.length > 0)
                                                    files = result.Object.images;
                                                else if (result.Object.videos && result.Object.videos.length > 0)
                                                    files = result.Object.videos;
                                                item.Path = files.map((c: any) => c && Array.isArray(c) ? c[0] : c).map((c: any) => c.url)[0];
                                                item.S3Key = files.map((c: any) => c && Array.isArray(c) ? c[0] : c).map((c: any) => c.s3Key)[0];
                                            }
                                        }
                                    });
                                } else {
                                    item.ResultUpload = resultUpload.Object;
                                    if (resultUpload.Object) {
                                        let files: any;
                                        if (resultUpload.Object.files && resultUpload.Object.files.length > 0)
                                            files = resultUpload.Object.files;
                                        else if (resultUpload.Object.images && resultUpload.Object.images.length > 0)
                                            files = resultUpload.Object.images;
                                        else if (resultUpload.Object.videos && resultUpload.Object.videos.length > 0)
                                            files = resultUpload.Object.videos;
                                        item.Path = files.map((c: any) => c && Array.isArray(c) ? c[0] : c).map((c: any) => c.url)[0];
                                        item.S3Key = files.map((c: any) => c && Array.isArray(c) ? c[0] : c).map((c: any) => c.s3Key)[0];
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
        this.validateFiles(event.dataTransfer.files);
    }
    private validateFiles(files: any[]) {
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
                let messageError = '<p>Hệ thống cho phép tối đa 1 lần tải ' + this.decorator.max + ' tệp!</p>';
                messageError += '<p>Bạn chỉ được tải lên thêm <b>' + (this.decorator.max - count) + '</b> Tệp!</p>';
                messageError += '<p>Bạn có muốn tiếp tục tải lên (<b>' + (this.decorator.max - count) + '/' + files.length + '</b> Tệp) ?</p>';

                if (this.decorator.max - count > 0) {
                    this.dialog.Confirm(messageError, () => {
                        let fileBuffer = []
                        Array.prototype.push.apply(fileBuffer, files);
                        files = fileBuffer.splice(0, this.decorator.max - count);
                        ValidatorHelper.validFiles(files, this.decorator, this.fileInput, this.dialog, currentUpload, (files) => { this.readFile(files) })
                    }, () => {
                        this.fileInput.nativeElement.value = null;
                    });
                } else {
                    this.dialog.Error('<p>Hệ thống cho phép tối đa 1 lần tải ' + this.decorator.max + ' tệp!</p>')
                }
            } else
                ValidatorHelper.validFiles(files, this.decorator, this.fileInput, this.dialog, currentUpload, (files) => { this.readFile(files) })
        }
    }
}