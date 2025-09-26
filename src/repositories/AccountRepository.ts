import { BaseRepository } from './BaseRepository';
import { Account } from './entities/Account';
import { IQueryOptions } from './interfaces/IEntity';

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
      const filterOperator = exactMatch ? 'eq' : 'contains';
      const escapedName = name.replace(/'/g, "''");
      const query = `$filter=${filterOperator}(name,'${escapedName}')`;

      const result = await this.retrieveMultiple(query);
      return result.entities;
    } catch (error) {
      console.error('Error finding accounts by name:', error);
      throw error;
    }
  }

  async findByAccountNumber(accountNumber: string): Promise<Account | null> {
    try {
      const escapedAccountNumber = accountNumber.replace(/'/g, "''");
      const query = `$filter=accountnumber eq '${escapedAccountNumber}'`;

      const result = await this.retrieveMultiple(query);
      return result.entities.length > 0 ? result.entities[0] : null;
    } catch (error) {
      console.error('Error finding account by account number:', error);
      throw error;
    }
  }
}