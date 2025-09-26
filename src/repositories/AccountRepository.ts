import { BaseRepository } from './BaseRepository';
import { Account } from './entities/Account';

export class AccountRepository extends BaseRepository<Account> {
  constructor() {
    super('accounts', 'account');
  }

  protected mapFromDataverse(entity: any): Account {
    const account = new Account(entity.accountid, entity.name);
    account.createdon = this.parseDate(entity.createdon);
    account.accountnumber = entity.accountnumber;
    return account;
  }

  protected mapToDataverse(entity: Partial<Account>): any {
    const dataverseEntity: any = {};
    if (entity.name !== undefined) dataverseEntity.name = entity.name;
    if (entity.accountnumber !== undefined) dataverseEntity.accountnumber = entity.accountnumber;
    return dataverseEntity;
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
}