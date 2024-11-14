import { ResultType } from '../enums/result.type';

export class ResultApi {
    public Object: any;
    public Total?: number;
    public Type: ResultType;
    public ObjectExtra?: any;
    public Description: string;
    public ObjectStatistical?: any;

    public constructor(type?: ResultType, object?: any, description?: string) {
        this.Object = object || null;
        this.Description = description || '';
        this.Type = type || ResultType.Success;
    }

    public static IsSuccess(result: any) {
        if (result) {
            let type = result.Type || result.type;
            return type == ResultType.Success;
        }
        return false;
    }

    public static ToObject(item: any): ResultApi {
        if (item) {
            if (item.Type != undefined && item.Type != null) 
                return item;
            return {
                Total: item.Total || item.total,
                Description: item.Description || item.description,
                ObjectExtra: item.ObjectExtra || item.objectExtra,
                Type: item.Type || item.type || ResultType.Success,
                Object: item.Object != null ? item.Object : item.object != null ? item.object : item,
            };
        }
        return new ResultApi();
    }

    public static ToEntity(item?: any, extra?: any, total?: number): ResultApi {
        if (item != null) {
            const entity: ResultApi = {
                Total: total,
                Object: item,
                Description: '',
                ObjectExtra: extra,
                Type: ResultType.Success,
            };
            return entity;
        } else {
            const entity: ResultApi = {
                Object: null,
                Description: '',
                Type: ResultType.Success,
            };
            return entity;
        }
    }

    public static ToFail(error: string, obj?: any): ResultApi {
        const result: ResultApi = {
            Object: obj,
            Description: error,
            Type: ResultType.Fail,
        };
        return result;
    }

    public static ToException(error: any): ResultApi {
        let description: string;
        if (error && error.status == 0)
            description = 'Kết nối hệ thống bị gián đoạn, vui lòng thử lại sau';

        const result: ResultApi = {
            Object: error,
            Type: ResultType.Exception,
            Description: description || error,
        };
        return result;
    }

    public static ToExceptionMissToken(): ResultApi {
        const result: ResultApi = {
            Object: null,
            Type: ResultType.Exception,
            Description: 'Bạn không có quyền truy cập thông tin này',
        };
        return result;
    }
}
