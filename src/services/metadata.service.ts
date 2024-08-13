import 'reflect-metadata';

export class MetadataService {
  static set(key: string, value: any) {
    Reflect.defineMetadata(key, value, this);
  }
  static get(key: any) {
    return Reflect.getMetadata(key, this);
  }
}
