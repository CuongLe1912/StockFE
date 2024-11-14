export class TreeData {
    id: number;
    text: string;
    icon?: string;
    parent?: string;
    state?: TreeStateData;
    children?: TreeData[];
}

export class TreeStateData {
    opened?: boolean;
    disabled?: boolean;
    selected?: boolean;
}