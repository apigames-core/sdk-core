/* eslint-disable max-classes-per-file */
import {
  clone,
  hasProperty, isArray, isDefined, isDefinedAndNotNull, isUndefined,
} from '@apigames/json';
import {
  GeospatialPoint,
  IResourceContainer,
  IResourceObjectAttributes,
  IResourceObjectRelationships,
  ResourceContainer,
  ResourceContainerParams,
  ResourceFilterType,
  ResourceFilterValue,
  ResourceObject,
  ResourceObjectAttributeBase,
  ResourceObjectAttributesLoadType,
  ResourceObjectMode,
  ResourceObjectRelationshipBase,
  ResourceObjectRelationship,
  ResourceObjectRelationships,
  ResourceObjectRelationshipsLoadType,
  SDKConfig,
} from '../../src';

// eslint-disable-next-line no-shadow
export enum OrderFilter {
  ProductCode = 'product.code',
}

// eslint-disable-next-line no-shadow
export enum OrderSort {
  OrderDate = 'orderDate',
}

// eslint-disable-next-line no-shadow
export enum OrderInclude {
  Customer = 'customer',
}

export class OrderProductFeature extends ResourceObjectAttributeBase implements IResourceObjectAttributes {
  name?: string;

  userRating?: number | null;

  private clearData() {
    this.name = undefined;
    this.userRating = undefined;
  }

  LoadData(data: any, action: ResourceObjectAttributesLoadType): void {
    if (action === ResourceObjectAttributesLoadType.Replace) this.clearData();

    if (hasProperty(data, 'name')) this.name = data.name;
    if (hasProperty(data, 'userRating')) this.userRating = data.userRating;
  }
}

export class OrderAttributes extends ResourceObjectAttributeBase implements IResourceObjectAttributes {
  product?: {
    code?: string;
    name?: string;
    description?: string[];
    releaseDate?: Date,
    releaseLocation?: GeospatialPoint,
    market?: any;
    features?: OrderProductFeature[]
  };

  qty?: number;

  price?: number;

  private static LoadProductDescription(data: any): string[] {
    const values: string[] = [];

    if (isArray(data)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const value of data) {
        values.push(value);
      }
    }

    return values;
  }

  private static LoadProductFeatures(data: any, action: ResourceObjectAttributesLoadType): OrderProductFeature[] {
    const values: OrderProductFeature[] = [];

    if (isArray(data)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const value of data) {
        const productFeature = new OrderProductFeature();
        productFeature.LoadData(value, action);
        values.push(productFeature);
      }
    }

    return values;
  }

  private clearData() {
    this.product = undefined;
    this.qty = undefined;
    this.price = undefined;
  }

  LoadData(data: any, action: ResourceObjectAttributesLoadType): void {
    if (action === ResourceObjectAttributesLoadType.Replace) this.clearData();

    if (hasProperty(data, 'product')) {
      if (isUndefined(this.product)) this.product = {};
      if (hasProperty(data.product, 'code')) this.product.code = data.product?.code;
      if (hasProperty(data.product, 'name')) this.product.name = data.product?.name;
      if (hasProperty(data.product, 'description')) {
        this.product.description = OrderAttributes.LoadProductDescription(data.product?.description);
      }
      if (hasProperty(data.product, 'releaseDate')) {
        this.product.releaseDate = OrderAttributes.LoadDateTime(data.product?.releaseDate);
      }
      if (hasProperty(data.product, 'releaseLocation')) {
        this.product.releaseLocation = OrderAttributes.LoadGeospatialPoint(
          this.product.releaseLocation,
          data.product?.releaseLocation,
        );
      }

      if (hasProperty(data.product, 'market')) this.product.market = clone(data.product?.market);

      if (hasProperty(data.product, 'features')) {
        this.product.features = OrderAttributes.LoadProductFeatures(data.product?.features, action);
      }
    }

    if (hasProperty(data, 'qty')) this.qty = data.qty;
    if (hasProperty(data, 'price')) this.price = data.price;
  }
}

export class OrderRelationships extends ResourceObjectRelationshipBase implements IResourceObjectRelationships {
  customer?: ResourceObjectRelationship;

  target?: ResourceObjectRelationship;

  target1?: ResourceObjectRelationship | ResourceObjectRelationships;

  target2?: ResourceObjectRelationship | ResourceObjectRelationships;

  target3?: ResourceObjectRelationship | ResourceObjectRelationships;

  private clearData() {
    this.customer = undefined;
    this.target = undefined;
    this.target1 = undefined;
    this.target2 = undefined;
    this.target3 = undefined;
  }

  LoadData(data: any, action: ResourceObjectRelationshipsLoadType): void {
    if (action === ResourceObjectRelationshipsLoadType.Replace) this.clearData();

    if (hasProperty(data, 'customer')) {
      this.customer = this.LoadRelationship(
        OrderRelationships.RelationshipType('customer'),
        data.customer,
      );
    }
  }

  static RelationshipType(relationshipName: string): string {
    switch (relationshipName) {
      case 'customer':
        return 'Customer';
      case 'target':
        return 'Target';
      case 'target1':
        return 'Target1';
      case 'target2':
        return 'Target2';
      case 'target3':
        return 'Target3';
      case 'target4':
        return 'Target4';
      default:
        return 'UNKNOWN-RESOURCE-TYPE';
    }
  }
}

export class Order extends ResourceObject {
  private current: {
    attributes: OrderAttributes;
    relationships: OrderRelationships;
  };

  private shadow: {
    attributes: OrderAttributes;
    relationships: OrderRelationships;
  };

  constructor(container: IResourceContainer, mode: ResourceObjectMode) {
    super(container, mode);
    this.current = {
      attributes: new OrderAttributes(),
      relationships: new OrderRelationships(container.includes),
    };
    this.shadow = {
      attributes: new OrderAttributes(),
      relationships: new OrderRelationships(container.includes),
    };
  }

  protected LoadAttributes(data: any) {
    this.current.attributes.LoadData(data, ResourceObjectAttributesLoadType.Replace);
    this.shadow.attributes.LoadData(data, ResourceObjectAttributesLoadType.Replace);
  }

  public UpdateAttributes(data: any) {
    this.current.attributes.LoadData(data, ResourceObjectAttributesLoadType.Update);
  }

  protected LoadRelationships(data: any) {
    this.current.relationships.LoadData(data, ResourceObjectRelationshipsLoadType.Replace);
    this.shadow.relationships.LoadData(data, ResourceObjectRelationshipsLoadType.Replace);
  }

  public UpdateRelationships(data: any) {
    this.current.relationships.LoadData(data, ResourceObjectRelationshipsLoadType.Update);
  }

  // eslint-disable-next-line class-methods-use-this
  protected RelationshipType(relationshipName: string): string {
    return OrderRelationships.RelationshipType(relationshipName);
  }

  public SerializeAttributesPayload(shadow: any, data: any): any {
    return super.SerializeAttributesPayload(shadow, data);
  }

  public SerializeRelationshipsPayload(shadow: any, data: any): any {
    return super.SerializeRelationshipsPayload(shadow, data);
  }

  get attributes(): OrderAttributes {
    return this.current.attributes;
  }

  get relationships(): OrderRelationships {
    return this.current.relationships;
  }

  get shadowAttributes(): OrderAttributes {
    return this.shadow.attributes;
  }

  get shadowRelationships(): OrderRelationships {
    return this.shadow.relationships;
  }

  // eslint-disable-next-line class-methods-use-this
  get type(): string {
    return 'Order';
  }

  // eslint-disable-next-line class-methods-use-this
  protected EndpointContentType(): string {
    return 'application/vnd.api+json';
  }
}

export function isOrderResourceObject(value: any): value is Order {
  return isDefinedAndNotNull(value)
      && (value instanceof Order)
      && (value.type === 'Order');
}

export class CustomerOrders extends ResourceContainer {
  constructor(customerId: string, params?: ResourceContainerParams) {
    super(params);
    this.pathParams.customerId = customerId;
  }

  get data(): Order | Order[] {
    if (isDefined(this._data) && this.isResourceObject(this._data)) {
      return this._data as Order;
    }

    if (isDefined(this._data) && this.isResourceList(this._data)) {
      return this._data as Order[];
    }

    return undefined;
  }

  Add(): Order {
    const obj = new Order(this, ResourceObjectMode.NewDocument);
    obj.relationships.customer = new ResourceObjectRelationship(this.includes, 'Customer', this.pathParams.customerId);
    this.AddResourceToMemoryStructure(obj);
    return obj;
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  Filter(filter: OrderFilter, selector: ResourceFilterType, value: ResourceFilterValue): IResourceContainer {
    return super.Filter(OrderFilter.ProductCode, selector, value);
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  Sort(option: OrderSort): IResourceContainer {
    return super.Sort(OrderSort.OrderDate);
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  Include(include: OrderInclude): IResourceContainer {
    return super.Include(OrderInclude.Customer);
  }

  // eslint-disable-next-line class-methods-use-this
  protected EndpointPath(): string {
    return 'https://api.example.com/customers/{customerId}/orders';
  }

  // eslint-disable-next-line class-methods-use-this
  protected EndpointContentType(): string {
    return 'application/vnd.api+json';
  }
}

SDKConfig().RegisterResourceClass('Order', Order);
