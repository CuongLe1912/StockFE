import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { AdminUserUpdateDto } from '../../../_core/domains/objects/user.dto';

@Injectable()
export class UserService extends AdminApiService {
    async unLockUser(id: number) {
        const api = ApiUrl.ToUrl('/admin/user/unlock/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async allUsers() {
        let api = ApiUrl.ToUrl('/admin/user/allusers');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async allDistricts(userId: number) {
        let api = userId 
            ? ApiUrl.ToUrl('/admin/district/alldistricts/' + userId)
            : ApiUrl.ToUrl('/admin/district/alldistricts');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async adminResetPassword(id: number) {
        const api = ApiUrl.ToUrl('/admin/user/sendverifycode/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async allUsersByRoleId(roleId: number) {
        let api = ApiUrl.ToUrl('/admin/user/allUsersByRoleId/' + roleId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async allUsersByTeamId(teamId: number) {
        let api = ApiUrl.ToUrl('/admin/user/allUsersByTeamId/' + teamId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async allUsersByProductId(productId: number) {
        let api = ApiUrl.ToUrl('/admin/user/allUsersByProductId/' + productId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async lockUser(id: number, reason: string) {
        const api = ApiUrl.ToUrl('/admin/user/lock/' + id);
        let obj = {
            ReasonLock: reason
        };
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async addOrUpdate(item: AdminUserUpdateDto) {
        delete item.Id;
        delete item.Status;
        delete item.TeamOrganizationId;
        delete item.RoleOrganizationId;
        const api = ApiUrl.ToUrl('/admin/user/');        
        return await this.ToResultApi(api, MethodType.Put, item);
    }
    async allUsersByPositionId(positionId: number) {
        let api = ApiUrl.ToUrl('/admin/user/allUsersByPositionId/' + positionId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async allUsersByDepartmentId(departmentId: number) {
        let api = ApiUrl.ToUrl('/admin/user/allUsersByDepartmentId/' + departmentId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async allRoles(userId: number, organizationIds?: number[]) {
        let api = userId 
            ? ApiUrl.ToUrl('/admin/role/allroles/' + userId)
            : ApiUrl.ToUrl('/admin/role/allroles');
        if (organizationIds)
            api += '?organizationIds=' + organizationIds;
        return await this.ToResultApi(api, MethodType.Get);
    }
    async allTeams(userId: number, organizationIds?: number[]) {
        let api = userId 
            ? ApiUrl.ToUrl('/admin/team/allteams/' + userId)
            : ApiUrl.ToUrl('/admin/team/allteams');
        if (organizationIds)
            api += '?organizationIds=' + organizationIds;
        return await this.ToResultApi(api, MethodType.Get);
    }
    async allProducts(userId: number) {
        let api = userId 
            ? ApiUrl.ToUrl('/admin/product/allproducts/' + userId)
            : ApiUrl.ToUrl('/admin/product/allproducts');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async allPermissions(userId: number, roleIds: number[], organizationIds?: number[]) {
        let api = userId 
            ? ApiUrl.ToUrl('/admin/permission/allpermissions/' + userId)
            : ApiUrl.ToUrl('/admin/permission/allpermissions');
        if (roleIds && roleIds.length > 0)
            api += '?roleIds=' + roleIds;
        if (organizationIds)
            api += api.indexOf('?') >= 0
                ? '&organizationIds=' + organizationIds
                : '?organizationIds=' + organizationIds;
        return await this.ToResultApi(api, MethodType.Get);
    }
    async generateAuthenticator(userId: number) {
        let api = ApiUrl.ToUrl('/admin/user/GenerateAuthenticator/' + userId);
        return await this.ToResultApi(api, MethodType.Post);
    }
}