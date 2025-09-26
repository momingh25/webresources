export interface IEntity {
  id: string;
  entityLogicalName: string;
  createdon?: Date;
}

export interface IQueryOptions {
  top?: number;
  skip?: number;
  includeCount?: boolean;
  additionalOptions?: string[];
}

export interface IFetchXmlResult<T extends IEntity> {
  entities: T[];
  totalRecordCount?: number;
  moreRecords: boolean;
  pagingCookie?: string;
}

export interface IRepository<T extends IEntity> {
  fetchXml(fetchXml: string, options?: IQueryOptions): Promise<IFetchXmlResult<T>>;
  retrieveById(id: string, columnSet?: string[]): Promise<T | null>;
  retrieveMultiple(query?: string, options?: IQueryOptions): Promise<IFetchXmlResult<T>>;
  create(entity: Partial<T>): Promise<string>;
  update(id: string, entity: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
}