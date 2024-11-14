export class FileData {
    Data?: any;
    Name?: string;
    Size?: number;
    Path?: string;
    Note?: string;
    Code?: string;
    S3Key?: string;
    Percent?: number;
    NativeData?: any;
    BgColor?: string;
    Success?: boolean;
    Selected?: boolean;
    CaptureImage?: any;
    ResultUpload?: any;
    Base64Data?: string;
    ByteData?: Uint8Array;
}

export class FileValid {
    Success?: any[];
    Errors?: any[];
}