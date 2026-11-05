export {
  type ISDKError, type ISDKRequestError, type ISDKException, type ISDKRequestException,
} from './sdk.errors';

// eslint-disable-next-line import/no-cycle
export {
  type IResourceContainer, type ResourceContainerFacetValue, type ResourceContainerFacets,
  type ResourceContainerIncludedResourceTypes, type ResourceFacetField, type ResourceFieldName,
  type ResourceFilterName, type ResourceFilterValue, type ResourceObjectType,
  type ResourceSortOption, type ResourceIncludeOption, type ResourceObjectSaveOptions, type IResourceObject,
  type IResourceObjectAttributes, type IResourceObjectRelationships, GeospatialPoint,
  ResourceObjectAttributeBase, ResourceObjectAttributesLoadType, type ResourceObjectRelationshipLinkObject,
  type ResourceObjectRelationshipLink, type ResourceObjectRelationshipsLinks, ResourceObjectRelationshipsLoadType,
  ResourceObjectRelationship, type ResourceObjectRelationships, type ResourceObjectUri,
  ResourceObjectRelationshipBase,
} from './resource.interfaces';
