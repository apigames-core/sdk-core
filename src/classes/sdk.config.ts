/* eslint-disable import/no-cycle */
import { isUndefined } from '@apigames/json';
import { ResourceObjectClass } from './resource.object';

export type SDKResourceMap = {
  [index: string] :ResourceObjectClass;
}

export type UriRewriter = (uri: string) => string;

export class SDKConfiguration {
  private _accessToken: string;

  private _apiKey: string;

  private _hostName: string;

  private _resourceMap: SDKResourceMap;

  private _uriRewriter: UriRewriter;

  constructor() {
    this._resourceMap = {};
  }

  RegisterResourceClass(type: string, resourceClass: ResourceObjectClass) {
    this._resourceMap[type] = resourceClass;
  }

  ResourceClass(type: string): ResourceObjectClass {
    return this._resourceMap[type];
  }

  FormatURL(path: string): string {
    let url = this.hostName;
    url = url.endsWith('/') ? url.slice(0, -1) : url;
    return path.startsWith('/') ? `${url}${path}` : `${url}/${path}`;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  set accessToken(value: string) {
    this._accessToken = value;
  }

  get apiKey(): string {
    return this._apiKey;
  }

  set apiKey(value: string) {
    this._apiKey = value;
  }

  get hostName(): string {
    return this._hostName;
  }

  set hostName(value: string) {
    this._hostName = value;
  }

  get uriRewriter(): UriRewriter {
    return this._uriRewriter;
  }

  set uriRewriter(value: UriRewriter) {
    this._uriRewriter = value;
  }
}

let configInstance: SDKConfiguration;

export function SDKConfig(): SDKConfiguration {
  if (isUndefined(configInstance)) configInstance = new SDKConfiguration();
  return configInstance;
}
