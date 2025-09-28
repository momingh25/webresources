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

  /**
   * Retrieve a single entity by ID using FetchXML
   * @param id - Entity ID (with or without curly braces)
   * @param columnSet - Array of column names to retrieve
   * @returns Promise with typed entity or null if not found
   */
  async retrieveByIdWithFetchXml(id: string, columnSet?: string[]): Promise<T | null> {
    try {
      const cleanId = this.cleanEntityId(id);
      
      // Build column attributes for FetchXML
      const attributes = columnSet && columnSet.length > 0 
        ? columnSet.map(col => `<attribute name="${col}" />`).join('\n            ')
        : '<all-attributes />';
      
      // Build FetchXML query
      const fetchXml = `
        <fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
          <entity name="${this.entityLogicalName}">
            ${attributes}
            <filter type="and">
              <condition attribute="${this.getPrimaryIdField()}" operator="eq" value="${cleanId}" />
            </filter>
          </entity>
        </fetch>`;
      
      console.log(`🔍 FetchXML query for ${this.entityLogicalName}:`, fetchXml);
      
      // Execute FetchXML query
      const result = await this.fetchXml(fetchXml);
      
      // Return the first entity or null if not found
      return result.entities.length > 0 ? result.entities[0] : null;
    } catch (error) {
      console.error(`Error retrieving ${this.entityLogicalName} by ID with FetchXML:`, error);
      throw new Error(`Failed to retrieve entity with FetchXML: ${error}`);
    }
  }

  /**
   * Get the primary ID field name for this entity
   * Override in derived classes if needed
   * @returns Primary ID field name
   */
  protected getPrimaryIdField(): string {
    // Default convention: entityLogicalName + 'id'
    return `${this.entityLogicalName}id`;
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