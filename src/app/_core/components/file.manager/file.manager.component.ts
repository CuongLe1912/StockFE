declare var $;
import * as _ from 'lodash';
import { TreeData } from '../../domains/data/tree.data';
import { ResultApi } from "../../domains/data/result.api";
import { ToastrHelper } from '../../helpers/toastr.helper';
import { Component, OnInit, ViewChild } from "@angular/core";
import { UtilityExHelper } from '../../helpers/utility.helper';
import { EditorComponent } from '../../editor/editor.component';
import { FileEntity } from "../../domains/entities/file.entity";
import { AdminApiService } from "../../services/admin.api.service";
import { FolderEntity } from "../../domains/entities/folder.entity";
import { AdminDialogService } from '../../services/admin.dialog.service';

@Component({
    selector: 'file-manager',
    styleUrls: ['./file.manager.component.scss'],
    templateUrl: './file.manager.component.html'
})
export class FileManagerComponent implements OnInit {
    percent: number = 0;
    totalSize: number = 0;

    search: string;
    groupFolder: any[];
    files: FileEntity[];
    activeUpload: boolean;
    folders: FolderEntity[];
    loading: boolean = true;
    disabled: boolean = true;
    selectedFolderId: number;
    selectedFile: FileEntity;
    loadingFile: boolean = true;
    breadcrumbs: FolderEntity[];
    innerFolders: FolderEntity[];
    loadingFolder: boolean = true;
    file: FileEntity = new FileEntity();
    @ViewChild('uploadFile') uploadFile: EditorComponent;

    constructor(
        public service: AdminApiService,
        public dialog: AdminDialogService) {

    }

    ngOnInit() {
        this.loadFolders();
    }

    async searchChange() {
        this.files = [];
        this.loadingFile = true;
        this.loadingFolder = true;
        await this.service.searchFiles(this.search).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result) && result.Object) {
                this.files = result.Object.Files;
                this.innerFolders = result.Object.Folders;
            }
        });
        this.loadingFile = false;
        this.loadingFolder = false;
    }

    createFolder() {
        this.dialog.PromptAsync('Tên thư mục', null, async (name: string) => {
            this.service.save('folder', {
                Name: name,
                DateTime: new Date(),
                ParentId: this.selectedFolderId > 0 ? this.selectedFolderId : null
            }).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Tạo thư mục thành công');
                    this.loadFolders()
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }, null, 'Tạo thư mục');
    }
    selectFolder(item: FolderEntity) {
        this.selectedFolderId = item && item.Id;
        this.loadInnerFolders();
        this.loadBreadcrumbs();
        this.loadFiles();
    }
    renameFolder(item: FolderEntity) {
        item.Active = false;
        this.dialog.PromptAsync('Tên thư mục', item.Name, async (name: string) => {
            let obj: FolderEntity = _.cloneDeep(item);
            obj.Name = name; if (!obj.ParentId) obj.ParentId = null;
            this.service.save('folder', {
                Id: obj.Id,
                Name: obj.Name,
                DateTime: obj.DateTime,
                ParentId: obj.ParentId,
            }).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Sửa tên thư mục thành công');
                    this.loadFolders();
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }, null, 'Sửa tên thư mục');
    }
    deleteFolder(item: FolderEntity) {
        item.Active = false;
        this.dialog.ConfirmAsync('Có phải bạn muốn xóa thư mục: ' + item.Name, async () => {
            this.service.delete('folder', item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Xóa thư mục thành công');
                    this.loadFolders();
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }, null, 'Xóa thư mục');
    }

    async uploadFiles() {
        await this.uploadFile.upload();

        this.file.File = null;
        await this.loadFiles();
        this.activeUpload = false;
    }
    copyLink(item: FileEntity) {
        item.Active = false;
        UtilityExHelper.copyString(item.Link);
        ToastrHelper.Success('Sao chép đường dẫn thành công');
    }
    renameFile(item: FileEntity) {
        item.Active = false;
        this.dialog.PromptAsync('Tên tệp', item.Name, async (name: string) => {
            let obj: FileEntity = _.cloneDeep(item);
            obj.Name = name; if (!obj.FolderId) obj.FolderId = null;
            this.service.save('file', {
                Id: obj.Id,
                Name: obj.Name,
                Link: obj.Link,
                Size: obj.Size,
                DateTime: obj.DateTime,
                FolderId: obj.FolderId,
                Extension: obj.Extension,
            }).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Sửa tên tệp thành công');
                    this.loadFiles();
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }, null, 'Sửa tên tệp');
    }
    deleteFile(item: FileEntity) {
        item.Active = false;
        this.dialog.ConfirmAsync('Có phải bạn muốn xóa tệp: ' + item.Name, async () => {
            this.service.delete('file', item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Xóa tệp thành công');
                    this.loadFiles();
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }, null, 'Xóa tệp');
    }
    downloadFile(item: FileEntity) {
        let link = document.createElement("a");
        link.href = item.Link;
        link.target = '_blank';
        link.download = item.Name;
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
    }

    toggleActiveUpload() {
        this.activeUpload = !this.activeUpload;
    }

    selectFile(item: FileEntity) {
        this.selectedFile = item;
        if (this.selectedFile) this.disabled = false;
        else this.disabled = true;
    }


    async dblSelectFile(item: FileEntity) {
        this.selectedFile = item;
        await this.confirm();
    }

    async confirm() {
        return this.selectedFile;
    }

    private loadFolders() {
        this.folders = [];
        this.loading = true;
        this.service.folders().then((result: ResultApi) => {
            this.loading = false;
            setTimeout(() => {
                if (ResultApi.IsSuccess(result)) {
                    this.totalSize = result.ObjectExtra as number;
                    this.percent = this.totalSize / 1024 / 1024 / 50000 * 100;

                    this.folders = result.Object as FolderEntity[] || [];
                    this.folders.forEach((folder: FolderEntity) => {
                        if (!folder.ParentId) folder.ParentId = 0;
                    });
                    let treeDatas: TreeData[] = [];
                    this.folders.forEach((folder: FolderEntity) => {
                        if (!folder.ParentId) {
                            let item: TreeData = {
                                children: [],
                                id: folder.Id,
                                text: folder.Name,
                                icon: 'fa fa-folder',
                                state: { opened: false },
                            };
                            this.addChilds(item);
                            treeDatas.push(item);
                        }
                    });

                    if (treeDatas && treeDatas.length > 0) {
                        $('#tree-folder').jstree({
                            plugins: ['wholerow', 'sort', 'search'],
                            core: {
                                data: treeDatas,
                                themes: { responsive: true },
                            }
                        }).on('changed.jstree', (e: any, data: any) => {
                            this.selectedFolderId = data && data.node && data.node.id;
                            this.loadInnerFolders();
                            this.loadBreadcrumbs();
                            this.loadFiles();
                        });
                        this.loadInnerFolders();
                        this.loadBreadcrumbs();
                        this.loadFiles();
                    }
                }
            }, 300);
        });
    }
    private async loadFiles() {
        this.files = [];
        this.loadingFile = true;
        await this.service.files(this.selectedFolderId).then((result: ResultApi) => {
            this.loadingFile = false;
            if (ResultApi.IsSuccess(result)) {
                this.files = result.Object as FileEntity[] || [];
            }
        });
        this.loadingFile = false;
    }
    private async loadInnerFolders() {
        this.innerFolders = [];
        this.loadingFolder = true;
        if (this.selectedFolderId) {
            await this.service.folders(this.selectedFolderId).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.innerFolders = result.Object as FolderEntity[];
                }
            });
        } else this.innerFolders = _.cloneDeep(this.folders.filter(c => !c.ParentId));
        this.loadingFolder = false;
    }

    private loadBreadcrumbs() {
        this.breadcrumbs = [];
        this.activeUpload = false;
        if (this.selectedFolderId) {
            let node = this.folders.find(c => c.Id == this.selectedFolderId);
            while (node) {
                this.breadcrumbs.push(node);
                node = this.folders.find(c => c.Id == node.ParentId);
            };
        }
        this.breadcrumbs.push({
            Id: 0,
            Name: 'Thư mục gốc',
        });
        this.breadcrumbs = this.breadcrumbs.reverse();
    }
    private addChilds(node: TreeData) {
        if (node) {
            let childs = this.folders
                .filter(c => c.ParentId == node.id)
                .map(c => {
                    return {
                        id: c.Id,
                        text: c.Name,
                        children: [],
                        icon: 'fa fa-folder',
                        state: { opened: false },
                    }
                });
            if (childs && childs.length > 0) {
                childs.forEach((child: TreeData) => {
                    this.addChilds(child);
                });
                node.children = childs;
            }
        }
    }
}
