import { Injectable } from '@angular/core';
import { ApiUrl } from '../../_core/helpers/api.url.helper';
import { ResultApi } from '../../_core/domains/data/result.api';
import { TableData } from '../../_core/domains/data/table.data';
import { FilterData } from '../../_core/domains/data/filter.data';
import { PagingData } from '../../_core/domains/data/paging.data';
import { UploadData } from '../../_core/domains/data/upload.data';
import { HttpEventType, HttpHeaders } from '@angular/common/http';
import { MethodType } from '../../_core/domains/enums/method.type';
import { UtilityExHelper } from '../../_core/helpers/utility.helper';
import { AdminApiService } from '../../_core/services/admin.api.service';
import { MPOAvatarType } from '../../_core/domains/entities/meeyproject/enums/mpo.avatar.type';
import { MPOProjectTypeEntity } from '../../_core/domains/entities/meeyproject/mpo.project.type.entity';
import { MPOProjectVideosEntity } from '../../_core/domains/entities/meeyproject/mpo.project.video.entity';
import { MPOProjectCategoryEntity } from '../../_core/domains/entities/meeyproject/mpo.project.category.entity';
import { MPOProjectInvestorEntity } from '../../_core/domains/entities/meeyproject/mpo.project.investor.entity';
import { MPOProjectDocumentEntity } from '../../_core/domains/entities/meeyproject/project.verify.document.entity';
import { MPOProjectViolationTypeEntity } from '../../_core/domains/entities/meeyproject/project.violation.type.entity';
import { MPOProjectEntity, MPOProjectInvestorRelatedEntity, MPOProjectInvestorUnitEntity, MPOProjectItemEntity } from '../../_core/domains/entities/meeyproject/mpo.project.entity';

@Injectable()
export class MPOProjectService extends AdminApiService {

    async publish(id: string) {
        const api = ApiUrl.ToUrl('/admin/mpoproject/Publish/' + id);
        return await this.ToResultApi(api, MethodType.Put);
    }
    async unpublish(id: string) {
        const api = ApiUrl.ToUrl('/admin/mpoproject/UnPublish/' + id);
        return await this.ToResultApi(api, MethodType.Put);
    }
    async getProject(id: string) {
        const api = ApiUrl.ToUrl('/admin/mpoproject/item/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async checkPublish(id: string) {
        const api = ApiUrl.ToUrl('/admin/mpoproject/checkPublish/' + id);
        return await this.ToResultApi(api, MethodType.Put);
    }
    async selectProject(id: string) {
        const api = ApiUrl.ToUrl('/admin/mpoproject/SelectMeeyProject/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async addNew(param) {
        param.createdBy =
        {
            data: {
                _id: this.getCurentUserId(),
                fullname: this.getCurentUserFullName(),
            },
            source: 'admin'
        }
        const api = ApiUrl.ToUrl('/admin/mpoproject/addnew');
        return await this.ToResultApi(api, MethodType.Post, param);
    }
    async lookupAddress(lat: number, lng: number) {
        const api = ApiUrl.ToUrl('/admin/mpoproject/LookupAddress?lat=' + lat + '&lng=' + lng);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async updateInformation(obj, id) {
        obj.updatedBy =
        {
            data: {
                _id: this.getCurentUserId(),
                fullname: this.getCurentUserFullName(),
            },
            source: 'admin'
        }
        const api = ApiUrl.ToUrl('/admin/mpoproject/updateInformation/' + id);
        return await this.ToResultApi(api, MethodType.Put, obj);
    }
    async addOrUpdateVideo(id: string, obj: MPOProjectVideosEntity) {
        const api = ApiUrl.ToUrl('/admin/mpoproject/addOrUpdateVideo');
        if (!obj.Image.type) {
            obj.Image.type = obj.Type == MPOAvatarType.FromVideo
                ? 'default'
                : 'upload';
        }
        let params = {
            createdBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            },
            video: obj.Video,
            title: obj.Title,
            avatar: obj.Image,
            publishedType: 'now',
            // topic: obj.CategoryId,
            project: obj.VideoProjectId,
            description: obj.Description,
            descriptionFormat: obj.DescriptionEditor,
        };

        if (obj.Tags) {
            if (obj.Tags.indexOf(',') > 0) {
                params['hashtags'] = obj.Tags.split(',');
            } else
                params['hashtags'] = [obj.Tags];
        }
        return await this.ToResultApi(api, MethodType.Put, params);
    }

    async checkExists(name: string, cityId: string, districtId: string, wardId: string) {
        const api = ApiUrl.ToUrl('/admin/mpoproject/CheckExists');
        let params = {
            Name: name,
            WardId: wardId,
            CityId: cityId,
            DistrictId: districtId
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async checkExistsAbs(name: string, tradeName: string, cityId: string, districtId: string, wardId: string, excludeId: string) {
        const api = ApiUrl.ToUrl('/admin/mpoproject/CheckExistsAbs');
        let params = {
            Name: name,
            TradeName: tradeName,
            WardId: wardId,
            CityId: cityId,
            ExcludeId: excludeId,
            DistrictId: districtId,
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }

    async getProjectType(id: string) {
        const api = ApiUrl.ToUrl('/admin/mpoprojecttype/item/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async addOrUpdateProjectType(obj: MPOProjectTypeEntity) {
        const api = ApiUrl.ToUrl('/admin/mpoprojecttype/addOrUpdate');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }

    async getProjectCategory(id: string) {
        const api = ApiUrl.ToUrl('/admin/mpoprojectcategory/item/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async addOrUpdateProjectCategory(obj: MPOProjectCategoryEntity) {
        const api = ApiUrl.ToUrl('/admin/mpoprojectcategory/addOrUpdate');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }

    async getProjectInvestor(id: string) {
        const api = ApiUrl.ToUrl('/admin/mpoprojectInvestor/item/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async addOrUpdateProjectInvestor(obj: MPOProjectInvestorEntity) {
        const api = ApiUrl.ToUrl('/admin/mpoprojectInvestor/addOrUpdate');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async uploadVideo(obj: MPOProjectVideosEntity, item: UploadData, url) {
        let fd = new FormData();
        fd.append('video', obj.Video);
        fd.append('title', obj.Title);
        fd.append('avatar', obj.Image);
        fd.append('hashtags[]', obj.Tags);
        fd.append('topic', obj.CategoryId);
        fd.append('project', obj.ProjectId);
        fd.append('description', obj.Description);

        const headers = new HttpHeaders({

        });
        return new Promise((resolve, reject) => {
            this.http.post(url, fd, {
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

    async getItemImages(projectId: string, page = 1, limit = 50, search: string = null) {
        let url = '/admin/mpoproject/images/' + projectId + '?page=' + page + '&limit=' + limit;
        if (search) url += '&search=' + search;
        const api = ApiUrl.ToUrl(url);
        return await this.ToResultApi(api, MethodType.Get);
    }

    async updateItemImages(projectMeeyId, item: any) {
        let params = {
            "title": item.title,
            updatedBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            },
        };
        const api = ApiUrl.ToUrl('/admin/mpoproject/project/' + projectMeeyId + '/image/' + item._id);
        return await this.ToResultApi(api, MethodType.Put, params);
    }

    async deleteItemImages(projectMeeyId: string, id) {
        let params = {
            deletedBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            },
        };
        const api = ApiUrl.ToUrl('/admin/mpoproject/project/' + projectMeeyId + '/deleteimage/' + id);
        return await this.ToResultApi(api, MethodType.Post, params);
    }

    async uploadItemImages(id: string, obj: MPOProjectItemEntity) {
        let params = {
            images: obj.Images?.length > 0 ? obj.Images : null,
            createdBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            },
        };
        const api = ApiUrl.ToUrl('/admin/mpoproject/uploadImage/' + id);
        return await this.ToResultApi(api, MethodType.Post, params);
    }

    async uploadItemFiles(id: string, obj: MPOProjectItemEntity) {
        let params = {
            files: obj.Files?.length > 0 ? obj.Files : null,
            createdBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            },
        };
        const api = ApiUrl.ToUrl('/admin/mpoproject/uploadFiles/' + id);
        return await this.ToResultApi(api, MethodType.Post, params);
    }

    async updateItemFiles(projectMeeyId: string, item: any) {
        let params = {
            "title": item.title,
            updatedBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            },
        };
        const api = ApiUrl.ToUrl('/admin/mpoproject/project/' + projectMeeyId + '/file/' + item.id);
        return await this.ToResultApi(api, MethodType.Put, params);
    }

    async deleteItemFile(projectMeeyId: string, id: string) {
        let params = {
            deletedBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            },
        };
        const api = ApiUrl.ToUrl('/admin/mpoproject/project/' + projectMeeyId + '/deleteFile/' + id);
        return await this.ToResultApi(api, MethodType.Post, params);
    }

    async addOrUpdateViolationType(obj: MPOProjectViolationTypeEntity) {
        const api = ApiUrl.ToUrl('/admin/MPOProjectViolationType/addOrUpdate');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }

    async addOrUpdateVerifyDocument(obj: MPOProjectDocumentEntity) {
        const api = ApiUrl.ToUrl('/admin/MPOProjectDocument/addOrUpdate');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }

    async updateSalePolicy(projectMeeyId: string, obj: MPOProjectItemEntity) {
        let params = {
            description: UtilityExHelper.innerTextHtml(obj.Content),
            descriptionFormat: obj.Content,
            files: obj.Files?.length > 0 ? obj.Files : null,
            images: obj.Images?.length > 0 ? obj.Images : null,
            updatedBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            },
        };
        const api = ApiUrl.ToUrl('/admin/mpoproject/UpdateSalePolicy/' + projectMeeyId);
        return await this.ToResultApi(api, MethodType.Put, params);
    }

    async updateConstruction(projectMeeyId: string, obj: MPOProjectItemEntity) {
        let params = {
            description: UtilityExHelper.innerTextHtml(obj.Content),
            descriptionFormat: obj.Content,
            images: obj.Images?.length > 0 ? obj.Images : null,
            updatedBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            },
        };
        const api = ApiUrl.ToUrl('/admin/mpoproject/UpdateConstruction/' + projectMeeyId);
        return await this.ToResultApi(api, MethodType.Put, params);
    }

    async updateInvestorRelated(projectMeeyId: string, obj: MPOProjectInvestorRelatedEntity) {
        let params = {
            investor: obj.Id,
            description: obj.Description,
            logo: obj.Logo ? obj.Logo : null,
            // bank: obj.Bank,
            // constructionUnit: obj.ConstructionUnit,
            // operatingUnit: obj.OperatingUnit,
            // distributionUnit: obj.DistributionUnit,
            updatedBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            },
        };
        const api = ApiUrl.ToUrl('/admin/mpoproject/UpdateInvestorRelated/' + projectMeeyId);
        return await this.ToResultApi(api, MethodType.Put, params);
    }

    async updatePaymentProgress(projectMeeyId: string, obj: MPOProjectItemEntity) {
        let params = {
            progress: UtilityExHelper.innerTextHtml(obj.PaymentProgress),
            progressFormat: obj.PaymentProgress,
            description: UtilityExHelper.innerTextHtml(obj.Content),
            descriptionFormat: obj.Content,
            images: obj.Images?.length > 0 ? obj.Images : null,
            updatedBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            },
        };
        const api = ApiUrl.ToUrl('/admin/mpoproject/UpdatePaymentProgress/' + projectMeeyId);
        return await this.ToResultApi(api, MethodType.Put, params);
    }

    async updateUtilities(id: string, obj: MPOProjectItemEntity[]) {
        let params: any = {
            updatedBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            }
        };
        const api = ApiUrl.ToUrl('/admin/mpoproject/UpdateUtilities/' + id);

        let basic = obj.find(c => c.Type == 'basic');
        if (basic) {
            let utilities = basic.Utilities ? basic.Utilities.split(';') : [];
            params.basicUtilities = utilities;
            params.basicDescription = UtilityExHelper.innerTextHtml(basic.Content);
            params.basicDescriptionFormat = basic.Content;
            params.basicImages = basic.Images?.length > 0 ? basic.Images : null;
        }

        let outstanding = obj.find(c => c.Type == 'outstanding');
        if (outstanding) {
            let utilities = outstanding.Utilities ? outstanding.Utilities.split(';') : [];
            params.outstandingUtilities = utilities;
            params.outstandingDescription = UtilityExHelper.innerTextHtml(outstanding.Content);
            params.outstandingDescriptionFormat = outstanding.Content;
            params.outstandingImages = outstanding.Images?.length > 0 ? outstanding.Images : null;
        }

        return await this.ToResultApi(api, MethodType.Put, params);
    }

    async getItemVideosByCustomer(id: string, page: PagingData = { Index: 1, Size: 50 }, search: string = null) {
        let itemData = new TableData();
        itemData.Paging = page;
        let url = '/admin/MPOCustomer/VideoItems/' + id;
        if (search) itemData.Search = search;
        const api = ApiUrl.ToUrl(url);
        return await this.ToResultApi(api, MethodType.Post, itemData);
    }

    async getItemVideosByProject(id: string, page: PagingData = { Index: 1, Size: 50 }, search: string = null, type: string) {
        let itemData = new TableData();
        itemData.Paging = page;
        let url = '/admin/MPOProject/VideoItems/' + id + '?type=' + type;
        if (search) itemData.Search = search;
        const api = ApiUrl.ToUrl(url);
        return await this.ToResultApi(api, MethodType.Post, itemData);
    }

    async getAllProjectVideos(page: PagingData = { Index: 1, Size: 50 }, search: string = null, isLive: boolean = null) {
        let itemData = new TableData();
        itemData.Paging = page;
        itemData.Paging.Pages = 0;
        let url = '/admin/MPOProjectVideos/Items';
        if (search) itemData.Search = search;
        if (isLive != null) {
            if (!itemData.Filters) itemData.Filters = [];
            itemData.Filters.push({ Name: "IsLive", Value: isLive })
        }
        const api = ApiUrl.ToUrl(url);
        return await this.ToResultApi(api, MethodType.Post, itemData);
    }

    async getAllProjectVideos2(page: PagingData = { Index: 1, Size: 50 }, filters: FilterData[] = null) {
        let itemData = new TableData();
        itemData.Paging = page;
        itemData.Paging.Pages = 0;
        let url = '/admin/MPOProjectVideos/Items';
        if (filters) itemData.Filters = filters;
        const api = ApiUrl.ToUrl(url);
        return await this.ToResultApi(api, MethodType.Post, itemData);
    }

    async unpublishVideo(id: string) {
        let params = {
            updatedBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            },
        };
        const api = ApiUrl.ToUrl('/admin/MPOProjectVideos/Unpublish/' + id);
        return await this.ToResultApi(api, MethodType.Post, params);
    }

    async stopVideo(id: string) {
        let params = {
            updatedBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            },
        };
        const api = ApiUrl.ToUrl('/admin/MPOProjectVideos/StopVideo/' + id);
        return await this.ToResultApi(api, MethodType.Post, params);
    }

    async createInvestorUnit(item: MPOProjectInvestorUnitEntity) {
        let params = {
            name: item.Name,
            logo: item.Logo,
            isActive: item.Active,
            relatedUnitType: item.Unit,
            description: item.Description,
            createdBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            },
        };
        const api = ApiUrl.ToUrl('/admin/MPOProjectInvestorUnit/AddRelatedUnit');
        return await this.ToResultApi(api, MethodType.Post, params);
    }

    async updateInvestorUnit(item: MPOProjectInvestorUnitEntity) {
        let params = {
            name: item.Name,
            relatedUnitType: item.Unit,
            logo: item.Logo,
            isActive: item.Active,
            description: item.Description ?? "",
            updatedBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            },
        };
        const api = ApiUrl.ToUrl('/admin/MPOProjectInvestorUnit/UpdateRelatedUnit/' + item.Id);
        return await this.ToResultApi(api, MethodType.Put, params);
    }

    async createInvestorUnitType(item: MPOProjectInvestorUnitEntity) {
        let params = {
            name: item.UnitName,
            description: item.Description,
            isActive: item.Active,
            createdBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            },
        };
        const api = ApiUrl.ToUrl('/admin/mpoprojectInvestor/AddInvestorUnitType');
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async videoFeature() {
        const api = ApiUrl.ToUrl('/admin/MPOProjectSlideVideos/VideoFeature');
        return await this.ToResultApi(api, MethodType.Get);

    }
    async updateVideoFeature(items: any) {
        const api = ApiUrl.ToUrl('/admin/MPOProjectSlideVideos/UpdateVideoFeature');
        return await this.ToResultApi(api, MethodType.Post, items);
    }

    async checkExistsProject(projectId: string){
        const api = ApiUrl.ToUrl('/admin/mpoproject/CheckExistProject/' + projectId)
        return await this.ToResultApi(api, MethodType.Get);
    }
    async deleteProject(projectId: string){
        let params = {
            deletedBy : {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            },
        };
        const api = ApiUrl.ToUrl('/admin/mpoproject/DeleteProject/' + projectId)
        return await this.ToResultApi(api, MethodType.Post, params);
    }
}