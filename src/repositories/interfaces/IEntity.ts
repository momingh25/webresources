export interface IEntity {
  id: string;
  entityLogicalName: string;
  createdon?: Date;
}

export interface IFetchXmlResult<T extends IEntity> {
  entities: T[];
}

export interface IRepository<T extends IEntity> {
  fetchXml(fetchXml: string): Promise<IFetchXmlResult<T>>;
}