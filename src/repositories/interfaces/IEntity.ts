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
}

export interface IRepository<T extends IEntity> {
  fetchXml(fetchXml: string, options?: IQueryOptions): Promise<IFetchXmlResult<T>>;
  retrieveById(id: string, columnSet?: string[]): Promise<T | null>;
}