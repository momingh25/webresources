import { BaseRepository } from './BaseRepository';
import { Account } from './entities/Account';
import { EntityMapper } from '../mappings/AutoMapperConfig';

export class AccountRepository extends BaseRepository<Account> {
  constructor() {
    super('accounts', 'account');
  }

  protected mapFromDataverse(entity: any): Account {
    // Use the new clear method name: Dataverse data → Entity class
    return EntityMapper.mapToEntityClass(Account, entity);
  }

  /**
   * Retrieve a single account by ID
   * @param id - Account ID (with or without curly braces)
   * @param columnSet - Array of column names to retrieve
   * @returns Promise with Account entity or null if not found
   */
  async getById(id: string, columnSet?: string[]): Promise<Account | null> {
    try {
      const cleanId = id.replace(/[{}]/g, '');
      
      // Build column attributes for FetchXML - Account specific
      const attributes = columnSet && columnSet.length > 0 
        ? columnSet.map(col => `<attribute name="${col}" />`).join('\n            ')
        : '<all-attributes />';
      
      // Build FetchXML query specifically for Account entity
      const fetchXml = `
        <fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
          <entity name="account">
            ${attributes}
            <filter type="and">
              <condition attribute="accountid" operator="eq" value="${cleanId}" />
            </filter>
          </entity>
        </fetch>`;
      
      // Execute FetchXML query using base class method
      const result = await this.fetchXml(fetchXml);
      
      // Return the first account or null if not found
      return result.entities.length > 0 ? result.entities[0] : null;
    } catch (error) {
      console.error(`Error retrieving Account by ID with FetchXML:`, error);
      throw new Error(`Failed to retrieve Account with FetchXML: ${error}`);
    }
  }
}