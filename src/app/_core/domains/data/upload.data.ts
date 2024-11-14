import { KeyValue } from "./key.value";
import { ResultApi } from "./result.api";
import { FileType } from "../enums/file.type";
import { MethodType } from "../enums/method.type";

export class UploadData {
    data: any;
    path?: string;
    type?: FileType;
    failFunction?: (evt: any) => void;
    cancelFunction?: (evt: any) => void;
    processFunction?: (percent: number) => void;
    completeFunction?: (result: ResultApi) => void;

    constructor() {     
        this.type = FileType.Image;   
    }
}

export class CustomUploadData {
    url: string;
    data: KeyValue[];
    needMove?: boolean;
    method?: MethodType;
    headers?: KeyValue[];
    authorization: KeyValue;
}