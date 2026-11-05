/* eslint-disable import/no-cycle,max-classes-per-file */

import {
  hasProperty, isArray, isDefined, isObject, isString,
} from '@apigames/json';
import { IRestClient } from '@apigames/rest-client';
import {
  LoadDateTime as LoadDateTimeHelper,
  LoadGeospatialPoint as LoadGeospatialPointHelper,
} from '../helpers';
import { ResourceFilterType, ResourceHeaderParams } from '../classes';

export type ResourceObjectType = string;
export type ResourceObjectIdentifier = string;

// eslint-disable-next-line no-shadow
export enum ResourceObjectAttributesLoadType {
    Replace,
    Update,
}

export interface IResourceObjectAttributes {
    LoadData(data: any, action: ResourceObjectAttributesLoadType): void;
}

export type ResourceObjectRelationshipLinkObject = {
    type: ResourceObjectType;
    id: ResourceObjectIdentifier;
}

export type ResourceObjectRelationshipLink = {
    data: ResourceObjectRelationshipLinkObject;
}

export type ResourceObjectRelationshipsLinks = {
    data: ResourceObjectRelationshipLinkObject[];
};

export type ResourceContainerFacetValue = {
  [value: string]: number;
}

export type ResourceContainerFacets = {
  [fieldName: string]: ResourceContainerFacetValue;
}

export type ResourceContainerIncludedResources = {
    // eslint-disable-next-line no-use-before-define
    [id: string]: IResourceObject;
}

export type ResourceContainerIncludedResourceTypes = {
    [type: string]: ResourceContainerIncludedResources;
}

export class ResourceObjectRelationship {
  private _includes: ResourceContainerIncludedResourceTypes;

  readonly type: ResourceObjectType;

  id: ResourceObjectIdentifier | null;

  constructor(includes: ResourceContainerIncludedResourceTypes, type: ResourceObjectType, id?: ResourceObjectIdentifier) {
    this._includes = includes;
    this.type = type;
    if (id) this.id = id;
  }

  clear() {
    this.id = null;
  }

  // eslint-disable-next-line no-use-before-define
  get target(): IResourceObject {
    if (isDefined(this.type) && isDefined(this.id) && isDefined(this._includes[this.type][this.id])) {
      return this._includes[this.type][this.id];
    }

    return undefined;
  }
}

export type ResourceObjectRelationships = ResourceObjectRelationship[];

// eslint-disable-next-line no-shadow
export enum ResourceObjectRelationshipsLoadType {
    Replace,
    Update,
}

export interface IResourceObjectRelationships {
    LoadData(data: any, action: ResourceObjectRelationshipsLoadType): void;
}

export type ResourceObjectUri = string;

export class ResourceObjectAttributeBase {
  protected static LoadDateTime(value: string): Date {
    return LoadDateTimeHelper(value);
  }

  // eslint-disable-next-line no-use-before-define
  protected static LoadGeospatialPoint(geospatialPoint: GeospatialPoint, value: any): GeospatialPoint {
    return LoadGeospatialPointHelper(geospatialPoint, value);
  }
}

export class GeospatialPoint extends ResourceObjectAttributeBase implements IResourceObjectAttributes {
  longitude: number;

  latitude: number;

  LoadData(data: any) {
    if (hasProperty(data, 'longitude')) this.longitude = data.longitude;
    if (hasProperty(data, 'latitude')) this.latitude = data.latitude;
  }
}

export class ResourceObjectRelationshipBase {
  private _includes: ResourceContainerIncludedResourceTypes;

  constructor(includes: ResourceContainerIncludedResourceTypes) {
    this._includes = includes;
  }

  protected LoadRelationship(expectedType: string, value: any): ResourceObjectRelationship {
    if (isObject(value)) {
      if (hasProperty(value, 'data') && isObject(value.data) && (Object.keys(value.data).length === 2)
        && hasProperty(value.data, 'type') && isString(value.data.type)
        && (value.data.type === expectedType)
        && hasProperty(value.data, 'id') && isString(value.data.id)) {
        return new ResourceObjectRelationship(this._includes, value.data.type, value.data.id);
      }
      if ((Object.keys(value).length === 1) && hasProperty(value, 'id') && isString(value.id)) {
        return new ResourceObjectRelationship(this._includes, expectedType, value.id);
      }
    }

    return undefined;
  }

  protected LoadRelationships(expectedType: string, value: any): ResourceObjectRelationships {
    if (isObject(value)) {
      if (hasProperty(value, 'data') && isArray(value.data)) {
        const relationships: ResourceObjectRelationships = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const relationship of value.data) {
          if (isObject(relationship) && (Object.keys(relationship).length === 2)
            && hasProperty(relationship, 'type') && isString(relationship.type)
            && (relationship.type === expectedType)
            && hasProperty(relationship, 'id') && isString(relationship.id)
          ) {
            relationships.push(new ResourceObjectRelationship(this._includes, relationship.type, relationship.id));
          }
        }

        return relationships;
      }
    } else if (isArray(value)) {
      const relationships: ResourceObjectRelationships = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const relationship of value) {
        if (isObject(relationship) && (Object.keys(relationship).length === 1)
          && hasProperty(relationship, 'id') && isString(relationship.id)
        ) {
          relationships.push(new ResourceObjectRelationship(this._includes, expectedType, relationship.id));
        }
      }

      return relationships;
    }

    return undefined;
  }

  // eslint-disable-next-line no-unused-vars
  static RelationshipType(relationshipName: string): string {
    throw new Error('Method or Property not implemented.');
  }
}

export type ResourceObjectSaveOptions = {
  onRewritePostPayload?: (payload: any) => any;
  onRewritePatchPayload?: (payload: any) => any;
}

export interface IResourceObject {
    type: ResourceObjectType;
    id?: ResourceObjectIdentifier;
    attributes: IResourceObjectAttributes
    relationships: IResourceObjectRelationships;
    uri: ResourceObjectUri;
    LoadData(value: any): IResourceObject;
    Delete(): Promise<void>;
    Save(options?: ResourceObjectSaveOptions): Promise<void>;
    UpdateAttributes(value: any): void;
    UpdateRelationships(value: any): void;
}

export type ResourceFacetField = string;
export type ResourceFieldName = string;
export type ResourceFilterName = string;
export type ResourceFilterValue = string;
export type ResourceSortOption = string;
export type ResourceIncludeOption = string;

export interface IResourceContainer {
    data: IResourceObject | IResourceObject[];
    facets: ResourceContainerFacets;
    includes: ResourceContainerIncludedResourceTypes;
    restClient: IRestClient;
    uri: string;
    Facet(fields: ResourceFacetField[]): IResourceContainer;
    Fields(resource: ResourceObjectType, fields: ResourceFieldName[]): IResourceContainer;
    Filter(
      filter: ResourceFilterName,
      selector: ResourceFilterType,
      value: ResourceFilterValue,
    ): IResourceContainer;
    GetHeaders(action: string): ResourceHeaderParams;
    Sort(option: ResourceSortOption): IResourceContainer;
    Include(include: ResourceIncludeOption): IResourceContainer;
    PageOffset(pageOffset: number, pageSize: number): IResourceContainer;
    PageNumber(pageNumber: number, pageSize: number): IResourceContainer;
    Add(): IResourceObject;
    Count(): Promise<number>
    Delete(resource: IResourceObject): Promise<void>;
    Find(): Promise<void>
    Get(id: string): Promise<void>
    IncludedObject(type: ResourceObjectType, id: ResourceObjectIdentifier): IResourceObject;
    RewriteUri(uri: string): string;
}
