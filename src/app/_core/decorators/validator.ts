declare var $;
import * as _ from 'lodash';
import { ImageEx } from './image.decorator';
import { ObjectEx } from "./object.decorator";
import { StringEx } from "./string.decorator";
import { NumberEx } from "./number.decorator";
import { AppInjector } from "../../app.module";
import { ResultApi } from "../domains/data/result.api";
import { ToastrHelper } from "../helpers/toastr.helper";
import { UtilityExHelper } from "../helpers/utility.helper";
import { PatternType } from "../domains/enums/pattern.type";
import { DecoratorHelper } from "../helpers/decorator.helper";
import { LookupUniqueData } from "../domains/data/lookup.data";
import { AdminApiService } from "../services/admin.api.service";
import { DateTimeEx, DateTimeFormat } from "./datetime.decorator";
import { AdminEventService } from "../services/admin.event.service";
import { DataType, DateTimeType, NumberType, StringType } from "../domains/enums/data.type";

export class Validator {
    pattern: any;
    message?: string;
    unique?: LookupUniqueData;
}

export async function validations(targets: any[], columns?: string[], disableEmit: boolean = false, multiple: boolean = false): Promise<boolean> {
    if (!targets || targets.length == 0)
        return true;
    let validator = true;
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        let valid = await validation(target, columns, disableEmit, i, multiple);
        if (!valid) {
            validator = valid;
            if (!multiple)
                break;
        }
    }
    return validator;
}

export async function validation(target: any, columns?: string[], disableEmit: boolean = false, index: number = null, multiple: boolean = false): Promise<boolean> {
    if (!target) return true;
    function matchPattern(value: string, pattern: any) {
        return pattern && pattern.test(String(value).toLowerCase());
    }

    let valid: boolean = true;
    let service = AppInjector.get(AdminApiService);
    let eventService = AppInjector.get(AdminEventService);
    eventService.ResetValidate.emit();
    let decorators = DecoratorHelper.decoratorProperties(target, false);
    if (decorators) {
        decorators = _.cloneDeep(decorators);
        for (let i = 0; i < decorators.length; i++) {
            let decorator: ObjectEx = decorators[i]; decorator.error = null; decorator.index = index;
            if (!disableEmit) eventService.Validate.emit(decorator);
            let needValid: boolean = true;
            if (columns && columns.length > 0) {
                let column = columns.find(c => c == decorator.property);
                if (!column) needValid = false;
            }
            if (!needValid) continue;

            if (multiple) decorator.targetObject = JSON.stringify(target);
            let value = target[decorator.property],
                vaildProperty: boolean = true;
            if (decorator.required) {
                if (decorator.dataType == DataType.DropDown) {
                    if (value == undefined || value == null || value === '') {
                        vaildProperty = false;
                        if (eventService) {
                            let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Required);
                            decorator.error = (validator && validator.message) || (decorator.label + ' không được rỗng');
                            if (!disableEmit) eventService.Validate.emit(decorator);
                        }
                    }
                } else if (decorator.dataType == DataType.Image) {
                    if (value == undefined || value == null || value === '' || value.length == 0) {
                        vaildProperty = false;
                        if (eventService) {
                            let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Required);
                            decorator.error = (validator && validator.message) || (decorator.label + ' không được rỗng');
                            if (!disableEmit) eventService.Validate.emit(decorator);
                        }
                    }
                } else if (decorator.dataType == DataType.File) {
                    if (value == undefined || value == null || value === '' || value.length == 0) {
                        vaildProperty = false;
                        if (eventService) {
                            let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Required);
                            decorator.error = (validator && validator.message) || (decorator.label + ' không được rỗng');
                            if (!disableEmit) eventService.Validate.emit(decorator);
                        }
                    }
                } else if (decorator.dataType == DataType.Video) {
                    if (value == undefined || value == null || value === '' || value.length == 0) {
                        vaildProperty = false;
                        if (eventService) {
                            let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Required);
                            decorator.error = (validator && validator.message) || (decorator.label + ' không được rỗng');
                            if (!disableEmit) eventService.Validate.emit(decorator);
                        }
                    }
                } else if (decorator.dataType == DataType.Number) {
                    if (value == undefined || value == null || value === '') {
                        vaildProperty = false;
                        if (eventService) {
                            let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Required);
                            decorator.error = (validator && validator.message) || (decorator.label + ' không được rỗng');
                            if (!disableEmit) eventService.Validate.emit(decorator);
                        }
                    }
                } else if (decorator.dataType == DataType.Boolean) {
                    if (value == undefined || value == null || value === '') {
                        vaildProperty = false;
                        if (eventService) {
                            let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Required);
                            decorator.error = (validator && validator.message) || (decorator.label + ' không được rỗng');
                            if (!disableEmit) eventService.Validate.emit(decorator);
                        }
                    }
                } else {
                    if (!value) {
                        vaildProperty = false;
                        if (eventService) {
                            let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Required);
                            decorator.error = (validator && validator.message) || (decorator.label + ' không được rỗng');
                            if (!disableEmit) eventService.Validate.emit(decorator);
                        }
                    }
                }
            }
            if (value) {
                if (vaildProperty) {
                    let allowCheck = true;
                    if (decorator.dataType == DataType.String) {
                        let decoratorString: StringEx = decorator;
                        if (decoratorString.type == StringType.TagEmail) {
                            allowCheck = false;
                            let validator = decorator.validators && decorator.validators.find(c => c.pattern && typeof c.pattern != 'string');
                            if (validator) {
                                const array = value && value.split(decoratorString.delimiters);
                                for (let i = 0; i < array.length; i++) {
                                    const item = array[i];
                                    if (vaildProperty) {
                                        vaildProperty = matchPattern(item, validator.pattern);
                                        if (!vaildProperty && eventService) {
                                            decorator.error = (validator && validator.message) || (decorator.label + ' không đúng định dạng');
                                            if (!disableEmit) eventService.Validate.emit(decorator);
                                            break;
                                        }
                                    }
                                }
                            }
                        } else if (decoratorString.type == StringType.Tag) {
                            // check max length
                            const array = value && value.split(decoratorString.delimiters);
                            for (let i = 0; i < array.length; i++) {
                                const item = array[i];
                                if (item.length > decoratorString.max) {
                                    vaildProperty = false;
                                    if (!vaildProperty && eventService) {
                                        decorator.error = decorator.label + ' không đúng định dạng, số ký tự không phù hợp';
                                        if (!disableEmit) eventService.Validate.emit(decorator);
                                        break;
                                    }
                                }
                            }

                            // check required #
                            if (decoratorString.requiredHashTag) {
                                for (let i = 0; i < array.length; i++) {
                                    const item = array[i];
                                    vaildProperty = item.indexOf('#') == 0;
                                    if (!vaildProperty && eventService) {
                                        decorator.error = decorator.label + ' không đúng định dạng, ký tự đầu tiên phải bắt đầu bằng [#]';
                                        if (!disableEmit) eventService.Validate.emit(decorator);
                                        break;
                                    }
                                }
                            }

                            // check match
                            allowCheck = false;
                            let validator = decorator.validators && decorator.validators.find(c => c.pattern && typeof c.pattern != 'string');
                            if (validator) {
                                for (let i = 0; i < array.length; i++) {
                                    const item = array[i];
                                    if (vaildProperty) {
                                        vaildProperty = matchPattern(item, validator.pattern);
                                        if (!vaildProperty && eventService) {
                                            decorator.error = (validator && validator.message) || (decorator.label + ' không đúng định dạng');
                                            if (!disableEmit) eventService.Validate.emit(decorator);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (allowCheck && vaildProperty) {
                        let validator = decorator.validators && decorator.validators.find(c => c.pattern && typeof c.pattern != 'string');
                        if (validator) {
                            vaildProperty = matchPattern(value, validator.pattern);
                            if (!vaildProperty && eventService) {
                                decorator.error = (validator && validator.message) || (decorator.label + ' không đúng định dạng');
                                if (!disableEmit) eventService.Validate.emit(decorator);
                            }
                        }
                    }
                }
                if (vaildProperty) {
                    if (decorator.dataType == DataType.String) {
                        let decoratorString: StringEx = decorator;
                        if (decoratorString.type != StringType.TagEmail && decoratorString.type != StringType.Tag) {
                            if (vaildProperty) {
                                let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Max);
                                if (validator) {
                                    if (decoratorString.type == StringType.Html) {
                                        length = value ? UtilityExHelper.lengthHtml(value) : 0;
                                    } else length = value ? value.trim().length : 0;
                                    vaildProperty = length <= decoratorString.max;
                                    if (!vaildProperty && eventService) {
                                        decorator.error = (validator && validator.message) || (decorator.label + ' độ dài tối đa là ' + decoratorString.max + ' ký tự');
                                        if (!disableEmit) eventService.Validate.emit(decorator);
                                    }
                                }
                            }
                            if (vaildProperty) {
                                let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Min);
                                if (validator) {
                                    let length = 0;
                                    if (decoratorString.type == StringType.Html) {
                                        length = value ? UtilityExHelper.lengthHtml(value) : 0;
                                    } else length = value ? value.trim().length : 0;
                                    vaildProperty = length >= decoratorString.min;
                                    if (!vaildProperty && eventService) {
                                        decorator.error = (validator && validator.message) || (decorator.label + ' phải có tối thiểu là ' + decoratorString.min + ' ký tự');
                                        if (!disableEmit) eventService.Validate.emit(decorator);
                                    }
                                }
                            }
                            if (vaildProperty) {
                                let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.RequiredMatch);
                                if (validator) {
                                    let valueMatch = target[decoratorString.requiredMatch];
                                    vaildProperty = valueMatch == value;
                                    if (!vaildProperty && eventService) {
                                        decorator.error = (validator && validator.message) || (decorator.label + ' không trùng với ' + decoratorString.requiredMatch);
                                        if (!disableEmit) eventService.Validate.emit(decorator);
                                    }
                                }
                            }
                            if (vaildProperty) {
                                let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.CardCvc);
                                if (validator) {
                                    let $element = <any>$('#' + decorator.id);
                                    if ($element && $element.length > 0) {
                                        vaildProperty = (<any>$).payment.validateCardNumber(value);
                                        if (!vaildProperty && eventService) {
                                            decorator.error = (validator && validator.message) || (decorator.label + ' không đúng định dạng');
                                            if (!disableEmit) eventService.Validate.emit(decorator);
                                        }
                                    }
                                }
                            }
                            if (vaildProperty) {
                                let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Duplicate);
                                if (validator) {
                                    let duplicates = decoratorString.duplicates;
                                    if (duplicates && duplicates.length > 0) {
                                        for (let i = 0; i < duplicates.length; i++) {
                                            const duplicate: string = duplicates[i];
                                            let valueDuplicate = target[duplicate];
                                            vaildProperty = !(valueDuplicate && valueDuplicate == value);
                                            if (!vaildProperty && eventService) {
                                                decorator.error = decorator.label + ' trùng với ' + UtilityExHelper.createLabel(duplicate);
                                                if (!disableEmit) eventService.Validate.emit(decorator);
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            if (vaildProperty) {
                                if (decoratorString.type == StringType.Phone) {
                                    let $element = <any>$('#' + decorator.id);
                                    if ($element && $element.length > 0) {
                                        vaildProperty = $element.intlTelInput('isValidNumber');
                                        if (!vaildProperty && eventService) {
                                            let errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"],
                                                errorCode = $element.intlTelInput('getValidationError'),
                                                errorMessage = errorMap[errorCode];
                                            decorator.error = decorator.label + ' không đúng định dạng';
                                            if (!disableEmit) eventService.Validate.emit(decorator);
                                        }
                                    }
                                } else if (decoratorString.type == StringType.PhoneText) {
                                    vaildProperty = value && value.indexOf('0') == 0;
                                    if (!vaildProperty) {
                                        decorator.error = decorator.label + ' không đúng định dạng';
                                        if (!disableEmit) eventService.Validate.emit(decorator);
                                    }
                                }
                            }
                        }
                    } else if (decorator.dataType == DataType.DateTime) {
                        let decoratorDateTime: DateTimeEx = decorator;
                        if (decoratorDateTime.type == DateTimeType.Date || decoratorDateTime.type == DateTimeType.DateTime) {
                            let decoratorDate: DateTimeEx = decorator;
                            if (vaildProperty) {
                                let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Max);
                                if (validator) {
                                    let maxDate = decoratorDate.maxCurent ? new Date() : decoratorDate.max,
                                        allowTime = decoratorDate.format.indexOf(DateTimeFormat.HM) >= 0;
                                    if (decoratorDate.maxCurent) {
                                        if (allowTime) maxDate.setHours(23, 59, 59, 999);
                                        else maxDate.setSeconds(59);
                                    }
                                    vaildProperty = new Date(value) <= maxDate;
                                    if (!vaildProperty && eventService) {
                                        let datetime = decoratorDate.type == DateTimeType.DateTime
                                            ? UtilityExHelper.dateTimeString(maxDate)
                                            : UtilityExHelper.dateString(maxDate);
                                        decorator.error = (validator && validator.message) || (decorator.label + ' lớn nhất là ' + datetime);
                                        if (!disableEmit) eventService.Validate.emit(decorator);
                                    }
                                }
                            }
                            if (vaildProperty) {
                                let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Min);
                                if (validator) {
                                    let minDate = decoratorDate.minCurent ? new Date() : decoratorDate.min,
                                        allowTime = decoratorDate.format.indexOf(DateTimeFormat.HM) >= 0;
                                    if (decoratorDate.minCurent) {
                                        if (allowTime) minDate.setSeconds(0, 0);
                                        else minDate.setHours(0, 0, 0, 0);
                                    }
                                    vaildProperty = new Date(value) >= minDate;
                                    if (!vaildProperty && eventService) {
                                        let datetime = decoratorDate.type == DateTimeType.DateTime
                                            ? UtilityExHelper.dateTimeString(minDate)
                                            : UtilityExHelper.dateString(minDate);
                                        decorator.error = (validator && validator.message) || (decorator.label + ' nhỏ nhất là ' + datetime);
                                        if (!disableEmit) eventService.Validate.emit(decorator);
                                    }
                                }
                            }
                        } else if (decoratorDateTime.type == DateTimeType.DateRange) {
                            let decoratorDate: DateTimeEx = decorator;
                            if (vaildProperty) {
                                let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Max);
                                if (validator) {
                                    let maxDate = decoratorDate.maxCurent ? new Date() : decoratorDate.max,
                                        allowTime = decoratorDate.format.indexOf(DateTimeFormat.HM) >= 0;
                                    if (decoratorDate.maxCurent) {
                                        if (allowTime) maxDate.setHours(23, 59, 59, 999);
                                        else maxDate.setSeconds(59);
                                    }
                                    if (value && Array.isArray(value) && value.length >= 2) {
                                        vaildProperty = new Date(value[0]) <= maxDate && new Date(value[1]) <= maxDate;
                                        if (!vaildProperty && eventService) {
                                            let datetime = decoratorDate.type == DateTimeType.DateTime
                                                ? UtilityExHelper.dateTimeString(maxDate)
                                                : UtilityExHelper.dateString(maxDate);
                                            decorator.error = (validator && validator.message) || (decorator.label + ' lớn nhất là ' + datetime);
                                            if (!disableEmit) eventService.Validate.emit(decorator);
                                        }
                                    }
                                }
                            }
                            if (vaildProperty) {
                                let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Min);
                                if (validator) {
                                    let minDate = decoratorDate.minCurent ? new Date() : decoratorDate.min,
                                        allowTime = decoratorDate.format.indexOf(DateTimeFormat.HM) >= 0;
                                    if (decoratorDate.minCurent) {
                                        if (allowTime) minDate.setSeconds(0, 0);
                                        else minDate.setHours(0, 0, 0, 0);
                                    }
                                    if (value && Array.isArray(value) && value.length >= 2) {
                                        vaildProperty = new Date(value[0]) >= minDate && new Date(value[1]) >= minDate;
                                        if (!vaildProperty && eventService) {
                                            let datetime = decoratorDate.type == DateTimeType.DateTime
                                                ? UtilityExHelper.dateTimeString(minDate)
                                                : UtilityExHelper.dateString(minDate);
                                            decorator.error = (validator && validator.message) || (decorator.label + ' nhỏ nhất là ' + datetime);
                                            if (!disableEmit) eventService.Validate.emit(decorator);
                                        }
                                    }
                                }
                            }
                        }
                    } else if (decorator.dataType == DataType.Number) {
                        let decoratorNumber: NumberEx = decorator;
                        if (vaildProperty) {
                            let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Min);
                            if (validator) {
                                value = UtilityExHelper.formatStringtoNumber(value)
                                vaildProperty = value >= decoratorNumber.min;
                                if (!vaildProperty && eventService) {
                                    decorator.error = (validator && decorator.unit ? `${validator.message} ${decorator.unit}` : validator.message) || (decorator.label + ' nhỏ hơn ' + decoratorNumber.min + decorator.unit ? decorator.unit : '');
                                    if (!disableEmit) eventService.Validate.emit(decorator);
                                }
                            }
                        }
                        if (vaildProperty) {
                            let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Max);
                            if (validator) {
                                value = UtilityExHelper.formatStringtoNumber(value)
                                vaildProperty = value <= decoratorNumber.max;
                                if (!vaildProperty && eventService) {
                                    decorator.error = (validator && validator.message) || (decorator.label + ' lớn hơn ' + decoratorNumber.max);
                                    if (!disableEmit) eventService.Validate.emit(decorator);
                                }
                            }
                        }
                        if (vaildProperty) {
                            let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.RequiredMin);
                            if (validator) {
                                value = UtilityExHelper.formatStringtoNumber(value);
                                let valueRequiredMin = target[decoratorNumber.minDepend],
                                    labelMatch = decorators.find(c => c.property == decoratorNumber.minDepend)?.label;
                                valueRequiredMin = UtilityExHelper.formatStringtoNumber(valueRequiredMin);
                                vaildProperty = value >= valueRequiredMin;
                                if (!vaildProperty && eventService) {
                                    decorator.error = (validator && validator.message) || (decorator.label + ' nhỏ hơn ' + labelMatch);
                                    if (!disableEmit) eventService.Validate.emit(decorator);
                                }
                            }
                        }
                        if (vaildProperty) {
                            let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.RequiredMax);
                            if (validator) {
                                value = UtilityExHelper.formatStringtoNumber(value);
                                let valueRequiredMax = target[decoratorNumber.maxDepend],
                                    labelMatch = decorators.find(c => c.property == decoratorNumber.maxDepend)?.label;
                                valueRequiredMax = UtilityExHelper.formatStringtoNumber(valueRequiredMax)
                                vaildProperty = value <= valueRequiredMax;
                                if (!vaildProperty && eventService) {
                                    decorator.error = (validator && validator.message) || (decorator.label + ' lớn hơn ' + labelMatch);
                                    if (!disableEmit) eventService.Validate.emit(decorator);
                                }
                            }
                        }
                        if (vaildProperty) {
                            if (decoratorNumber.type == NumberType.Between) {
                                let values = Array.isArray(this.value)
                                    ? this.value as []
                                    : this.value.toString().split('-');

                                let value1 = (values && values[0]) || 0,
                                    value2 = (values && values[1]) || 0;
                                vaildProperty = value1 < value2;
                                if (!vaildProperty && eventService) {
                                    decorator.error = decorator.label + ' có giá trị từ ' + value1 + ' đến ' + value2 + ' là không hợp lệ';
                                    if (!disableEmit) eventService.Validate.emit(decorator);
                                }
                            }
                        }
                    } else if (decorator.dataType == DataType.Image || decorator.dataType == DataType.File || decorator.dataType == DataType.Video) {
                        let decoratorNumber: ImageEx = decorator;
                        if (decoratorNumber.multiple) {
                            if (vaildProperty) {
                                let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Min);
                                if (validator) {
                                    let length = Array.isArray(value)
                                        ? value.length
                                        : 1;
                                    vaildProperty = length >= decoratorNumber.min;
                                    if (!vaildProperty && eventService) {
                                        decorator.error = (validator && decorator.unit ? `${validator.message} ${decorator.unit}` : validator.message) || (decorator.label + ' nhỏ hơn ' + decoratorNumber.min + decorator.unit ? decorator.unit : '');
                                        if (!disableEmit) eventService.Validate.emit(decorator);
                                    }
                                }
                            }
                            if (vaildProperty) {
                                let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Max);
                                if (validator) {
                                    let length = Array.isArray(value)
                                        ? value.length
                                        : 1;
                                    vaildProperty = length <= decoratorNumber.max;
                                    if (!vaildProperty && eventService) {
                                        decorator.error = (validator && decorator.unit ? `${validator.message} ${decorator.unit}` : validator.message) || (decorator.label + ' lớn hơn ' + decoratorNumber.min + decorator.unit ? decorator.unit : '');
                                        if (!disableEmit) eventService.Validate.emit(decorator);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (valid) valid = vaildProperty;
        }
        if (valid) {
            for (let i = 0; i < decorators.length; i++) {
                let decorator: ObjectEx = decorators[i]; decorator.error = null;
                if (!disableEmit) eventService.Validate.emit(decorator);
                let needValid: boolean = true;
                if (columns && columns.length > 0) {
                    let column = columns.find(c => c == decorator.property);
                    if (!column) needValid = false;
                }
                if (!needValid) continue;
                let value = target[decorator.property],
                    vaildProperty: boolean = true;
                if (value) {
                    //check exists
                    if (vaildProperty && !disableEmit) {
                        let exception: boolean = false;
                        let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Unique);
                        if (validator) {
                            let valueExists = value,
                                valueId = target['Id'],
                                unique = validator.unique;
                            if (service) {
                                vaildProperty = await service.exists(unique.url, unique.property, valueId, valueExists).then((result: ResultApi) => {
                                    if (ResultApi.IsSuccess(result)) {
                                        if (result.Object) return false;
                                        return true;
                                    } else {
                                        ToastrHelper.ErrorResult(result);
                                        exception = true;
                                        return false;
                                    }
                                }, (e) => {
                                    ToastrHelper.Exception(e);
                                    exception = true;
                                    return false;
                                });
                            }
                            if (!vaildProperty && eventService && !exception) {
                                decorator.error = (validator && validator.message) || (decorator.label + ' đã tồn tại trong hệ thống');
                                if (!disableEmit) eventService.Validate.emit(decorator);
                            }
                        }
                    }
                }
                if (valid) valid = vaildProperty;
            }
        }
    }
    return valid;
}

export function clearValidation(target: any | any[], index: number = null, property: string = null) {
    let eventService = AppInjector.get(AdminEventService);
    if (Array.isArray(target)) {
        target.forEach((item, index) => {
            clearValidation(item, index);
        });
    } else {
        eventService.ResetValidate.emit();
        let decorators = DecoratorHelper.decoratorProperties(target, false);
        if (decorators) {
            decorators = _.cloneDeep(decorators);
            if (property) {
                let decorator: ObjectEx = decorators.find(c => c.property == property);
                decorator.error = null; decorator.index = index;
                eventService.Validate.emit(decorator);
            } else {
                for (let i = 0; i < decorators.length; i++) {
                    let decorator: ObjectEx = decorators[i]; decorator.error = null; decorator.index = index;
                    eventService.Validate.emit(decorator);
                }
            }
        }
    }
}
