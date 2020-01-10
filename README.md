# TypeDoc JSON parser
## A very barebones parser

This parser takes as input the json that the TypeDoc node application generates and simplifies it further down.
In order to pick only the components that you want to document, decorate them with a @Document() decorator, which doesn't need to do anything.

```ts
export function Document() {
    return null;
}
```

> Decorator like this is sufficient.

```ts
@Document()
export class SomeClass
```
> The class you want to document should roughly look like this

Regular documentation comments will be available in the JSON that is generated. 

```ts
/**
 * This is a sample doc.
 * ```
 * var codeExample = "codeExample"
 * ```
 * @param parameter this is a parameter.
 * @return returns value.
 * /
```

> The more detailed your comments are the more detailed your json will be. You can add comments with parameters, return statements and code examples.