import { StyleguideElement, StyleguideSubelement, ConfigOptions, StyleGuideComment, StyleGuideDecorator, StyleGuideParameter } from './models/models';

import fs = require('fs');

export class StyleguideParser {

    /**
     * This method is used to reduce the original json to a smaller, more usable version.
     */
    static parseJson(config: ConfigOptions) {
        let sampleData;

        try {
            sampleData = JSON.parse(fs.readFileSync(config.in).toString())
        } catch {
            console.log(config.in, " is an invalid path or the file doesn't exist.")
            return 0;
        }

        let result: StyleguideElement[] = [];
        sampleData.children.forEach(item => {
            if (this.checkIfDocumented(item)) {
                let children: StyleguideSubelement[] = [];
                if (item.children.length) {
                    item.children.forEach((child, index) => {
                        switch (child.kind) {
                            case 2048:
                                const method = this.createChildMethod(child, index);
                                return method ? children = [...children, method] : children;
                            case 1024:
                                const property = this.createChildProperty(child, index);
                                return property ? children = [...children, property] : children;
                            default:
                                return children;
                        }
                    });
                }
                const styleguideElement: StyleguideElement = {
                    id: result.length,
                    name: item.name,
                    kind: item.kindString,
                    decorators: this.getDecorators(item.decorators),
                    selector: this.getSelector(item.decorators),
                    comments: this.getComment(item.comment),
                    childElements: children
                };
                result = [...result, styleguideElement];
            }
        });
        fs.writeFile(config.out, JSON.stringify(result), (err) => {
            if (err) throw err;
            console.log("Data written to file")
        })
    }

    /**
     * This method checks the for the 'Document' decorator
     * @param item an object from the typedoc json
     */
    private static checkIfDocumented(item: any): boolean {
        if (item.decorators) {
            for (const decorator of item.decorators) {
                if (decorator.name === 'Document') {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * This method is used to create a child of the component that is a method.
     * @param child the child element of the component.
     * @param id id.
     */
    private static createChildMethod(child: any, id: number): StyleguideSubelement {
        let childElement: StyleguideSubelement;
        if (child.flags && !child.flags.isPrivate && child.signatures && child.signatures[0].comment) {
            childElement = {
                id,
                name: child.name,
                kind: child.kindString,
                decorators: child.decorators ? this.getDecorators(child.decorators) : null,
                comments: this.getComment(child.signatures[0].comment),
                parameters: child.signatures[0].parameters ? this.getParameters(child.signatures[0].parameters) : null
            };
        }
        return childElement ? childElement : null;
    }

    /**
     * This method is used to create a child of the component that is a property.
     * @param child the child element of the component.
     * @param id id.
     */
    private static createChildProperty(child: any, id: number): StyleguideSubelement {
        let childElement: StyleguideSubelement;
        if (child.comment) {
            childElement = {
                id,
                name: child.name,
                kind: child.kindString,
                decorators: child.decorators ? this.getDecorators(child.decorators) : null,
                comments: this.getComment(child.comment),
                parameters: null
            };
        }
        return childElement ? childElement : null;
    }

    /**
     * This method is used to construct a comment object.
     * @param comment comment on element.
     */
    private static getComment(comment: any): StyleGuideComment {
        let result: StyleGuideComment;
        if (comment && comment.shortText) {
            let shortText: string = comment.shortText;
            let codeText;
            if (shortText.indexOf('```') >= 0) {
                const start = shortText.indexOf('`');
                const end = shortText.lastIndexOf('`');
                codeText = shortText.slice(start + 4, end - 2);
                shortText = shortText.substr(0, start - 1) + shortText.substr(end + 1);
            }
            result = {
                shortText: shortText ? shortText : null,
                codeText: codeText ? codeText : null,
                returns: comment.returns ? comment.returns : null
            };
        }
        return result ? result : null;
    }

    /**
     * This method is used to extract the selector from the Component decorator.
     * @param decorators array of the components decorators.
     */
    private static getSelector(decorators: any[]): string {
        if (decorators) {
            for (const decorator of decorators) {
                if (decorator.name === 'Component' && decorator.arguments.obj.includes('selector:')) {
                    let argumentString = decorator.arguments.obj;
                    const start = argumentString.indexOf('selector:') + 11;
                    argumentString = argumentString.slice(start);
                    const end = argumentString.indexOf(',') - 1;
                    argumentString = '<' + argumentString.slice(0, end) + '>';
                    return argumentString;
                }
            }
        }
        return null;
    }

    /**
     * This method is used to get the decorators of a property or method.
     * @param decorators array of decorators.
     */
    private static getDecorators(decorators: any[]): StyleGuideDecorator[] {
        const res: StyleGuideDecorator[] = [];
        decorators.forEach(decorator => {
            if (decorator.name !== 'Component' && decorator.name !== 'Document') {
                res.push(decorator.type)
            }
        })
        return res.length > 0 ? res : null;
    }

    /**
     * This method is used to get the parameters of a method.
     * @param parameters array of parameters.
     */
    private static getParameters(parameters: any[]): any[] {
        const res: StyleGuideParameter[] = [];
        parameters.forEach(parameter => {
            if (parameter) {
                res.push({
                    id: parameter.id,
                    name: parameter.name,
                    kind: parameter.kindString,
                    comment: parameter.comment.text
                })
            }
        })
        return res.length > 0 ? res : null;
    }
}
