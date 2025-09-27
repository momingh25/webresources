import { plainToClass, instanceToPlain } from 'class-transformer';
import 'reflect-metadata';

// Import Entity classes
import { Account } from '../repositories/entities/Account';
import { Team } from '../repositories/entities/Team';

/**
 * Mapping utilities using class-transformer
 * Provides AutoMapper-like functionality with decorators
 */
export class EntityMapper {
  
  /**
   * Maps raw Dataverse data to strongly typed Account entity
   */
  static mapToAccount(dataverseData: any): Account {
    return plainToClass(Account, {
      ...dataverseData,
      id: dataverseData.accountid,
      entityLogicalName: 'account'
    });
  }

  /**
   * Maps Account entity to Dataverse-compatible object
   */
  static mapFromAccount(account: Account): any {
    const plain = instanceToPlain(account);
    return {
      accountid: plain.id,
      name: plain.name,
      accountnumber: plain.accountnumber,
      telephone1: plain.telephone1,
      fax: plain.fax,
      createdon: plain.createdon
    };
  }

  /**
   * Maps raw Dataverse data to strongly typed Team entity
   */
  static mapToTeam(dataverseData: any): Team {
    return plainToClass(Team, {
      ...dataverseData,
      id: dataverseData.teamid,
      entityLogicalName: 'team'
    });
  }

  /**
   * Maps Team entity to Dataverse-compatible object
   */
  static mapFromTeam(team: Team): any {
    const plain = instanceToPlain(team);
    return {
      teamid: plain.id,
      name: plain.name,
      createdon: plain.createdon
    };
  }

  /**
   * Generic mapping function for any entity type
   */
  static mapToEntity<T>(entityClass: new (...args: any[]) => T, dataverseData: any, idField: string): T {
    return plainToClass(entityClass, {
      ...dataverseData,
      id: dataverseData[idField]
    });
  }
}