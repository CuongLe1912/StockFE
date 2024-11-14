import * as _ from 'lodash';
import { Component, OnInit } from "@angular/core";
import { HttpEventType } from "@angular/common/http";
import { GridData } from "../../_core/domains/data/grid.data";
import { DataType } from "../../_core/domains/enums/data.type";
import { TableData } from "../../_core/domains/data/table.data";
import { ResultApi } from "../../_core/domains/data/result.api";
import { ToastrHelper } from "../../_core/helpers/toastr.helper";
import { ExportType } from "../../_core/domains/enums/export.type";
import { ActionType } from "../../_core/domains/enums/action.type";
import { ResultType } from "../../_core/domains/enums/result.type";
import { ModalSizeType } from "../../_core/domains/enums/modal.size.type";
import { AddBadwordComponent } from "./add.badword/add.badword.component";
import { EditBadwordComponent } from "./edit.badword/edit.badword.component";
import { ImportBadwordComponent } from "./import.badword/import.badword.component";
import { DeleteBadwordComponent } from "./delete.badword/delete.badword.component";
import { GridEditComponent } from "../../_core/components/grid/grid.edit.component";
import { BadwordApiEntity } from "../../_core/domains/entities/badwordapi/badwordapi.entity";

@Component({
    templateUrl: '../../_core/components/grid/grid.component.html',
})

export class BadwordapiComponent extends GridEditComponent implements OnInit {

    obj: GridData = {
        Filters: [
        ],
        Checkable: true,
        Imports: [
        ],
        Exports: [
            
        ],
        Actions: [
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Edit,
                className: 'btn btn-success',
 
                click: (item: BadwordApiEntity) => {
                    this.edit(item);
                }
            },
            //Xóa
            {
                icon: 'la la-trash',
                name: ActionType.Delete,
                systemName: ActionType.Delete,
                className: 'btn btn-danger',

                click: (item: BadwordApiEntity) => {
                    this.delete(item);
                }
            },
        ],
        Features: [
            {
                icon: 'la la-pencil',
                name: 'Import',
                systemName: ActionType.Import,
                className: 'btn btn-success',
                click: () => {
                    this.importData();
                }
            },
            {
                name: 'Export',
                systemName: ActionType.Export,
                className: 'btn btn-primary',
                click: async () => {
                    this.loadingText = 'Đang xuất dữ liệu...';
                    this.loading = true;
                    let obj: TableData = _.cloneDeep(this.itemData) || new TableData();
                    if (obj) {
                        obj.Export = {
                            Limit: 200000,
                            Type: ExportType.Excel,
                        };
                        obj.Paging.Index = 1;
                        obj.Paging.Size = obj.Export.Limit;
                    }
                    await this.service.downloadFile('BadwordApi', obj).toPromise().then(data => {
                        switch (data.type) {
                            case HttpEventType.DownloadProgress:
                                break;
                            case HttpEventType.Response:
                                let extension = 'xlsx';
                                const downloadedFile = new Blob([data.body], { type: data.body.type });
                                const a = document.createElement('a');
                                a.setAttribute('style', 'display:none;');
                                document.body.appendChild(a);
                                a.download = 'DanhSachTuNhayCam' + '.' + extension;
                                a.href = URL.createObjectURL(downloadedFile);
                                a.target = '_blank';
                                a.click();
                                document.body.removeChild(a);
                                break;
                        }
                    }, () => {
                        ToastrHelper.Error('Lỗi hệ thống khi xuất dữ liệu, vui lòng thử lại sau');
                    });
                    this.loadingText = null;
                    this.loading = false;
                },
                icon: 'kt-nav__link-icon la la-file-excel-o',
            },
            {
                icon: 'la la-plus',
                name: 'Thêm mới',
                click: () => this.addNew(),
                className: 'btn btn-primary',
                systemName: ActionType.AddNew,
            },
            {
                icon: 'la la-trash',
                name: ActionType.Delete,
                systemName: ActionType.Delete,
                className: 'btn btn-danger',

                click: () => {
                    this.deleteMulti();
                }
            },
        ],
        UpdatedBy: false,
        DisableAutoLoad: true,
        Reference: BadwordApiEntity,
        CustomFilters: [],
    };


    constructor() {
        super();
    }

    async ngOnInit() {
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'Text', Title: 'Từ', Type: DataType.String },
        ]
        this.obj.Url = '/admin/BadwordApi/Items';
        await this.render(this.obj);
    }
    public importData(){
        this.dialogService.WapperAsync({
            cancelText: '',
            confirmText: 'Đồng ý',
            title: 'Import Từ nhạy cảm',
            size: ModalSizeType.Medium,
            object: ImportBadwordComponent,
        }, () => this.loadItems() );
    }
    public addNew(){
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Thêm mới',
            title: 'Thêm mới',
            confirmClose: true,
            size: ModalSizeType.Medium,
            object: AddBadwordComponent,
        }, () => this.loadItems());
    }
    public edit(item: BadwordApiEntity){
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Đồng ý',
            title: 'Chỉnh sửa',
            confirmClose: true,
            size: ModalSizeType.Medium,
            objectExtra: { id: item.Id },
            object: EditBadwordComponent,
        }, () => this.loadItems());
    }
    public delete(item: BadwordApiEntity){
        this.dialogService.Confirm('Bạn có chắc chắn muốn xóa từ "'+item.Text+'"', () => {
            this.service.delete('badwordapi', item.Id).then(async (result: ResultApi) => {
                if (result && result.Type == ResultType.Success) {
                    ToastrHelper.Success('Xóa từ thành công');
                    this.loadItems()
                } else ToastrHelper.ErrorResult(result);
            });
        });
    }
    public deleteMulti(){
        let items : any
        items = _.cloneDeep(this.cloneItems)
        let ids = items.filter(x => x.Checked == true).map(x => x.Id)
        if(ids.length > 0){

            let ids = items.filter(x => x.Checked == true).map(x => x.Id)
            this.dialogService.WapperAsync({
                cancelText: 'Hủy bỏ',
                confirmText: 'Đồng ý',
                title: 'Xóa Từ nhạy cảm',
                size: ModalSizeType.Medium,
                object: DeleteBadwordComponent,
                objectExtra: { ids: ids },
            }, () => this.loadItems() );
        }
        else{
            ToastrHelper.Error('Chọn những bản ghi cần xóa');
        }
        
        
    }
    loadComplete(): void {
        if (this.items && this.items.length > 0) {
          let pagesize = this.itemData.Paging?.Size || 20;
          let pageindex = this.itemData.Paging?.Index || 1;
          this.items.forEach((item: any, index) => {
            item.Index = (pagesize * (pageindex - 1)) + (index + 1);
          });
        }
      }
}