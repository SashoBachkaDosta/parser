export interface StyleguideElement {
    id: number;
    name: string;
    kind: string;
    selector: string;
    comments: any[];
    childElements: StyleguideSubelement[];
}

export interface StyleguideSubelement {
    id: number;
    name: string;
    kind: string;
    comments: any;
    parameters: any[];
}

export interface ConfigOptions {
    in: string;
    out: string;
}
