import * as _ from 'lodash';
import { formatDate } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MSConfirmImportEntity } from '../../../../_core/domains/entities/meeyseo/ms.seo.entity';

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MSListImportTextLinkComponent extends GridComponent implements OnInit {
    fileId: string;
    disabled: boolean;
    processing: boolean;
    @Input() params: any;
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        HidePaging: true,
        UpdatedBy: false,
        HideSearch: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Size: ModalSizeType.ExtraLarge,
        Reference: MSConfirmImportEntity,
    };

    constructor() {
        super();
        this.properties = [
            {
                Property: 'stt', Title: 'STT', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'description', Title: 'Mô tả', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    let text = '';
                    let color = 'red';
                    if (item.description.indexOf('Hợp lệ') >= 0 || item.description.indexOf('Thành công') >= 0) {
                        color = 'blue';
                    }
                    text = '<p style="color: ' + color + '" title= "' + item.description + '">' + item.description + '</p>';
                    return text;
                }
            },
            {
                Property: 'structureLabel', Title: 'Cấu trúc', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'propertyLabel', Title: 'Giá trị thuộc tính', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'limit', Title: 'Giới hạn', Type: DataType.String, DisableOrder: true, Align: 'center',
            },
            {
                Property: 'text', Title: 'Anchor text', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'url', Title: 'URL', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'priority', Title: 'Thứ tự', Type: DataType.String, DisableOrder: true,
            },

        ];
    }

    async ngOnInit() {
        let items = this.params && this.params['items'],
            statisticals = this.params && this.params['statisticals'];
        this.renderItems(items, statisticals);

        this.fileId = this.params && this.params['fileId'];
        this.disabled = this.params && this.params['disabled'];
    }



    public async confirm() {
        this.processing = true;
        if (this.fileId) {
            return await this.service.callApi('MSHighlight', 'ImportTextLinkAuto/' + this.fileId, null, MethodType.Post).then((result: ResultApi) => {
                this.processing = false;
                if (ResultApi.IsSuccess(result)) {
                    let obj = result?.Object;
                    if (obj?.totalSuccess >= 1) {
                        ToastrHelper.Success('Thêm mới thành công ' + obj?.totalSuccess + ' text link');

                        // refresh grid
                        this.event.RefreshSubGrids.emit('Properties');
                        this.event.RefreshSubGrids.emit('Structures');

                        // close and open other popup
                        this.dialogService.HideAllDialog();
                        setTimeout(() => {
                            this.dialogService.WapperAsync({
                                cancelText: 'Đóng',
                                objectExtra: {
                                    items: obj?.data,
                                    statisticals: {
                                        'Số text link thành công': obj?.totalSuccess,
                                        'Số text link không thành công': obj?.totalError,
                                    },
                                },
                                confirmText: 'Export',
                                title: 'Thông báo Import',
                                size: ModalSizeType.ExtraLarge,
                                object: MSListImportTextLinkComponent,
                            });
                        }, 300);
                        return true;
                    } else {
                        ToastrHelper.Error('Thêm mới không thành công');
                        // close and open other popup
                        this.dialogService.HideAllDialog();
                        setTimeout(() => {
                            this.dialogService.WapperAsync({
                                cancelText: 'Đóng',
                                objectExtra: {
                                    items: obj?.data,
                                    statisticals: {
                                        'Số text link thành công': obj?.totalSuccess,
                                        'Số text link không thành công': obj?.totalError,
                                    },
                                },
                                confirmText: 'Export',
                                title: 'Thông báo Import',
                                size: ModalSizeType.ExtraLarge,
                                object: MSListImportTextLinkComponent,
                            });
                        }, 300);
                    }
                    return true;
                } else {
                    ToastrHelper.ErrorResult(result);
                    return false;
                }
            }, (e: any) => {
                ToastrHelper.Exception(e);
                return false;
            });
        } else {
            if (this.items && this.items.length > 0) {
                let currentDate = formatDate(new Date(), 'dd.MM.yyyy', 'en');
                let fileName = "Ket_qua_import text link_" + currentDate;
                return this.service.downloadFileByUrl('/admin/MSHighlight/ExportTextLinkAuto', this.originalItems).toPromise().then(data => {
                    this.loading = false
                    switch (data.type) {
                        case HttpEventType.DownloadProgress:
                            break;
                        case HttpEventType.Response:
                            let extension = 'xlsx';
                            const downloadedFile = new Blob([data.body], { type: data.body.type });
                            const a = document.createElement('a');
                            a.setAttribute('style', 'display:none;');
                            document.body.appendChild(a);
                            a.download = fileName + '.' + extension;
                            a.href = URL.createObjectURL(downloadedFile);
                            a.target = '_blank';
                            a.click();
                            document.body.removeChild(a);
                            break;
                    }
                    return true;
                }).catch(ex => {
                    this.loading = true
                });
            }
            else {
                ToastrHelper.Error('Không có dữ liệu xuất excel');
            }
        }
    }
}
