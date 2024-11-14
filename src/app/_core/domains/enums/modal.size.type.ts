export enum ModalSizeType {
    Small = 1,
    Medium,
    Large,
    ExtraLarge,
    FullScreen,
}
export function ModalSizeTypeAware(constructor: Function) {
    constructor.prototype.ModalSizeType = ModalSizeType;
}
