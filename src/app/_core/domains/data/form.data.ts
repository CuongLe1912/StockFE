import { FormType } from "../enums/form.type";
import { AlignType } from "../enums/align.type";
import { ColumnClassFormat, ObjectEx } from "../../decorators/object.decorator";

export class FormData {
    Type: FormType;
    Align?: AlignType;
    Width?: ColumnClassFormat;
    Propperties: (string | ObjectEx)[];
}