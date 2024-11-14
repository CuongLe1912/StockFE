import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppConfig } from '../helpers/app.config';
import { IpDto } from '../domains/objects/ip.dto';
import { ApiUrl } from '../helpers/api.url.helper';
import { KeyValue } from '../domains/data/key.value';
import { FileType } from '../domains/enums/file.type';
import { TableData } from '../domains/data/table.data';
import { ResultApi } from '../domains/data/result.api';
import { MethodType } from '../domains/enums/method.type';
import { CustomUploadData, UploadData } from '../domains/data/upload.data';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { AdminUserDto, AdminUserLoginDto, AdminUserProfileDto, AdminUserResetPasswordDto } from '../domains/objects/user.dto';

@Injectable()
export class AdminApiService {

    constructor(protected http: HttpClient) {
    }

    async ip() {
        return await this.http
            .get('//api.db-ip.com/v2/free/self')
            .toPromise()
            .then((c: any) => {
                return ResultApi.ToEntity(IpDto.ToEntity(c));
            })
            .catch(async e => {
                return await this.http
                    .get('//api.myip.com')
                    .toPromise()
                    .then((c: any) => {
                        return ResultApi.ToEntity(IpDto.ToEntity(c));
                    })
                    .catch(async e => {
                        return await this.http
                            .get('//ipinfo.io/json')
                            .toPromise()
                            .then((c: any) => {
                                return ResultApi.ToEntity(IpDto.ToEntity(c));
                            })
                            .catch(async e => {
                                return await this.http
                                    .get('//api.freegeoip.app/json/?apikey=907f3130-6a17-11ec-a766-9de3950ccc84')
                                    .toPromise()
                                    .then((c: any) => {
                                        return ResultApi.ToEntity(IpDto.ToEntity(c));
                                    })
                                    .catch(e => {
                                        return ResultApi.ToException(e);
                                    });
                            });
                    });
            });
    }

    export(obj?: TableData) {
        if (!obj) {
            obj = {
                Paging: {
                    Index: 1,
                    Size: 1000
                }
            };
        }
        const api = ApiUrl.ToUrl('/admin/' + obj.Name.toLowerCase() + '/export');
        return this.http.post(api, obj, this.getHeaders()).toPromise();
    }
    async save(objName: string, obj: any) {
        let method = obj.Id ? MethodType.Put : MethodType.Post;
        const api = ApiUrl.ToUrl('/admin/' + objName);

        if (obj) {
            delete obj.IsActive;
            delete obj.IsDelete;
            delete obj.CreatedBy;
            delete obj.UpdatedBy;
            delete obj.CreatedDate;
            delete obj.UpdatedDate;
        }
        return await this.ToResultApi(api, method, obj);
    }
    async item(objName: string, id: any) {
        const api = ApiUrl.ToUrl('/admin/' + objName + '/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async trash(objName: string, id: number) {
        const api = ApiUrl.ToUrl('/admin/' + objName + '/trash/' + id);
        return await this.ToResultApi(api, MethodType.Delete);
    }
    async items(obj?: TableData, url?: string) {
        if (!obj) {
            obj = {
                Paging: {
                    Index: 1,
                    Size: 100
                }
            };
        }
        if (!url)
            url = '/admin/' + obj.Name.toLowerCase() + '/items';
        if (obj && obj.Paging) delete obj.Paging.Pages;
        const api = ApiUrl.ToUrl(url);
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async active(objName: string, id: number) {
        const api = ApiUrl.ToUrl('/admin/' + objName + '/active/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async resetCache(objName: string) {
        const api = ApiUrl.ToUrl('/admin/' + objName + '/resetCache');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async delete(objName: string, id: number) {
        const api = ApiUrl.ToUrl('/admin/' + objName + '/' + id);
        return await this.ToResultApi(api, MethodType.Delete);
    }
    async trashVerify(objName: string, id: number) {
        const api = ApiUrl.ToUrl('/admin/' + objName + '/trashVerify/' + id);
        return await this.ToResultApi(api, MethodType.Delete);
    }
    async saveByUrl(url: string, method: MethodType, obj: any) {
        const api = ApiUrl.ToUrl(url);
        if (obj) {
            delete obj.IsActive;
            delete obj.IsDelete;
            delete obj.CreatedBy;
            delete obj.UpdatedBy;
            delete obj.CreatedDate;
            delete obj.UpdatedDate;
        }
        return await this.ToResultApi(api, method, obj);
    }
    async requestByUrl(url: string, method: MethodType = MethodType.Get, obj?: any) {
        const api = ApiUrl.ToUrl(url);
        return await this.ToResultApi(api, method, obj);
    }
    async exists(url: string, property: string, objId?: number, objExists?: any): Promise<ResultApi> {
        if (objExists) {
            if (url.indexOf('/') == 0)
                url = url.substr(1);
            let api = url.indexOf('/admin') >= 0
                ? ApiUrl.ToUrl(url)
                : ApiUrl.ToUrl('/admin/' + url);
            if (objId) api = api + '/' + objId;
            if (objExists && property)
                api = api + '?property=' + property;
            if (objExists) api = api + '&value=' + objExists;
            return await this.ToResultApi(api);
        } return ResultApi.ToFail('Tham số không đủ');
    }
    async callApi(controller: string, action: string, obj: any = null, method: MethodType = MethodType.Get) {
        let url = controller;
        if (action) url += '/' + action;
        const api = ApiUrl.ToUrl('/admin/' + url);
        return await this.ToResultApi(api, method, obj);
    }
    async callApiByUrl(url: string, obj: any = null, method: MethodType = MethodType.Get) {
        if (url && url[0] == '/')
            url = url.replace('/', '');
        const api = ApiUrl.ToUrl('/admin/' + url);
        return await this.ToResultApi(api, method, obj);
    }

    async lookupItem(url: string, value: any, key: string, columns?: string[]) {
        if (url.indexOf('/') == 0)
            url = url.substr(1);
        let api = url.indexOf('/admin') >= 0
            ? ApiUrl.ToUrl(url)
            : ApiUrl.ToUrl('/admin/' + url);
        if (key && api.indexOf('key') == -1)
            api = api + (api.indexOf('?') >= 0 ? '&' : '?') + "key=" + key;
        if (value && api.indexOf('value') == -1)
            api = api + (api.indexOf('?') >= 0 ? '&' : '?') + "value=" + value;
        if (columns && columns.length > 0 && api.indexOf('properties') == -1) {
            columns = _.cloneDeep(columns);
            if (columns.indexOf(key) == -1) columns.unshift(key);
            api = api + (api.indexOf('?') >= 0 ? '&' : '?') + "properties=" + columns.join(';');
        }
        return await this.ToResultApi(api, MethodType.Get);
    }
    async lookup(url: string, columns?: string[], by?: any, useQueryParms: boolean = false, search: string = null, pageIndex: number = 1, pageSize: number = 2000) {
        if (url.indexOf('/') == 0)
            url = url.substr(1);
        let api = url.indexOf('/admin') >= 0
            ? ApiUrl.ToUrl(url)
            : ApiUrl.ToUrl('/admin/' + url);
        if (by) api = api + (useQueryParms ? '?' : '/') + by;
        if (columns && columns.length > 0 && api.indexOf('properties') == -1)
            api = api + (api.indexOf('?') >= 0 ? '&' : '?') + "properties=" + columns.join(';');
        if (search) api = api + '&search=' + search;
        if (pageSize) api = api + '&pageSize=' + pageSize;
        if (pageIndex) api = api + '&pageIndex=' + pageIndex;
        return await this.ToResultApi(api, MethodType.Get);
    }
    async lookupDateTime(url: string, columns?: string[], by?: any, search: string = null, pageIndex: number = 1, pageSize: number = 2000) {
        if (url.indexOf('/') == 0)
            url = url.substr(1);
        let api = url.indexOf('/admin') >= 0
            ? ApiUrl.ToUrl(url)
            : ApiUrl.ToUrl('/admin/' + url);
        if (by) api = api + '/' + by;
        if (columns && columns.length > 0 && api.indexOf('properties') == -1)
            api = api + "?properties=" + columns.join(';');
        api = api + '&datetime=true';
        if (search) api = api + '&search=' + search;
        if (pageSize) api = api + '&pageSize=' + pageSize;
        if (pageIndex) api = api + '&pageIndex=' + pageIndex;
        return await this.ToResultApi(api, MethodType.Get);
    }

    async notifies(): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/notify/mynotifies');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async permissions(): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/permission/mypermissions');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async linkPermissions(): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/linkpermission');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async rolePermissions(roleId: number): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/rolePermission/permissions/' + roleId);
        return await this.ToResultApi(api, MethodType.Get);
    }

    async profile(id?: number): Promise<ResultApi> {
        const api = id
            ? ApiUrl.ToUrl('/admin/user/profile/' + id)
            : ApiUrl.ToUrl('/admin/user/profile');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async profileByEmail(email: string): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/user/profileByEmail?email=' + email);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async profileByMeeyId(meeyId: string): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/user/ProfileByMeeyId?meeyId=' + meeyId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async checkVerify(code: string): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/user/getprofilebyverifycode/' + code);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async signin(obj: AdminUserLoginDto): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/user/signin');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async validateAuthenticator(id, code): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/user/ValidateAuthenticator/' + id + '?code=' + code);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async verify(code: string, password): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/user/setpassword/' + code);
        let obj = {
            Password: password
        }
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async resetPassword(email: string): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/user/resetPassword');
        let obj = {
            Email: email,
        };
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async signout(obj: AdminUserLoginDto): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/user/signout');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async updateProfile(obj: AdminUserProfileDto): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/user/updateprofile');
        let param = {
            Phone: obj.Phone,
            Avatar: obj.Avatar,
            RefCode: obj.RefCode,
            Birthday: obj.Birthday,
            FullName: obj.FullName,
            ExtPhoneNumber: obj.ExtPhoneNumber,
        };
        return await this.ToResultApi(api, MethodType.Post, param);
    }
    async changePassword(obj: AdminUserResetPasswordDto): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/user/changePassword');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }

    async files(folderId: number): Promise<ResultApi> {
        if (!folderId) folderId = 0;
        const api = ApiUrl.ToUrl('/admin/file/allFiles/' + folderId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async searchFiles(search: string): Promise<ResultApi> {
        const api = ApiUrl.ToUrl('/admin/file/search?search=' + search);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async folders(folderId: number = null): Promise<ResultApi> {
        const api = folderId && folderId > 0
            ? ApiUrl.ToUrl('/admin/folder/allFolders/' + folderId)
            : ApiUrl.ToUrl('/admin/folder/allFolders');
        return await this.ToResultApi(api, MethodType.Get);
    }

    async upload(url: string, item: UploadData) {
        let fd = new FormData(),
            result: ResultApi = null,
            type = item.type == FileType.Image ? 'image' : 'file',
            api = ApiUrl.ToUrl(url);

        fd.append(type, item.data);
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200 || xhr.status == 201)
                    result = <ResultApi>JSON.parse(xhr.responseText);
                else result = ResultApi.ToException(xhr.responseText);
            }
        }
        if (item.processFunction) {
            xhr.onprogress = (e) => {
                const percent = Math.round((e.loaded / e.total) * 100);
                item.processFunction(percent);
            }
        }
        if (item.completeFunction) {
            xhr.onload = (e) => {
                item.completeFunction(result);
            }
        }
        if (item.failFunction) {
            xhr.onerror = (e) => {
                item.failFunction(e);
            }
        }
        if (item.cancelFunction) {
            xhr.onabort = (e) => {
                item.cancelFunction(e);
            }
        }
        xhr.open("POST", api, true);
        xhr.send(fd);
    }
    async uploadPercent(url: string, item: UploadData) {
        let fd = new FormData(),
            api = ApiUrl.ToUrl(url),
            type = item.type == FileType.Image ? 'image' : 'file';

        fd.append(type, item.data);

        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.getToken(),
        });

        return new Promise((resolve, reject) => {
            this.http.post(api, fd, {
                headers,
                observe: 'events',
                reportProgress: true,
            }).subscribe(resp => {
                if (resp.type === HttpEventType.Response) {
                    resolve(resp);
                }
                if (resp.type === HttpEventType.UploadProgress) {
                    const percentDone = Math.round(100 * resp.loaded / resp.total);
                    if (item.processFunction) {
                        item.processFunction(percentDone);
                    }
                }
            }, reject);
        }).then((c: any) => {
            return ResultApi.ToObject(c.body);
        }).catch(e => {
            return ResultApi.ToException(e);
        });
    }
    async moveCustomUpload(custom: CustomUploadData, resultUpload: any, type: FileType) {
        let params = {},
            api = AppConfig.MeeyMediaConfig.Api + '/v1/media/move';
        if (resultUpload) {
            if (resultUpload.files && resultUpload.files.length > 0) {
                params['files'] = [];
                resultUpload.files.forEach((item: any) => {
                    params['files'].push({
                        s3Key: item.s3Key
                    });
                });
            } else if (resultUpload.images && resultUpload.images.length > 0) {
                params['images'] = [];
                resultUpload.images.forEach((item: any) => {
                    params['images'].push({
                        s3Key: item.s3Key
                    });
                });
            } else if (resultUpload.videos && resultUpload.videos.length > 0) {
                params['videos'] = [];
                resultUpload.videos.forEach((item: any) => {
                    params['videos'].push({
                        s3Key: item.s3Key
                    });
                });
            } else if (Array.isArray(resultUpload)) {
                switch (type) {
                    case FileType.File: {
                        params['files'] = [];
                        resultUpload.forEach((item: any) => {
                            params['files'].push({
                                s3Key: item.s3Key
                            });
                        });
                    } break;
                    case FileType.Image: {
                        params['images'] = [];
                        resultUpload.forEach((item: any) => {
                            params['images'].push({
                                s3Key: item.s3Key
                            });
                        });
                    } break;
                    case FileType.Video: {
                        params['videos'] = [];
                        resultUpload.forEach((item: any) => {
                            params['videos'].push({
                                s3Key: item.s3Key
                            });
                        });
                    } break;
                }
            }
        }

        let headers = new HttpHeaders();
        if (custom.authorization) {
            if (custom.authorization.key) {
                let authen = Buffer.from(custom.authorization.key + ":" + custom.authorization.value).toString('base64');
                headers = new HttpHeaders({
                    'Authorization': 'Basic ' + authen,
                });
            } else {
                let authen = custom.authorization.value;
                headers = new HttpHeaders({
                    'Authorization': authen,
                });
            }
        }
        if (custom.headers && custom.headers.length > 0) {
            custom.headers.forEach((option: KeyValue) => {
                headers = headers.append(option.key, option.value);
            });
        }

        return new Promise((resolve, reject) => {
            this.http.patch(api, params, {
                headers,
                observe: 'events',
                reportProgress: true,
            }).subscribe(resp => {
                if (resp.type === HttpEventType.Response) {
                    resolve(resp);
                }
            }, reject);
        }).then((c: any) => {
            return ResultApi.ToObject(c.body);
        }).catch(e => {
            return ResultApi.ToException(e);
        });
    }
    async customUpload(custom: CustomUploadData, item: UploadData, keyValues: KeyValue[] = null, url: string = null) {
        let fd = new FormData(),
            api = url || custom.url;
        if (custom && custom.data && custom.data.length > 0) {
            custom.data.forEach((keyValue: KeyValue) => {
                switch (keyValue.value) {
                    case 'data': {
                        if (keyValue.key == 'files') {
                            switch (item.type) {
                                case FileType.File: fd.append('files', item.data); break;
                                case FileType.Image: fd.append('images', item.data); break;
                                case FileType.Video: fd.append('videos', item.data); break;
                            }
                        } else fd.append(keyValue.key, item.data);
                    } break;
                    case 'createdById': {
                        let json = sessionStorage.getItem(AppConfig.AccountTokenKey);
                        if (!json) json = localStorage.getItem(AppConfig.AccountTokenKey);
                        if (json) {
                            let account = <AdminUserDto>(JSON.parse(json));
                            if (account)
                                fd.append(keyValue.key, account.Id.toString());
                        }
                    } break;
                    case 'createdByName': {
                        let json = sessionStorage.getItem(AppConfig.AccountTokenKey);
                        if (!json) json = localStorage.getItem(AppConfig.AccountTokenKey);
                        if (json) {
                            let account = <AdminUserDto>(JSON.parse(json));
                            if (account)
                                fd.append(keyValue.key, account.FullName);
                        }
                    } break;
                    case 'createdByEmail': {
                        let json = sessionStorage.getItem(AppConfig.AccountTokenKey);
                        if (!json) json = localStorage.getItem(AppConfig.AccountTokenKey);
                        if (json) {
                            let account = <AdminUserDto>(JSON.parse(json));
                            if (account)
                                fd.append(keyValue.key, account.Email);
                        }
                    } break;
                    default: {
                        fd.append(keyValue.key, keyValue.value);
                    } break;
                }
            });
        }
        if (keyValues && keyValues.length > 0) {
            keyValues.forEach((keyValue: KeyValue) => {
                fd.append(keyValue.key, keyValue.value);
            });
        }

        let headers = new HttpHeaders();
        if (custom.authorization) {
            if (custom.authorization.key) {
                let authen = Buffer.from(custom.authorization.key + ":" + custom.authorization.value).toString('base64');
                headers = new HttpHeaders({
                    'Authorization': 'Basic ' + authen,
                });
            } else {
                let authen = custom.authorization.value;
                headers = new HttpHeaders({
                    'Authorization': authen,
                });
            }
        }
        if (custom.headers && custom.headers.length > 0) {
            custom.headers.forEach((option: KeyValue) => {
                headers = headers.append(option.key, option.value);
            });
        }

        if (custom.method == MethodType.Patch) {
            return new Promise((resolve, reject) => {
                this.http.patch(api, fd, {
                    headers,
                    observe: 'events',
                    reportProgress: true,
                }).subscribe(resp => {
                    if (resp.type === HttpEventType.Response) {
                        resolve(resp);
                    }
                    if (resp.type === HttpEventType.UploadProgress) {
                        const percentDone = Math.round(100 * resp.loaded / resp.total);
                        if (item.processFunction) {
                            item.processFunction(percentDone);
                        }
                    }
                }, reject);
            }).then((c: any) => {
                return ResultApi.ToObject(c.body);
            }).catch(e => {
                return ResultApi.ToException(e);
            });
        } else {
            return new Promise((resolve, reject) => {
                this.http.post(api, fd, {
                    headers,
                    observe: 'events',
                    reportProgress: true,
                }).subscribe(resp => {
                    if (resp.type === HttpEventType.Response) {
                        resolve(resp);
                    }
                    if (resp.type === HttpEventType.UploadProgress) {
                        const percentDone = Math.round(100 * resp.loaded / resp.total);
                        if (item.processFunction) {
                            item.processFunction(percentDone);
                        }
                    }
                }, reject);
            }).then((c: any) => {
                return ResultApi.ToObject(c.body);
            }).catch(e => {
                return ResultApi.ToException(e);
            });
        }
    }
    public downloadFileByUrl(url: string, obj?: any): Observable<HttpEvent<Blob>> {
        let token = this.getToken();
        const api = ApiUrl.ToUrl(url);
        return this.http.request(new HttpRequest('POST', api, obj,
            {
                headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
                responseType: 'blob',
                reportProgress: true,
            }));
    }
    public downloadFile(objName: string, obj?: TableData): Observable<HttpEvent<Blob>> {
        let token = this.getToken();
        const api = ApiUrl.ToUrl('/admin/' + objName.toLowerCase() + '/export');
        return this.http.request(new HttpRequest('POST', api, obj,
            {
                headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
                responseType: 'blob',
                reportProgress: true,
            }));
    }

    public getToken() {
        let json = sessionStorage.getItem(AppConfig.AccountTokenKey);
        if (!json) json = localStorage.getItem(AppConfig.AccountTokenKey);
        if (json) {
            let raw = JSON.parse(json);
            return raw && raw.Token;
        } return null;
    }
    private getHeaders() {
        let token = this.getToken();
        return token
            ? {
                headers: new HttpHeaders({
                    'Accept': 'application/json',
                    'RefererUrl': location.toString(),
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'Access-Control-Allow-Headers': 'Content-Type',
                })
            }
            : {
                headers: new HttpHeaders({
                    'Accept': 'application/json',
                    'RefererUrl': location.toString(),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type',
                })
            };
    }
    protected getCurentUserId() {
        let json = sessionStorage.getItem(AppConfig.AccountTokenKey);
        if (!json) json = localStorage.getItem(AppConfig.AccountTokenKey);
        if (json) {
            let account = <AdminUserDto>(JSON.parse(json));
            return account && account.Id;
        } return 0;
    }
    protected getCurentUserFullName() {
        let json = sessionStorage.getItem(AppConfig.AccountTokenKey);
        if (!json) json = localStorage.getItem(AppConfig.AccountTokenKey);
        if (json) {
            let account = <AdminUserDto>(JSON.parse(json));
            return account && account.FullName;
        } return '';
    }
    protected async ToResultApi(api: string, type: MethodType = MethodType.Get, params: any = null, headers: any = null): Promise<ResultApi> {
        headers = headers || this.getHeaders();
        switch (type) {
            case MethodType.Get: {
                return await this.http
                    .get(api, headers)
                    .toPromise()
                    .then(c => { return ResultApi.ToObject(c); })
                    .catch(e => {
                        return ResultApi.ToException(e);
                    });
            }
            case MethodType.Put: {
                return await this.http
                    .put(api, params, headers)
                    .toPromise()
                    .then(c => { return ResultApi.ToObject(c); })
                    .catch(e => {
                        return ResultApi.ToException(e);
                    });
            }
            case MethodType.Post: {
                return await this.http
                    .post(api, params, headers)
                    .toPromise()
                    .then(c => { return ResultApi.ToObject(c); })
                    .catch(e => {
                        return ResultApi.ToException(e);
                    });
            }
            case MethodType.Delete: {
                return await this.http
                    .delete(api, headers)
                    .toPromise()
                    .then(c => ResultApi.ToObject(c))
                    .catch(e => {
                        return ResultApi.ToException(e);
                    });
            }
        }
    }
}
