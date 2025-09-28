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
 * Maps from Dataverse lookup field to entity property name
 */
const LOOKUP_FIELD_MAPPINGS: Record<string, Record<string, string>> = {
  Account: {
    '_parentaccountid_value': 'parentaccountid',
    // Add more lookup fields as needed:
    // '_primarycontactid_value': 'primarycontactid',
    // '_ownerid_value': 'ownerid',
  },
  Team: {
    // Add Team lookup fields as needed:
    // '_businessunitid_value': 'businessunitid',
  },
  // Add more entities as needed:
  // Contact: {
  //   '_parentcustomerid_value': 'parentcustomerid',
  //   '_ownerid_value': 'ownerid',
  // },
};

/**
 * Define allowed properties for each entity class
 * This ensures only properties defined in the class are mapped
 */
const ENTITY_PROPERTIES: Record<string, string[]> = {
  Account: [
    'id', 'entityLogicalName', 'name', 'accountnumber', 
    'telephone1', 'fax', 'createdon', 'address1_line1',
    'address1_city', 'address1_stateorprovince', 'address1_postalcode',
    'address1_country', 'websiteurl', 'numberofemployees', 
    'creditonhold', 'industrycode', 'ownershipcode', 'parentaccountid',
    '_parentaccountid_value', '_parentaccountid_value@OData.Community.Display.V1.FormattedValue'
  ],
  Team: [
    'id', 'entityLogicalName', 'name', 'createdon'
  ],
  // Add more as needed:
  // Contact: ['id', 'entityLogicalName', 'firstname', 'lastname', 'emailaddress1', 'createdon'],
  // Lead: ['id', 'entityLogicalName', 'firstname', 'lastname', 'companyname', 'createdon'],
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

    // Filter out OData metadata properties
    const cleanData = EntityMapper.removeODataProperties(dataverseData);

    // Get only the properties that exist in the target entity class
    const filteredData = EntityMapper.filterToClassProperties(entityClass, cleanData, config);

    return plainToClass(entityClass, filteredData);
  }

  /**
   * Removes OData metadata properties from Dataverse response
   * @param data - Raw data from Dataverse API
   * @returns Clean data without OData properties
   */
  private static removeODataProperties(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const cleanData: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      // Skip general OData metadata properties but preserve lookup formatted values
      if (key.startsWith('@odata.') || key.startsWith('@Microsoft.Dynamics.CRM.')) {
        continue;
      }
      
      // Preserve formatted values for lookup fields (they're needed for transformation)
      if (key.includes('@OData.Community.Display.V1.FormattedValue')) {
        cleanData[key] = value;
        continue;
      }
      
      cleanData[key] = value;
    }
    
    console.log('🧹 Cleaned data after removing OData properties:', cleanData);
    return cleanData;
  }

  /**
   * Filters data to only include properties that exist in the target entity class
   * @param entityClass - The entity class constructor
   * @param data - Clean data from Dataverse
   * @param config - Entity configuration
   * @returns Data with only class properties
   */
  private static filterToClassProperties<T>(
    entityClass: new (...args: any[]) => T, 
    data: any, 
    config: EntityConfig
  ): any {
    const entityName = entityClass.name;
    const allowedProperties = ENTITY_PROPERTIES[entityName];
    
    if (!allowedProperties) {
      throw new Error(`Entity properties not defined for: ${entityName}. Please add it to ENTITY_PROPERTIES.`);
    }
    
    console.log(`🔍 ${entityName} allowed properties:`, allowedProperties);
    
    const filteredData: any = {
      // Always set the id from the primary key field
      id: data[config.primaryIdField],
      entityLogicalName: config.entityLogicalName
    };
    
    // Only include properties that are in the allowed list
    for (const [key, value] of Object.entries(data)) {
      if (allowedProperties.includes(key)) {
        filteredData[key] = value;
        console.log(`✅ Including property: ${key} = ${value}`);
      } else {
        console.log(`❌ Excluding property: ${key}`);
      }
    }
    
    // Generic handling for all lookup fields
    const lookupMappings = LOOKUP_FIELD_MAPPINGS[entityName];
    console.log(`🔍 Lookup mappings for ${entityName}:`, lookupMappings);
    
    if (lookupMappings) {
      Object.entries(lookupMappings).forEach(([dataverseLookupField, entityProperty]) => {
        console.log(`🔍 Checking lookup field: ${dataverseLookupField} → ${entityProperty}`);
        console.log(`🔍 Raw data has ${dataverseLookupField}:`, data[dataverseLookupField]);
        console.log(`🔍 Filtered data has ${dataverseLookupField}:`, filteredData[dataverseLookupField]);
        
        // Check both raw data and filtered data
        const lookupValue = data[dataverseLookupField] || filteredData[dataverseLookupField];
        
        if (lookupValue) {
          const formattedValueField = `${dataverseLookupField}@OData.Community.Display.V1.FormattedValue`;
          const formattedValue = data[formattedValueField] || filteredData[formattedValueField];
          
          filteredData[entityProperty] = {
            id: lookupValue,
            name: formattedValue || undefined
          };
          
          console.log(`🔗 Transformed lookup: ${entityProperty} =`, filteredData[entityProperty]);
          
          // Remove the raw lookup fields since we've transformed them
          delete filteredData[dataverseLookupField];
          delete filteredData[formattedValueField];
        } else {
          console.log(`❌ No value found for lookup field: ${dataverseLookupField}`);
        }
      });
    }
    
    return filteredData;
  }
}