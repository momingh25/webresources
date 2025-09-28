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

  async findByName(name: string, exactMatch: boolean = false): Promise<Account[]> {
    try {
      const operator = exactMatch ? 'eq' : 'like';
      const value = exactMatch ? name.replace(/'/g, "&apos;") : `%${name.replace(/'/g, "&apos;")}%`;
      
      const fetchXml = `
        <fetch version="1.0">
          <entity name="account">
            <attribute name="accountid" />
            <attribute name="name" />
            <attribute name="accountnumber" />
            <attribute name="createdon" />
            <filter type="and">
              <condition attribute="name" operator="${operator}" value="${value}" />
            </filter>
          </entity>
        </fetch>`;

      const result = await this.fetchXml(fetchXml);
      return result.entities;
    } catch (error) {
      console.error('Error finding accounts by name:', error);
      throw error;
    }
  }

  async findByAccountNumber(accountNumber: string): Promise<Account | null> {
    try {
      const fetchXml = `
        <fetch version="1.0">
          <entity name="account">
            <attribute name="accountid" />
            <attribute name="name" />
            <attribute name="accountnumber" />
            <attribute name="createdon" />
            <filter type="and">
              <condition attribute="accountnumber" operator="eq" value="${accountNumber.replace(/'/g, "&apos;")}" />
            </filter>
          </entity>
        </fetch>`;

      const result = await this.fetchXml(fetchXml);
      return result.entities.length > 0 ? result.entities[0] : null;
    } catch (error) {
      console.error('Error finding account by account number:', error);
      throw error;
    }
  }
}