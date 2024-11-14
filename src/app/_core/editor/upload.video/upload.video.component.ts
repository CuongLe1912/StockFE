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
import { ToastrHelper } from "../../helpers/toastr.helper";
import { VideoEx } from "../../decorators/video.decorator";
import { UploadData } from "../../domains/data/upload.data";
import { UtilityExHelper } from "../../helpers/utility.helper";
import { ValidatorHelper } from "../../helpers/validator.helper";
import { AdminApiService } from "../../services/admin.api.service";
import { ModalSizeType } from "../../domains/enums/modal.size.type";
import { AdminDialogService } from "../../services/admin.dialog.service";
import { PopupViewVideoComponent } from "./popup.view.video/popup.view.video.component";
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";

@Component({
    selector: 'editor-upload-video',
    styleUrls: ['./upload.video.component.scss'],
    templateUrl: './upload.video.component.html',
})
export class UploadVideoComponent implements OnInit, OnChanges {
    StoreType = StoreType;
    removedFile: FileData;
    items: FileData[] = [];
    needCheckOnChange: boolean = true;

    @Input() value: any;
    @Input() decorator: VideoEx;
    @ViewChild('fileInput') fileInput: ElementRef;
    @Output() valueChange = new EventEmitter<any>();
    @Output() captureChange = new EventEmitter<string>();

    constructor(
        public service: AdminApiService,
        public dialog: AdminDialogService) {
    }

    ngOnInit() {
        this.decorator.id = UtilityExHelper.randomText(8);
        this.renderVideo();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            if (changes.value && this.needCheckOnChange) {
                if (typeof changes.value.currentValue != 'string') {
                    setTimeout(() => {
                        this.renderVideo();
                    }, 500);
                }
            }
        }
    }

    public clearValue() {
        this.items = [];
        this.updateValueChange(null);
    }
    public viewVideo() {
        this.dialog.WapperAboveAsync({
            title: 'Xem video',
            cancelText: 'Đóng',
            size: ModalSizeType.ExtraLarge,
            object: PopupViewVideoComponent,
            objectExtra: { items: _.cloneDeep(this.items) },
        });
    }
    public renderVideo() {
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
            items.forEach((value: string) => {
                if (value.indexOf('http') >= 0) {
                    this.items.push({
                        Path: value,
                        Name: value.substring(this.value.lastIndexOf('/') + 1).substring(this.value.lastIndexOf('\\') + 1)
                    });
                } else {
                    this.items.push({
                        Path: AppConfig.ApiUrl + '/' + value,
                        Name: value.substring(this.value.lastIndexOf('/') + 1).substring(this.value.lastIndexOf('\\') + 1)
                    });
                }
            });
        }
        this.updateValueChange(this.items);
        this.valueChange.emit(this.value);
    }
    public setValue(value: any) {
        this.updateValueChange(value);
        this.renderVideo();
    }
    public readFile(files: any) {
        if (files && files.length > 0) {
            let length = files.length > this.decorator.max ? this.decorator.max : files.length;
            for (let i = 0; i < length; i++) {
                const file = files[i];
                let item: FileData = {
                    Path: null,
                    Percent: 0,
                    Name: file.name,
                    NativeData: file,
                    Size: file.size / 1024 / 1024,
                };
                item.Data = URL.createObjectURL(file);

                let FR = new FileReader();
                FR.onload = () => {
                    if (this.removedFile) {
                        let index = this.items.findIndex(c => c.Name == this.removedFile.Name);
                        if (index >= 0) this.items[index] = item;
                        this.removedFile = null;
                    } else this.items.push(item);
                    this.updateValueChange(this.items);
                    this.valueChange.emit(this.value);
                    // this.captureImage(item.Data).then((image: string) => {
                    //     item.CaptureImage = image;
                    //     this.captureChange.emit(image);
                    // });
                };
                FR.onerror = () => {
                    this.dialog.Error('Video ' + file.name + ' bị lỗi, vui lòng chọn video khác');
                };
                FR.readAsDataURL(file);
            }
        }
    }
    public removeFile(item: FileDto) {
        if (!this.decorator.multiple) this.items = [];
        else {
            _.remove(this.items, (c: FileData) => c.Name == item.Name);

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
    public selectedFile(event: any) {
        let files = event.srcElement.files;
        if (files && files.length > 0) {
            if (this.decorator.multiple) {
                let maxFile = this.decorator.max;
                let curentFileCount = (this.items?.length || 0) + files.length;
                if (curentFileCount > maxFile) {
                    this.dialog.Error('<p>Tổng video vượt quá số lượng cho phép (Tối đa ' + maxFile + ' video)</p>');
                    this.fileInput.nativeElement.value = '';
                    return;
                }
            } else {
                if (this.items && this.items?.length > 0) {
                    this.removedFile = this.items[0];
                }
            }
            ValidatorHelper.validVideos(files, this.decorator, this.fileInput, this.dialog, (files) => { this.readFile(files) })
        }
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
                        type: FileType.Video,
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
                                    await this.service.moveCustomUpload(this.decorator.customUpload, resultUpload.Object, FileType.Video).then((result: ResultApi) => {
                                        if (ResultApi.IsSuccess(result)) {
                                            item.ResultUpload = result.Object;
                                            if (result.Object && result.Object.videos) {
                                                let videos = result.Object.videos;
                                                item.Path = videos.map((c: any) => c && Array.isArray(c) ? c[0] : c).map((c: any) => c.url)[0];
                                                item.S3Key = videos.map((c: any) => c && Array.isArray(c) ? c[0] : c).map((c: any) => c.s3Key)[0];
                                            }
                                        }
                                    });
                                } else {
                                    item.ResultUpload = resultUpload.Object;
                                    if (resultUpload.Object && resultUpload.Object.videos) {
                                        let videos = resultUpload.Object.videos;
                                        item.Path = videos.map((c: any) => c && Array.isArray(c) ? c[0] : c).map((c: any) => c.url)[0];
                                        item.S3Key = videos.map((c: any) => c && Array.isArray(c) ? c[0] : c).map((c: any) => c.s3Key)[0];
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
        let files = event.dataTransfer.files;
        if (!this.decorator.multiple) {
            this.clearValue();
        }

        if (files && files.length > 0) {
            let maxFile = this.decorator.multiple ? this.decorator.max : 1;
            let curentFileCount = (this.items?.length || 0) + files.length;
            if (curentFileCount > maxFile) {
                this.dialog.Error('<p>Tổng video vượt quá số lượng cho phép (Tối đa ' + maxFile + ' video)</p>');
                this.fileInput.nativeElement.value = '';
                return;
            } else
                ValidatorHelper.validVideos(files, this.decorator, this.fileInput, this.dialog, (files) => { this.readFile(files) })
        }
    }

    private updateValueChange(item: any) {
        this.needCheckOnChange = false;
        this.value = item;
        setTimeout(() => this.needCheckOnChange = true, 300);
    }
    private captureImage(data: any): Promise<string> {
        let video = document.createElement('video');
        video.src = data;
        return new Promise((resolve, reject) => {
            video.addEventListener('seeked', () => {
                const canvas = document.createElement('canvas')
                // scale the canvas accordingly
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                // draw the video at that frame
                canvas
                    .getContext('2d')
                    .drawImage(video, 0, 0, canvas.width, canvas.height)
                // convert it to a usable data URL
                const dataURL = canvas.toDataURL('image/jpeg')
                if (dataURL) resolve(dataURL)
                else reject(null)
            });
            video.addEventListener('error', () => {
                ToastrHelper.Error('Video không đúng định dạng');
                reject(null);
            });
            video.addEventListener('loadeddata', () => {
                video.currentTime = 5;
            });
        })
    }
}