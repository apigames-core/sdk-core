/* eslint-disable import/no-cycle */
import { isArray, isDefinedAndNotNull } from '@apigames/json';
import { ResourceContainer, ResourceObject } from '../classes';
import { ResourceObjectRelationship, ResourceObjectRelationships } from '../interfaces';

export function isResourceContainer(value: any): value is ResourceContainer {
  return isDefinedAndNotNull(value) && (value instanceof ResourceContainer);
}

export function isResourceObject(value: any): value is ResourceObject {
  return isDefinedAndNotNull(value)
      && (value instanceof ResourceObject)
      && (typeof value.type === 'string');
}

export function isResourceObjectRelationship(value: any): value is ResourceObjectRelationship {
  return isDefinedAndNotNull(value) && (value instanceof ResourceObjectRelationship);
}

export function isResourceObjectRelationships(value: any): value is ResourceObjectRelationships {
  if (isArray(value)) {
    let allValid = true;

    // eslint-disable-next-line no-restricted-syntax
    for (const relationship of value) allValid = allValid && isResourceObjectRelationship(relationship);
    return allValid;
  }
  return false;
}
