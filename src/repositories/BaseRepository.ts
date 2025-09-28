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
        entities
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