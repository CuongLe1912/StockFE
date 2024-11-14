import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { FileEx } from '../decorators/file.decorator';
import { FileValid } from '../domains/data/file.data';
import { VideoEx } from '../decorators/video.decorator';
import { ImageEx } from '../decorators/image.decorator';
import { DimensionData } from '../domains/data/dimension.data';
import { DimensionType } from '../domains/enums/dimension.type';
import { AdminDialogService } from '../services/admin.dialog.service';

@Injectable()
export class ValidatorHelper {
    public constructor() { }

    public static validEmail(value: string): boolean {
        if (ValidatorHelper.validRequied(value)) {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(value).toLowerCase());
        }
        return false;
    }

    public static validPhone(value: string): boolean {
        if (ValidatorHelper.validRequied(value)) {
            let re = /^\d+$/;
            return re.test(String(value).toLowerCase());
        }
        return false;
    }

    public static isImageFile(fileName: string) {
        if (!fileName) return false;
        if (fileName.toLowerCase().search(/.(png|jpg|jpeg|heic|gif)/) < 0) {
            return false;
        } return true;
    }

    public static isVideoFile(fileName: string) {
        if (!fileName) return false;
        if (fileName.toLowerCase().search(/.(mpeg|ogg|webm|3gp|mp4|avi|wmv|vob|mkv|flv|wmv9|org|wmv|mpeg|3gpp|mov|hevc)/) < 0) {
            return false;
        } return true;
    }

    public static validRequied(value: string): boolean {
        return value && value.length > 0;
    }

    public static validFontUpload(files: any): boolean {
        if (files && files[0]) {
            let file = files[0];
            if (file.name.search(/.(otf|ttf|woff)/) < 0)
                return false;
            if (file.size > 30 * 1024 * 1024)
                return false;
            return true;
        }
        return false;
    }

    public static validFileUpload(files: any, regexTypes?: RegExp): FileValid {
        let listFile: FileValid = new FileValid();
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let fileName = '.' + file.name.split('.').pop();
                if (regexTypes) {
                    if (fileName.toLowerCase().search(regexTypes) < 0) {
                        if (!listFile.Errors) listFile.Errors = [];
                        listFile.Errors.push(file);
                    } else {
                        if (!listFile.Success) listFile.Success = [];
                        listFile.Success.push(file);
                    }
                } else {
                    if (fileName.search(/.(pdf|doc|docx|xls|xlsx|zip|rar|txt)/) < 0) {
                        if (!listFile.Errors) listFile.Errors = [];
                        listFile.Errors.push(file);
                    } else {
                        if (!listFile.Success) listFile.Success = [];
                        listFile.Success.push(file);
                    }
                }
            }
        } else {
            if (!listFile.Errors) listFile.Errors = [];
            listFile.Errors = files;
        }
        return listFile;
    }

    public static validImageUploadFormat(files: any, regexTypes = null): FileValid {
        let listFile: FileValid = new FileValid();
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let fileName = '.' + file.name.split('.').pop();
                if (regexTypes) {
                    if (fileName.toLowerCase().search(regexTypes) < 0) {
                        if (!listFile.Errors) listFile.Errors = [];
                        listFile.Errors.push(file);
                    } else {
                        if (!listFile.Success) listFile.Success = [];
                        listFile.Success.push(file);
                    }
                } else {
                    if (!file.type || file.type.search(/image\/(png|jpg|jpeg|heic)/) < 0) {
                        if (!listFile.Errors) listFile.Errors = [];
                        listFile.Errors.push(file);
                    } else {
                        if (!listFile.Success) listFile.Success = [];
                        listFile.Success.push(file);
                    }
                }
            }
        } else {
            if (!listFile.Errors) listFile.Errors = [];
            listFile.Errors = files;
        }
        return listFile;
    }

    public static validVideoUploadFormat(files: any, regexTypes = null): FileValid {
        let listFile: FileValid = new FileValid();
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let fileName = '.' + file.name.split('.').pop();
                if (regexTypes) {
                    if (fileName.toLowerCase().search(regexTypes) < 0) {
                        if (!listFile.Errors) listFile.Errors = [];
                        listFile.Errors.push(file);
                    } else {
                        if (!listFile.Success) listFile.Success = [];
                        listFile.Success.push(file);
                    }
                } else {
                    if (file.type.search(/video\/(mpeg|ogg|webm|3gp|mp4|avi|wmv|vob|mkv|flv|wmv9)/) < 0) {
                        if (!listFile.Errors) listFile.Errors = [];
                        listFile.Errors.push(file);
                    } else {
                        if (!listFile.Success) listFile.Success = [];
                        listFile.Success.push(file);
                    }
                }
            }
        } else {
            if (!listFile.Errors) listFile.Errors = [];
            listFile.Errors = files;
        }
        return listFile;
    }

    public static validUploadSize(files: any, size: number): FileValid {
        let listFile: FileValid = new FileValid();
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let validSize = Math.round((file.size / 1024 / 1024) * 100) / 100;
                if (validSize > size) {
                    if (!listFile.Errors) listFile.Errors = [];
                    listFile.Errors.push(file);
                }
                else {
                    if (!listFile.Success) listFile.Success = [];
                    listFile.Success.push(file);
                }
            }
        } else {
            if (!listFile.Errors) listFile.Errors = [];
            listFile.Errors = files;
        }
        return listFile;
    }

    public static validUploadTotalSize(files: any, totalSize: number, filesCurrent = []): boolean {
        if (files && files.length > 0) {
            let total = files.reduce((a, file) => {
                return a + file.size;
            }, 0);
            if (filesCurrent && filesCurrent.length > 0) {
                let lstCurrent = filesCurrent.map(c => { return c.NativeData });
                total += lstCurrent.reduce((a, file) => {
                    return a + file.size;
                }, 0);
            }
            let validSize = Math.round((total / 1024 / 1024) * 100) / 100;
            if (validSize <= totalSize) {
                return true;
            }
        }
        return false;
    }

    public static async validUploadDimension(files: any, dimension: DimensionData): Promise<FileValid> {
        let listFile: FileValid = new FileValid();
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                if (file.name.indexOf('.heic') >= 0) {
                    if (!listFile.Success) listFile.Success = [];
                    listFile.Success.push(file);
                    continue;
                }

                let realDimension = await ValidatorHelper.imageDimension(file) as DimensionData;
                if (dimension && realDimension) {
                    let type = dimension.type || DimensionType.Min;
                    if (type == DimensionType.Min) {
                        if (realDimension.width <= dimension.width ||
                            realDimension.height <= dimension.height) {
                            if (!listFile.Errors) listFile.Errors = [];
                            listFile.Errors.push(file);
                        } else {
                            if (!listFile.Success) listFile.Success = [];
                            listFile.Success.push(file);
                        }

                    } else if (type == DimensionType.Max) {
                        if (realDimension.width >= dimension.width ||
                            realDimension.height >= dimension.height) {
                            if (!listFile.Errors) listFile.Errors = [];
                            listFile.Errors.push(file);
                        } else {
                            if (!listFile.Success) listFile.Success = [];
                            listFile.Success.push(file);
                        }
                    } else if (type == DimensionType.Equals) {
                        if (realDimension.width != dimension.width ||
                            realDimension.height != dimension.height) {
                            if (!listFile.Errors) listFile.Errors = [];
                            listFile.Errors.push(file);
                        } else {
                            if (!listFile.Success) listFile.Success = [];
                            listFile.Success.push(file);
                        }
                    }
                } else {
                    if (!listFile.Success) listFile.Success = [];
                    listFile.Success.push(file);
                }
            }
        } else {
            if (!listFile.Errors) listFile.Errors = [];
            listFile.Errors = files;
        }
        return listFile;
    }

    private static imageDimension(file: any) {
        const promise: Promise<DimensionData> = new Promise((resolve) => {
            let reader = new FileReader();
            reader.onload = (e: any) => {
                let image = document.createElement("img");
                image.src = e.target.result;
                image.onload = function () {
                    resolve({
                        width: image.naturalWidth,
                        height: image.naturalHeight
                    });
                };
            };
            reader.readAsDataURL(file);
        });
        return promise;
    }

    public static validLength(value: string, maxLength: number = 255, minLength: number = 0) {
        if (value) {
            return value.length >= minLength && value.length <= maxLength;
        }
        return false;
    }

    public static async validImages(files, decorator: ImageEx, fileInput, dialog: AdminDialogService, filesCurrent = [], readFile: (files) => void = null): Promise<boolean> {
        if (files && files.length > 0) {
            let messageError = '';
            let valid = true;
            let fileSuccess = [];

            let listFileFormat = ValidatorHelper.validImageUploadFormat(files, decorator.regexTypes);
            if (listFileFormat?.Errors && listFileFormat.Errors.length > 0) {
                messageError += '<p>Có (' + listFileFormat.Errors.length + ' Tệp) không đúng định dạng, (' + decorator.description + ')</p>';
                valid = false;
            }
            if (listFileFormat?.Success && listFileFormat?.Success.length > 0) {
                let listFileSize = ValidatorHelper.validUploadSize(listFileFormat.Success, decorator.size);
                if (listFileSize?.Errors && listFileSize.Errors.length > 0) {
                    messageError += '<p>Có (' + listFileSize.Errors.length + ' Ảnh) có dung lượng quá lớn (Tối đa ' + decorator.size + 'MB)</p>';
                    valid = false;
                }
                if (listFileSize?.Success && listFileSize?.Success.length > 0) {
                    let listFileDimension = await ValidatorHelper.validUploadDimension(listFileSize.Success, decorator.dimension);
                    if (listFileDimension?.Errors && listFileDimension.Errors.length > 0) {
                        let width = decorator.dimension.width || 0,
                            height = decorator.dimension.height || 0,
                            message = !decorator.dimension.type || decorator.dimension.type == DimensionType.Min
                                ? 'Có (' + listFileDimension.Errors.length + ' Ảnh) có kích cỡ không hợp lệ (Tối thiểu ' + width + 'px x ' + height + 'px)'
                                : decorator.dimension.type == DimensionType.Max
                                    ? 'Có (' + listFileDimension.Errors.length + ' Ảnh) có kích cỡ không hợp lệ (Tối đa ' + width + 'px x ' + height + 'px)'
                                    : 'Có (' + listFileDimension.Errors.length + ' Ảnh) có kích cỡ không hợp lệ (Kích thước hợp lệ: ' + width + 'px x ' + height + 'px)';
                        messageError += '<p>' + message + '</p>';
                        valid = false;
                    }
                    if (listFileDimension?.Success && listFileDimension.Success.length > 0) {
                        if (!ValidatorHelper.validUploadTotalSize(listFileDimension.Success, decorator.totalSize, filesCurrent)) {
                            messageError += '<p>Tổng ảnh có dung lượng vượt quá dung lượng cho phép (Tối đa ' + decorator.totalSize + 'MB)</p>';
                            valid = false;
                        } else {
                            fileSuccess = listFileDimension.Success;
                        }
                    }
                }
            }

            if (valid) {
                // let max = decorator.max;
                let max = decorator.max;// tối đa 1 lần tải fix cứng 50;
                if (max < files.length) {
                    messageError += '<p>Hệ thống cho phép tối đa 1 lần tải ' + max + ' ảnh!</p>'
                    messageError += '<p>Bạn có muốn tiếp tục tải lên (<b>50/' + files.length + '</b> Ảnh) ?</p>';

                    dialog.Confirm(messageError, () => {
                        if (readFile) readFile(files);
                    }, () => {
                        fileInput.nativeElement.value = null;
                    });
                } else {
                    if (readFile) readFile(files);
                }
            } else {
                if (fileSuccess && fileSuccess.length > 0) {
                    // let max = decorator.max;
                    let max = decorator.max;// tối đa 1 lần tải fix cứng 50;
                    if (max < fileSuccess.length) {
                        messageError += '<p>Hệ thống cho phép tối đa 1 lần tải ' + max + ' ảnh!</p>'
                        messageError += '<p>Bạn có muốn tiếp tục tải lên (<b>50/' + fileSuccess.length + '</b> Ảnh) ?</p>';
                    } else
                        messageError += '<p>Bạn có muốn tiếp tục tải lên (<b>' + fileSuccess.length + '</b> Ảnh) ?</p>';
                    dialog.Confirm(messageError, () => {
                        if (readFile) readFile(fileSuccess);
                    }, () => {
                        fileInput.nativeElement.value = null;
                    });
                } else {
                    dialog.Error(messageError);
                    fileInput.nativeElement.value = null;
                }
            }

            return valid;
        }
    }

    public static async validFiles(files, decorator: FileEx, fileInput, dialog: AdminDialogService, filesCurrent = [], readFile: (files) => void = null): Promise<boolean> {
        if (files && files.length > 0) {
            let messageError = '';
            let valid = true;
            let fileSuccess = [];

            let listFileFormat = ValidatorHelper.validFileUpload(files, decorator.regexTypes);
            if (listFileFormat?.Errors && listFileFormat.Errors.length > 0) {
                messageError += '<p>Có (' + listFileFormat.Errors.length + ' Tệp) không đúng định dạng, (' + decorator.description + ')</p>';
                valid = false;
            }
            if (listFileFormat?.Success && listFileFormat?.Success.length > 0) {
                let listFileSize = ValidatorHelper.validUploadSize(listFileFormat.Success, decorator.size);
                if (listFileSize?.Errors && listFileSize.Errors.length > 0) {
                    messageError += '<p>Có (' + listFileSize.Errors.length + ' Tệp) có kích thước quá lớn (Tối đa ' + decorator.size + 'MB)</p>';
                    valid = false;
                }
                if (listFileSize?.Success && listFileSize?.Success.length > 0) {
                    if (!ValidatorHelper.validUploadTotalSize(listFileSize.Success, decorator.totalSize, filesCurrent)) {
                        messageError += '<p>Tổng tệp có dung lượng vượt quá dung lượng cho phép (Tối đa ' + decorator.totalSize + 'MB)</p>';
                        valid = false;
                    } else {
                        fileSuccess = listFileSize.Success;
                    }
                }
            }

            if (valid) {
                // let max = decorator.max;
                let max = decorator.max;// tối đa 1 lần tải fix cứng 50;
                if (max < files.length) {
                    messageError += '<p>Hệ thống cho phép tối đa 1 lần tải ' + max + ' tệp!</p>'
                    messageError += '<p>Bạn có muốn tiếp tục tải lên (<b>50/' + files.length + '</b> Tệp) ?</p>';

                    dialog.Confirm(messageError, () => {
                        if (readFile) readFile(files);
                    }, () => {
                        fileInput.nativeElement.value = null;
                    });
                } else {
                    if (readFile) readFile(files);
                }
            } else {
                if (fileSuccess && fileSuccess.length > 0) {
                    // let max = decorator.max;
                    let max = decorator.max;// tối đa 1 lần tải fix cứng 50;
                    if (max < fileSuccess.length) {
                        messageError += '<p>Hệ thống cho phép tối đa 1 lần tải ' + max + ' tệp!</p>'
                        messageError += '<p>Bạn có muốn tiếp tục tải lên (<b>50/' + fileSuccess.length + '</b> Tệp) ?</p>';
                    } else
                        messageError += '<p>Bạn có muốn tiếp tục tải lên (<b>' + fileSuccess.length + '</b> Tệp) ?</p>';
                    dialog.Confirm(messageError, () => {
                        if (readFile) readFile(fileSuccess);
                    }, () => {
                        fileInput.nativeElement.value = null;
                    });
                } else {
                    dialog.Error(messageError);
                    fileInput.nativeElement.value = null;
                }
            }
            return valid;
        }
    }

    public static async validVideos(files, decorator: VideoEx, fileInput, dialog: AdminDialogService, readFile: (files) => void = null): Promise<boolean> {
        if (files && files.length > 0) {
            let messageError = '';
            let valid = true;
            let fileSuccess = [];

            let listFileFormat = ValidatorHelper.validVideoUploadFormat(files, decorator.regexTypes);
            if (listFileFormat?.Errors && listFileFormat.Errors.length > 0) {
                messageError += '<p>Có (' + listFileFormat.Errors.length + ' Tệp) không đúng định dạng, (' + decorator.description + ')</p>';
                valid = false;
            }
            if (listFileFormat?.Success && listFileFormat?.Success.length > 0) {
                let listFileSize = ValidatorHelper.validUploadSize(listFileFormat.Success, decorator.size);
                if (listFileSize?.Errors && listFileSize.Errors.length > 0) {
                    messageError += '<p>Có (' + listFileSize.Errors.length + ' Video) có kích thước quá lớn (Tối đa ' + decorator.size + 'MB)</p>';
                    valid = false;
                }
                if (listFileSize?.Success && listFileSize?.Success.length > 0) {
                    if (!ValidatorHelper.validUploadTotalSize(listFileSize.Success, decorator.totalSize)) {
                        messageError += '<p>Tổng video có dung lượng vượt quá dung lượng cho phép (Tối đa ' + decorator.totalSize + 'MB)</p>';
                        valid = false;
                    } else {
                        fileSuccess = listFileSize.Success;
                    }
                }
            }

            if (valid) {
                if (readFile) readFile(files);
            } else {
                if (fileSuccess && fileSuccess.length > 0) {
                    messageError += '<p>Bạn có muốn tiếp tục tải lên (' + fileSuccess.length + ' Video) ?</p>';
                    dialog.Confirm(messageError, () => {
                        if (readFile) readFile(fileSuccess);
                    }, () => {
                        fileInput.nativeElement.value = null;
                    });
                } else {
                    dialog.Error(messageError);
                    fileInput.nativeElement.value = null;
                }
            }

            return valid;
        }
    }
}