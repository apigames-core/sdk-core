/* eslint-disable import/no-cycle */
import {
  hasProperty, isDefined, isNumber, isObject, isUndefinedOrNull,
} from '@apigames/json';
import { GeospatialPoint } from '../interfaces';

export function LoadDateTime(value: string): Date {
  if (isDefined(value)) return new Date(value);
  return undefined;
}

// eslint-disable-next-line no-use-before-define
export function LoadGeospatialPoint(geospatialPoint: GeospatialPoint, value: any): GeospatialPoint {
  if (isUndefinedOrNull(geospatialPoint)) {
    if (isDefined(value) && isObject(value) && (Object.keys(value).length === 2)
      && hasProperty(value, 'longitude') && isNumber(value.longitude)
      && hasProperty(value, 'latitude') && isNumber(value.latitude)) {
      // eslint-disable-next-line no-use-before-define
      const result = new GeospatialPoint();
      result.LoadData(value);
      return result;
    }
  } else if (isDefined(value) && isObject(value) && (Object.keys(value).length <= 2)
    && (
      (hasProperty(value, 'longitude') && isNumber(value.longitude))
        || (hasProperty(value, 'latitude') && isNumber(value.latitude))
    )) {
    // eslint-disable-next-line no-use-before-define
    geospatialPoint.LoadData(value);
    return geospatialPoint;
  }

  return undefined;
}
