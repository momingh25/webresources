import { IEntity, IRepository, IQueryOptions, IFetchXmlResult } from './interfaces/IEntity';

/**
 * Base repository class that provides common CRUD operations and FetchXML execution
 * for all Dataverse entities
 */
export abstract class BaseRepository<T extends IEntity> implements IRepository<T> {
  protected readonly entitySetName: string;
  protected readonly entityLogicalName: string;

  constructor(entitySetName: string, entityLogicalName: string) {
    this.entitySetName = entitySetName;
    this.entityLogicalName = entityLogicalName;
  }

  /**
   * Execute FetchXML query and return strongly-typed entities
   * @param fetchXml - FetchXML query string
   * @param options - Query options
   * @returns Promise with typed entities
   */
  async fetchXml(fetchXml: string, options?: IQueryOptions): Promise<IFetchXmlResult<T>> {
    try {
      // Use Xrm.WebApi.retrieveMultipleRecords with fetchXml
      const query = `?fetchXml=${encodeURIComponent(fetchXml)}`;
      const response = await Xrm.WebApi.retrieveMultipleRecords(this.entityLogicalName, query);

      // Transform the raw response to strongly-typed entities
      const entities = response.entities.map(entity => this.mapFromDataverse(entity));

      return {
        entities,
        totalRecordCount: response['@Microsoft.Dynamics.CRM.totalrecordcount'],
        moreRecords: response['@Microsoft.Dynamics.CRM.morerecords'] || false,
        pagingCookie: response['@Microsoft.Dynamics.CRM.pagingcookie']
      };
    } catch (error) {
      console.error(`Error executing FetchXML for ${this.entityLogicalName}:`, error);
      throw new Error(`Failed to execute FetchXML query: ${error}`);
    }
  }

  /**
   * Retrieve a single entity by ID
   * @param id - Entity ID (with or without curly braces)
   * @param columnSet - Array of column names to retrieve
   * @returns Promise with typed entity or null if not found
   */
  async retrieveById(id: string, columnSet?: string[]): Promise<T | null> {
    try {
      const cleanId = this.cleanEntityId(id);
      const query = columnSet ? `?$select=${columnSet.join(',')}` : '';
      
      const entity = await Xrm.WebApi.retrieveRecord(this.entityLogicalName, cleanId, query);
      return this.mapFromDataverse(entity);
    } catch (error) {
      if (error.errorCode === 404) {
        return null;
      }
      console.error(`Error retrieving ${this.entityLogicalName} by ID:`, error);
      throw new Error(`Failed to retrieve entity: ${error}`);
    }
  }

  /**
   * Retrieve multiple entities with OData query
   * @param query - OData query string (without leading ?)
   * @param options - Query options
   * @returns Promise with typed entities
   */
  async retrieveMultiple(query?: string, options?: IQueryOptions): Promise<IFetchXmlResult<T>> {
    try {
      let finalQuery = '';
      const queryParams: string[] = [];

      if (query) {
        queryParams.push(query);
      }

      if (options?.top) {
        queryParams.push(`$top=${options.top}`);
      }

      if (options?.skip) {
        queryParams.push(`$skip=${options.skip}`);
      }

      if (options?.includeCount) {
        queryParams.push('$count=true');
      }

      if (options?.additionalOptions) {
        queryParams.push(...options.additionalOptions);
      }

      if (queryParams.length > 0) {
        finalQuery = `?${queryParams.join('&')}`;
      }

      const response = await Xrm.WebApi.retrieveMultipleRecords(this.entityLogicalName, finalQuery);
      
      const entities = response.entities.map(entity => this.mapFromDataverse(entity));

      return {
        entities,
        totalRecordCount: response['@odata.count'],
        moreRecords: !!response['@odata.nextLink'],
        pagingCookie: response['@odata.nextLink']
      };
    } catch (error) {
      console.error(`Error retrieving multiple ${this.entityLogicalName} records:`, error);
      throw new Error(`Failed to retrieve entities: ${error}`);
    }
  }

  /**
   * Create a new entity record
   * @param entity - Partial entity object with properties to create
   * @returns Promise with the ID of the created record
   */
  async create(entity: Partial<T>): Promise<string> {
    try {
      const dataverseEntity = this.mapToDataverse(entity);
      const createdEntity = await Xrm.WebApi.createRecord(this.entityLogicalName, dataverseEntity);
      return createdEntity.id;
    } catch (error) {
      console.error(`Error creating ${this.entityLogicalName} record:`, error);
      throw new Error(`Failed to create entity: ${error}`);
    }
  }

  /**
   * Update an existing entity record
   * @param id - Entity ID (with or without curly braces)
   * @param entity - Partial entity object with properties to update
   */
  async update(id: string, entity: Partial<T>): Promise<void> {
    try {
      const cleanId = this.cleanEntityId(id);
      const dataverseEntity = this.mapToDataverse(entity);
      await Xrm.WebApi.updateRecord(this.entityLogicalName, cleanId, dataverseEntity);
    } catch (error) {
      console.error(`Error updating ${this.entityLogicalName} record:`, error);
      throw new Error(`Failed to update entity: ${error}`);
    }
  }

  /**
   * Delete an entity record
   * @param id - Entity ID (with or without curly braces)
   */
  async delete(id: string): Promise<void> {
    try {
      const cleanId = this.cleanEntityId(id);
      await Xrm.WebApi.deleteRecord(this.entityLogicalName, cleanId);
    } catch (error) {
      console.error(`Error deleting ${this.entityLogicalName} record:`, error);
      throw new Error(`Failed to delete entity: ${error}`);
    }
  }

  /**
   * Clean entity ID by removing curly braces if present
   * @param id - Entity ID that may contain curly braces
   * @returns Clean entity ID without curly braces
   */
  protected cleanEntityId(id: string): string {
    return id.replace(/[{}]/g, '');
  }

  /**
   * Map raw Dataverse entity to strongly-typed entity
   * Override in derived classes for entity-specific mapping
   * @param entity - Raw entity from Dataverse
   * @returns Strongly-typed entity
   */
  protected abstract mapFromDataverse(entity: any): T;

  /**
   * Map strongly-typed entity to Dataverse-compatible object
   * Override in derived classes for entity-specific mapping
   * @param entity - Strongly-typed entity
   * @returns Dataverse-compatible object
   */
  protected abstract mapToDataverse(entity: Partial<T>): any;

  protected parseDate(dateString?: string): Date | undefined {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  }

  protected formatDate(date?: Date): string | undefined {
    if (!date) return undefined;
    return date.toISOString();
  }
}