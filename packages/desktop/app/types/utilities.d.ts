type ObjectKeys<T> = T extends Record<string, unknown>
  ? (keyof T)[]
  : T extends object
  ? (keyof T)[]
  : string[];

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>;
}

// TODO: Augment type to address react type changes in v18 where React.FC no
// longer implicitely has children. Look into alternative approaches for this
// feature or upgrade package once update it made.
declare module "react-file-utils" {
  export declare const ImageDropzone: React.PropsWithChildren<
    React.FC<ImageDropzoneProps>
  >;
}
