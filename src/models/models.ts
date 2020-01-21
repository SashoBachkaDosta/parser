export interface StyleguideElement {
    id: number;
    name: string;
    kind: string;
    selector: string;
    decorators: StyleGuideDecorator[];
    comments: StyleGuideComment;
    childElements: StyleguideSubelement[];
}

export interface StyleguideSubelement {
    id: number;
    name: string;
    kind: string;
    decorators: StyleGuideDecorator[];
    comments: StyleGuideComment;
    parameters: any[];
}

export interface StyleGuideComment {
    shortText: string;
    codeText: string;
    returns: string;
}

export interface StyleGuideDecorator {
    type: string;
    name: string;
}

export interface StyleGuideParameter {
    id: number;
    name: string;
    kind: string;
    comment: string;
}

export interface ConfigOptions {
    in: string;
    out: string;
}
