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
  Account: { 
    entityLogicalName: 'account', 
    primaryIdField: 'accountid'
  },
  Team: { 
    entityLogicalName: 'team', 
    primaryIdField: 'teamid'
  },
  // Add more entities here as needed:
  // Contact: { entityLogicalName: 'contact', primaryIdField: 'contactid' },
  // Lead: { entityLogicalName: 'lead', primaryIdField: 'leadid' },
};

/**
 * Define lookup field mappings for each entity
 * Maps from Dataverse Web API lookup field to entity property name
 */
const LOOKUP_FIELD_MAPPINGS: Record<string, Record<string, string>> = {
  Account: {
    '_parentaccountid_value': 'parentaccountid',
  },
  Team: {
    '_createdby_value': 'createdby'
  },
  // Add more entities as needed:
  // Contact: {
  //   '_parentcustomerid_value': 'parentcustomerid',
  //   '_ownerid_value': 'ownerid',
  // },
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

    // Remove OData metadata and transform lookup fields
    const cleanData = EntityMapper.processDataverseResponse(dataverseData, entityName);

    // Set the id from the primary key field for class-transformer
    cleanData.id = cleanData[config.primaryIdField];
    cleanData.entityLogicalName = config.entityLogicalName;

    // Let class-transformer handle the mapping with @Transform decorators
    return plainToClass(entityClass, cleanData);
  }

  /**
   * Process Dataverse response by removing OData metadata and transforming lookup fields
   * @param data - Raw data from Dataverse API
   * @param entityName - Name of the entity for lookup field mapping
   * @returns Clean data with transformed lookup fields
   */
  private static processDataverseResponse(data: any, entityName: string): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const cleanData: any = {};
    
    // Remove OData metadata properties
    for (const [key, value] of Object.entries(data)) {
      // Skip OData metadata properties
      if (key.startsWith('@odata.') || key.startsWith('@Microsoft.Dynamics.CRM.')) {
        continue;
      }
      
      // Skip formatted value properties (we'll handle them in lookup transformation)
      if (key.includes('@OData.Community.Display.V1.FormattedValue')) {
        continue;
      }
      
      cleanData[key] = value;
    }
    
    // Transform lookup fields
    const lookupMappings = LOOKUP_FIELD_MAPPINGS[entityName];
    if (lookupMappings) {
      Object.entries(lookupMappings).forEach(([dataverseLookupField, entityProperty]) => {
        const lookupValue = data[dataverseLookupField];
        
        if (lookupValue) {
          const formattedValueField = `${dataverseLookupField}@OData.Community.Display.V1.FormattedValue`;
          const formattedValue = data[formattedValueField];
          
          cleanData[entityProperty] = {
            id: lookupValue,
            name: formattedValue || undefined
          };
          
          // Remove the raw lookup field since we've transformed it
          delete cleanData[dataverseLookupField];
        }
      });
    }
    
    return cleanData;
  }
}