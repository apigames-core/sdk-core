import {
  areEqual, hasProperty, isArray, isDate, isDefined, isDefinedAndNotNull, isEmpty, isFalse, isNumber, isObject,
  isString, isUndefined, isUndefinedOrNull, redactUndefinedValues,
} from '@apigames/json';
import { RestClientOptions, RestClientResponseHeaders } from '@apigames/rest-client';
// eslint-disable-next-line import/no-cycle
import {
  IResourceContainer, IResourceObject, IResourceObjectAttributes, IResourceObjectRelationships,
  isResourceObjectRelationship, isResourceObjectRelationships, ResourceObjectAttributesLoadType,
  ResourceObjectRelationshipsLoadType, ResourceObjectSaveOptions, ResourceObjectUri, SDKException,
} from '..';

// eslint-disable-next-line no-shadow
export enum ResourceObjectMode {
    NewDocument,
    ExistingDocument
}

export type ResourceObjectMetadata = {
  insertedAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  version?: Date;
  searchScore?: number;
  distance?: number;
}

export default class ResourceObject implements IResourceObject {
  private _container: IResourceContainer;

  private _id: string;

  private _meta: ResourceObjectMetadata = {};

  private _mode: ResourceObjectMode = ResourceObjectMode.NewDocument;

  private _uri: ResourceObjectUri;

  constructor(container: IResourceContainer, mode: ResourceObjectMode) {
    this._container = container;
    this._mode = mode;
  }

  // eslint-disable-next-line class-methods-use-this
  protected EndpointContentType(): string {
    throw new Error('Method or Property not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  protected LoadAttributes(value: any) {
    throw new Error('Method or Property not implemented.');
  }

  protected LoadMetadata(value: any) {
    this._meta = {};

    if (isDefinedAndNotNull(value) && hasProperty(value, 'insertedAt')
      && isString(value.insertedAt)) this._meta.insertedAt = new Date(value.insertedAt);

    if (isDefinedAndNotNull(value) && hasProperty(value, 'updatedAt')
      && isString(value.updatedAt)) this._meta.updatedAt = new Date(value.updatedAt);

    if (isDefinedAndNotNull(value) && hasProperty(value, 'deletedAt')
      && isString(value.deletedAt)) this._meta.deletedAt = new Date(value.deletedAt);

    if (isDefinedAndNotNull(value) && hasProperty(value, 'version')
      && isString(value.version)) this._meta.version = new Date(value.version);

    if (isDefinedAndNotNull(value) && hasProperty(value, 'searchScore')
      && isNumber(value.searchScore)) this._meta.searchScore = value.searchScore;

    if (isDefinedAndNotNull(value) && hasProperty(value, 'distance')
      && isNumber(value.distance)) this._meta.distance = value.distance;
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  protected LoadRelationships(value: any) {
    throw new Error('Method or Property not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  protected RelationshipType(relationshipName: string): string {
    throw new Error('Method or Property not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  public UpdateAttributes(value: any) {
    throw new Error('Method or Property not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  public UpdateRelationships(value: any) {
    throw new Error('Method or Property not implemented.');
  }

  LoadData(value: any): IResourceObject {
    if (!hasProperty(value, 'type') || (value.type !== this.type)) {
      throw new SDKException('INVALID-RESOURCE-MAPPING', 'The resource data being loaded cannot be '
          + 'read into this object');
    }

    if (hasProperty(value, 'id')) this._id = value.id;

    if (hasProperty(value, 'attributes')) this.LoadAttributes(value.attributes);

    if (hasProperty(value, 'relationships')) this.LoadRelationships(value.relationships);

    if (hasProperty(value, 'links') && isObject(value.links) && hasProperty(value.links, 'self')
        && isString(value.links.self)) {
      this._uri = value.links.self;
    }

    if (hasProperty(value, 'meta')) this.LoadMetadata(value.meta);

    this._mode = ResourceObjectMode.ExistingDocument;

    return this;
  }

  protected SerializeAttributesPayload(shadow: any, data: any): any {
    if (areEqual(shadow, data)) return undefined;
    if (isUndefined(data) && isUndefined(shadow)) return undefined;
    if (isUndefined(shadow)) return data;
    if (isDate(data)) return data;
    if (isArray(data)) return data;

    if (isObject(data)) {
      if ((Object.keys(data).length === 2)
          && (hasProperty(data, 'latitude') && isNumber(data.latitude))
          && (hasProperty(data, 'longitude') && isNumber(data.longitude))) {
        return data;
      }

      const payload: any = {};
      // eslint-disable-next-line no-restricted-syntax
      for (const fieldName in data) {
        if (hasProperty(data, fieldName)) {
          if (
            isObject(data[fieldName])
              && hasProperty(data[fieldName], 'BranchType')
              && isDefinedAndNotNull(data[fieldName].BranchType)
              && isString(data[fieldName].BranchType)
          ) {
            if (isFalse(areEqual(shadow[fieldName], data[fieldName]))) payload[fieldName] = data[fieldName];
          } else {
            // eslint-disable-next-line no-lonely-if
            if (isDefined(shadow)) payload[fieldName] = this.SerializeAttributesPayload(shadow[fieldName], data[fieldName]);
            else payload[fieldName] = this.SerializeAttributesPayload(undefined, data[fieldName]);
          }
        }
      }

      if (isDefined(shadow) && isObject(shadow)) {
        // eslint-disable-next-line no-restricted-syntax
        for (const fieldName in shadow) {
          if (hasProperty(shadow, fieldName)) {
            if (isDefinedAndNotNull(shadow[fieldName]) && isUndefinedOrNull(data[fieldName])) payload[fieldName] = null;
          }
        }
      }

      return payload;
    }

    return data;
  }

  // eslint-disable-next-line class-methods-use-this
  protected SerializeRelationshipsPayload(shadow: any, data: any): any {
    if (areEqual(shadow, data)) return undefined;
    if (isUndefined(data) && isUndefined(shadow)) return undefined;

    if (isObject(data)) {
      const payload: any = {};
      // eslint-disable-next-line no-restricted-syntax
      for (const fieldName in data) {
        if (hasProperty(data, fieldName)) {
          if (isDefinedAndNotNull(data[fieldName])) {
            if (isResourceObjectRelationships(data[fieldName])) {
              payload[fieldName] = {
                data: [],
              };

              // eslint-disable-next-line no-restricted-syntax
              for (const relationship of data[fieldName]) {
                payload[fieldName].data.push(
                  {
                    type: relationship.type,
                    id: relationship.id,
                  },
                );
              }
            } else if (isResourceObjectRelationship(data[fieldName])) {
              if (
                isUndefined(shadow)
                  || isUndefined(shadow[fieldName])
                  || ((shadow[fieldName].type !== data[fieldName].type) || (shadow[fieldName].id !== data[fieldName].id))
              ) {
                if (data[fieldName].id === null) {
                  payload[fieldName] = { data: null };
                } else {
                  payload[fieldName] = {
                    data: {
                      type: data[fieldName].type,
                      id: data[fieldName].id,
                    },
                  };
                }
              }
            }
          }
        }
      }

      if (isDefined(shadow) && isObject(shadow)) {
        // eslint-disable-next-line no-restricted-syntax
        for (const fieldName in shadow) {
          if (hasProperty(shadow, fieldName)) {
            if (isDefinedAndNotNull(shadow[fieldName]) && isUndefinedOrNull(data[fieldName])) payload[fieldName] = null;
          }
        }
      }

      return payload;
    }

    return data;
  }

  protected GetInsertPayload(): any {
    const payload: any = {
      data: {
        type: this.type,
      },
    };

    if (isDefined(this.id)) payload.data.id = this.id;

    if (isDefined(this.attributes)) {
      const serializedAttributes = this.SerializeAttributesPayload(this.shadowAttributes, this.attributes);
      if (isDefinedAndNotNull(serializedAttributes) && isFalse(isEmpty(serializedAttributes))) {
        payload.data.attributes = serializedAttributes;
      }
    }

    if (isDefined(this.relationships)) {
      const serializedRelationships = this.SerializeRelationshipsPayload(this.shadowRelationships, this.relationships);
      if (isDefinedAndNotNull(serializedRelationships) && isFalse(isEmpty(serializedRelationships))) {
        payload.data.relationships = serializedRelationships;
      }
    }

    redactUndefinedValues(payload);
    return payload;
  }

  protected GetUpdatePayload(): any {
    const payload: any = {
      data: {
        type: this.type,
        id: this.id,
      },
    };

    if (isDefined(this.attributes)) {
      const serializedAttributes = this.SerializeAttributesPayload(this.shadowAttributes, this.attributes);
      if (isDefinedAndNotNull(serializedAttributes) && isFalse(isEmpty(serializedAttributes))) {
        payload.data.attributes = serializedAttributes;
      }
    }

    if (isDefined(this.relationships)) {
      const serializedRelationships = this.SerializeRelationshipsPayload(this.shadowRelationships, this.relationships);
      if (isDefinedAndNotNull(serializedRelationships) && isFalse(isEmpty(serializedRelationships))) {
        payload.data.relationships = serializedRelationships;
      }
    }

    redactUndefinedValues(payload);
    return payload;
  }

  async Delete(): Promise<void> {
    await this._container.Delete(this);
  }

  // eslint-disable-next-line class-methods-use-this
  private GetHeaderValue(headers: RestClientResponseHeaders, key: string): string {
    let value: string;

    // eslint-disable-next-line no-restricted-syntax
    for (const headerName in headers) {
      if (headerName.toLowerCase() === key.toLowerCase()) {
        value = headers[headerName];
      }
    }

    return value;
  }

  // eslint-disable-next-line class-methods-use-this
  private HasHeader(headers: RestClientResponseHeaders, key: string): boolean {
    let hasHeader = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const headerName in headers) {
      if (headerName.toLowerCase() === key.toLowerCase()) {
        hasHeader = true;
      }
    }

    return hasHeader;
  }

  private async InsertResource(options?: ResourceObjectSaveOptions) {
    const queryUri: string = this._container.uri;
    const queryHeaders = this._container.GetHeaders('INSERT');
    const queryOptions: RestClientOptions = {};

    let payload: any = this.GetInsertPayload();
    if (options?.onRewritePostPayload && isDefinedAndNotNull(options.onRewritePostPayload) && options.onRewritePostPayload instanceof Function) {
      payload = options?.onRewritePostPayload(payload);
    }

    const response = await this._container.restClient.Post(queryUri, payload, queryHeaders, queryOptions);

    if (!this.HasHeader(response.headers, 'location')) {
      throw new SDKException('INVALID-LOCATION', 'The save operation was unable to retrieve the location '
              + 'of the resource created by the API.');
    }

    if (!this.HasHeader(response.headers, 'x-api-resource-id')) {
      throw new SDKException('INVALID-RESOURCE-ID', 'The save operation was unable to retrieve the '
          + 'identifier of the resource created by the API.');
    }

    this.id = this.GetHeaderValue(response.headers, 'x-api-resource-id');
    this._uri = this.GetHeaderValue(response.headers, 'location');

    if (isDefined(response.data) && isObject(response.data)) {
      if (hasProperty(response.data, 'data')) {
        if (isObject(response.data.data)) {
          const resourceData = response.data.data;
          if (hasProperty(resourceData, 'type') && isString(resourceData.type) && resourceData.type === this.type
            && hasProperty(resourceData, 'id') && isString(resourceData.id) && resourceData.id === this.id) {
            this.LoadData(resourceData);
          }
        }
      }
    }

    this._mode = ResourceObjectMode.ExistingDocument;
  }

  private async UpdateResource(options?: ResourceObjectSaveOptions) {
    const queryUri: string = this.uri;
    const queryHeaders = this._container.GetHeaders('UPDATE');
    const queryOptions: RestClientOptions = {};

    let payload: any = this.GetUpdatePayload();
    if (options?.onRewritePatchPayload && isDefinedAndNotNull(options.onRewritePatchPayload) && options.onRewritePatchPayload instanceof Function) {
      payload = options?.onRewritePatchPayload(payload);
    }

    await this._container.restClient.Patch(queryUri, payload, queryHeaders, queryOptions);
  }

  // eslint-disable-next-line class-methods-use-this
  async Save(options?: ResourceObjectSaveOptions) {
    if (this._mode === ResourceObjectMode.NewDocument) {
      await this.InsertResource(options);
    } else {
      await this.UpdateResource(options);
    }

    if (isDefined(this.attributes)) {
      this.shadowAttributes.LoadData(this.attributes, ResourceObjectAttributesLoadType.Replace);
    }

    if (isDefined(this.relationships)) {
      this.shadowRelationships.LoadData(this.relationships, ResourceObjectRelationshipsLoadType.Replace);
    }
  }

  toJSON(): any {
    const obj: any = {
      type: this.type,
    };

    if (isDefined(this.id)) obj.id = this.id;

    if (isDefined(this.attributes)) {
      obj.attributes = this.SerializeAttributesPayload(undefined, this.attributes);
    }

    if (isDefined(this.relationships)) {
      obj.relationships = this.SerializeRelationshipsPayload(undefined, this.relationships);
    }

    redactUndefinedValues(obj);

    return JSON.parse(JSON.stringify(obj));
  }

  // eslint-disable-next-line class-methods-use-this
  get type(): string {
    throw new Error('Method or Property not implemented.');
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  // eslint-disable-next-line class-methods-use-this
  get attributes(): IResourceObjectAttributes {
    throw new Error('Method or Property not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  get relationships(): IResourceObjectRelationships {
    throw new Error('Method or Property not implemented.');
  }

  get meta(): ResourceObjectMetadata {
    return this._meta;
  }

  // eslint-disable-next-line class-methods-use-this
  protected get shadowAttributes(): IResourceObjectAttributes {
    throw new Error('Method or Property not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  protected get shadowRelationships(): IResourceObjectRelationships {
    throw new Error('Method or Property not implemented.');
  }

  get uri(): ResourceObjectUri {
    return this._container.RewriteUri(this._uri);
  }
}

export type ResourceObjectClass = typeof ResourceObject;
