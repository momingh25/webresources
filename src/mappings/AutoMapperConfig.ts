import { plainToClass, instanceToPlain } from 'class-transformer';
import 'reflect-metadata';

/**
 * Entity configuration for mapping
 */
interface EntityConfig {
  entityLogicalName: string;
  primaryIdField: string;
}

/**
 * Entity configurations registry
 */
const ENTITY_CONFIGS: Record<string, EntityConfig> = {
  Account: { entityLogicalName: 'account', primaryIdField: 'accountid' },
  Team: { entityLogicalName: 'team', primaryIdField: 'teamid' },
  // Add more entities here as needed:
  // Contact: { entityLogicalName: 'contact', primaryIdField: 'contactid' },
  // Lead: { entityLogicalName: 'lead', primaryIdField: 'leadid' },
};

/**
 * Mapping utilities using class-transformer
 * Provides AutoMapper-like functionality with decorators
 */
export class EntityMapper {
  
  /**
   * Maps raw Dataverse data to strongly typed entity class
   * @param entityClass - The entity class constructor
   * @param dataverseData - Raw data from Dataverse
   * @returns Strongly typed entity class instance
   */
  static mapToEntityClass<T>(entityClass: new (...args: any[]) => T, dataverseData: any): T {
    const entityName = entityClass.name;
    const config = ENTITY_CONFIGS[entityName];
    
    if (!config) {
      throw new Error(`Entity configuration not found for: ${entityName}. Please add it to ENTITY_CONFIGS.`);
    }

    return plainToClass(entityClass, {
      ...dataverseData,
      id: dataverseData[config.primaryIdField],
      entityLogicalName: config.entityLogicalName
    });
  }

  /**
   * Maps entity class instance back to Dataverse-compatible object
   * @param entityInstance - The strongly typed entity class instance
   * @returns Dataverse-compatible object
   */
  static mapToDataverseFormat<T>(entityInstance: T): any {
    const entityName = (entityInstance as any).constructor.name;
    const config = ENTITY_CONFIGS[entityName];
    
    if (!config) {
      throw new Error(`Entity configuration not found for: ${entityName}. Please add it to ENTITY_CONFIGS.`);
    }

    const plain = instanceToPlain(entityInstance);
    const result: any = { ...plain };
    
    // Map the id field back to the primary key field
    if (plain.id) {
      result[config.primaryIdField] = plain.id;
      delete result.id; // Remove the generic id field
    }
    
    return result;
  }
}