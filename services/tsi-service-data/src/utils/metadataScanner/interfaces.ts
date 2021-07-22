/**
 * Description: Interfaces for metadata scanner module
 */

export interface IMetadataScanner {
  scanFromPrototype<T extends Record<string, any>, R = any>(
    instance: T,
    prototype: Record<string, any>,
    callback: (name: string) => R,
  ): Array<R>;
}
