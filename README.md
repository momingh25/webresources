# Dataverse Web Resources - TypeScript Repository Pattern

A modern, strongly-typed TypeScript implementation for Microsoft Dataverse web resources using the Repository Pattern with automatic entity mapping.

## 🚀 Features

- **Repository Pattern**: Clean separation of data access logic
- **Automatic Entity Mapping**: Using class-transformer for seamless data transformation
- **FetchXML Support**: Native Dataverse query language integration
- **Strong Typing**: Full TypeScript support with entity classes
- **Modern API**: Updated to use current Dataverse APIs (no deprecated methods)
- **Helper Utilities**: Comprehensive UI and context management helpers

## 📚 Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Entity Classes](#entity-classes)
- [Repository Examples](#repository-examples)
- [Auto-Mapping Implementation](#auto-mapping-implementation)
- [Helper Integration](#helper-integration)
- [Form Integration](#form-integration)
- [Best Practices](#best-practices)
- [Migration Notes](#migration-notes)

## 🏃‍♂️ Quick Start

### Using Repository Singletons

```typescript
import { teamRepository, accountRepository } from '../repositories';

// Get a team by name
const team = await teamRepository.findByName('Client Services');
if (team) {
  console.log(`Team: ${team.name}, Created: ${team.createdon}`);
}

// Get accounts by name
const accounts = await accountRepository.findByName('Contoso');
accounts.forEach(account => {
  console.log(`Account: ${account.name}, Number: ${account.accountnumber}`);
});
```

## 🏗️ Architecture

The project follows a clean architecture with distinct layers:

```
┌─────────────────────┐
│   AccountForm.ts    │  ← Form orchestration layer
│   (Event Handlers)  │
└─────────────────────┘
           │
    ┌─────────┴─────────┐
    │                   │
┌───▼────────────┐ ┌───▼──────────────┐
│ Repositories   │ │ DataverseHelpers │
│ (Data Access)  │ │ (UI & Context)   │
└────────────────┘ └──────────────────┘
    │                   │
┌───▼────────────┐ ┌───▼──────────────┐
│ Xrm.WebApi     │ │ Xrm.Navigation   │
│ FetchXML       │ │ Xrm.Page.ui      │
│ Strong Types   │ │ Xrm.Utility      │
└────────────────┘ └──────────────────┘
```

**Core Interfaces:**
- `IEntity`: Basic entity with id, entityLogicalName, createdon
- `IFetchXmlResult<T>`: Simple result wrapper containing only entities array
- `IRepository<T>`: Repository contract with fetchXml and retrieveById methods

## 📝 Entity Classes

### Team Entity
```typescript
export class Team implements IEntity {
  id: string;
  entityLogicalName: string = 'team';
  createdon?: Date;
  name: string;
}
```

### Account Entity with Auto-Mapping
```typescript
import { Transform } from 'class-transformer';
import { IEntity } from '../interfaces/IEntity';

export class Account implements IEntity {
  @Transform(({ obj }) => obj.accountid || obj.id)
  id: string;
  
  entityLogicalName: string = 'account';
  
  @Transform(({ value }) => value ? new Date(value) : undefined)
  createdon?: Date;

  name: string;
  accountnumber?: string;
  telephone1?: string;
  fax?: string;
  address1_line1?: string;
  address1_city?: string;
  address1_stateorprovince?: string;
  address1_postalcode?: string;
  address1_country?: string;
  websiteurl?: string;
  numberofemployees?: number;
  creditonhold?: boolean;
  industrycode?: number
  ownershipcode?: number;
  
  parentaccountid?: { id: string; name?: string };

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
```

## 🔄 Repository Examples

### Team Repository
```typescript
// Find team by name
const team = await teamRepository.findByName('Development Team');

// Check if user is member of team
const isMember = await teamRepository.isUserMemberOfTeam('Development Team', 'user-id');

// Get all teams for a user
const userTeams = await teamRepository.getTeamsForUser('user-id');

// Check if user is member of any specified teams
const isMemberOfAny = await teamRepository.isUserMemberOfAnyTeam(['Team A', 'Team B'], 'user-id');
```

### Account Repository
```typescript
// Find accounts by name (partial match)
const accounts = await accountRepository.findByName('Contoso', false);

// Find account by exact name
const exactAccount = await accountRepository.findByName('Contoso Ltd', true);

// Find account by account number
const account = await accountRepository.findByAccountNumber('ACC-001');

// Get account by ID with specific fields
const account = await accountRepository.getById(idToRetrieve, [
  'name', 'accountnumber', 'telephone1', 'fax', 'createdon',
  'address1_line1', 'address1_city', 'parentaccountid'
]);
```

### FetchXML Support
```typescript
const fetchXml = `
  <fetch version="1.0">
    <entity name="team">
      <attribute name="teamid" />
      <attribute name="name" />
      <filter type="and">
        <condition attribute="teamtype" operator="eq" value="0" />
      </filter>
    </entity>
  </fetch>`;

const result = await teamRepository.fetchXml(fetchXml);
console.log('Teams:', result.entities);
```

## ⚙️ Auto-Mapping Implementation

### The Problem: Manual Mapping Was Tedious

Before implementing auto-mapping, repositories required tedious manual transformation:

```typescript
// ❌ Before (Manual Mapping)
protected mapFromDataverse(entity: any): Account {
  const account = new Account(entity.accountid, entity.name);
  account.createdon = this.parseDate(entity.createdon);
  account.accountnumber = entity.accountnumber;
  account.telephone1 = entity.telephone1;
  account.fax = entity.fax;
  return account;
}
```

### The Solution: class-transformer

We implemented **class-transformer** - a lightweight, decorator-based solution:

| Library | Size | Features | .NET AutoMapper Similarity |
|---------|------|----------|----------------------------|
| **class-transformer** ✅ | ~50KB | Decorator-based transformation | 75% - Similar patterns |
| @automapper/core + classes | ~110KB | Full AutoMapper-like API | 95% - Exact match |
| object-mapper | ~5KB | Simple object mapping | 40% - Basic mapping only |
| mapped-types | ~0KB | TypeScript utility types | 20% - Compile-time only |

### Centralized EntityMapper

```typescript
import { plainToClass, instanceToPlain } from 'class-transformer';

export class EntityMapper {
  
  /**
   * Maps raw Dataverse data to strongly typed entity class
   */
  static mapToEntityClass<T>(entityClass: new (...args: any[]) => T, dataverseData: any): T {
    const entityName = entityClass.name;
    const config = ENTITY_CONFIGS[entityName];
    
    if (!config) {
      throw new Error(`Entity configuration not found for: ${entityName}`);
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
   */
  private static processDataverseResponse(data: any, entityName: string): any {
    // Remove OData metadata properties and transform lookup fields
    const cleanData: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith('@odata.') || key.startsWith('@Microsoft.Dynamics.CRM.')) {
        continue; // Skip OData metadata
      }
      cleanData[key] = value;
    }
    
    // Transform lookup fields (e.g., _parentaccountid_value to parentaccountid object)
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
          
          delete cleanData[dataverseLookupField];
        }
      });
    }
    
    return cleanData;
  }
}
```

## 🛠️ Helper Integration

### DataverseHelpers Modernization

The `DataverseHelpers` class has been modernized to remove deprecated APIs:

#### ❌ Before (Deprecated):
```typescript
// Used deprecated Xrm.Page
static showNotification(message: string, type: Xrm.FormNotificationLevel = "INFO"): void {
  Xrm.Page.ui.setFormNotification(message, type);
}
```

#### ✅ After (Modern):
```typescript
// Uses form context parameter
static showNotification(
  formContext: Xrm.FormContext,
  message: string, 
  type: Xrm.FormNotificationLevel = "INFO",
  uniqueId?: string
): void {
  formContext.ui.setFormNotification(message, type, uniqueId);
}
```

### Key Helper Methods

```typescript
import { DataverseHelpers } from '../helpers/DataverseHelpers';

// Get current user information
const currentUser = DataverseHelpers.getCurrentUser();

// Show user notifications
DataverseHelpers.showNotification(formContext, "Account loaded successfully", "INFO");

// Navigation helpers
await DataverseHelpers.openForm(formContext, "account", recordId);

// Confirmation dialogs
const confirmed = await DataverseHelpers.confirmDialog("Save changes?", "Confirm");
```

## 📋 Form Integration

```typescript
import { teamRepository, accountRepository } from '../repositories';
import { DataverseHelpers } from '../helpers/DataverseHelpers';

export class AccountForm {
  static async onLoad(context: Xrm.Events.EventContext): Promise<void> {
    const formContext = context.getFormContext();
    
    // Show loading notification
    DataverseHelpers.showNotification(formContext, "Loading account form...", "INFO", "loading");
    
    try {
      // Check team membership using repository
      await AccountForm.checkNameFieldAccess(context);
      
      // Load account data
      await AccountForm.retrieveAccountById(formContext);
      
      // Clear loading notification
      DataverseHelpers.clearNotification(formContext, "loading");
      
    } catch (error) {
      DataverseHelpers.showNotification(
        formContext,
        "Error loading form", 
        "ERROR", 
        "load-error"
      );
    }
  }

  static async checkNameFieldAccess(context: Xrm.Events.EventContext): Promise<void> {
    const formContext = context.getFormContext();
    
    try {
      const currentUser = DataverseHelpers.getCurrentUser();
      const isClientServicesMember = await teamRepository.isUserMemberOfTeam(
        'Client Services', 
        currentUser.userId
      );
      
      if (!isClientServicesMember) {
        const nameControl = formContext.getControl<Xrm.Controls.StringControl>("name");
        nameControl.setDisabled(true);
        
        DataverseHelpers.showNotification(
          formContext,
          "Account name field is read-only - requires 'Client Services' team membership", 
          "INFO", 
          "readonly-warning"
        );
      }
    } catch (error) {
      DataverseHelpers.showNotification(
        formContext,
        "Error checking access permissions", 
        "ERROR", 
        "access-error"
      );
    }
  }
}
```

### Updated TeamHelpers

The existing `TeamHelpers` class now uses the repository pattern internally:

```typescript
import { TeamHelpers } from '../helpers/TeamHelpers';

// Existing methods still work
const isMember = await TeamHelpers.isUserInTeam('Team Name');
const userTeams = await TeamHelpers.getCurrentUserTeams();

// New repository-based method
const team = await TeamHelpers.getTeamByName('Team Name');
```

## ✨ Best Practices

### 1. Use Singleton Instances
```typescript
import { teamRepository, accountRepository } from '../repositories';
```

### 2. Handle Async Operations
```typescript
const [team, account] = await Promise.all([
  teamRepository.findByName('Team A'),
  accountRepository.findByAccountNumber('ACC-001')
]);
```

### 3. Error Handling
```typescript
try {
  const team = await teamRepository.findByName('Non-existent Team');
  // team will be null if not found
} catch (error) {
  console.error('Repository operation failed:', error);
}
```

### 4. Form Context Management
```typescript
// Always pass form context to helpers
DataverseHelpers.showNotification(formContext, message, type, uniqueId);

// Not the deprecated way
// Xrm.Page.ui.setFormNotification(message); // ❌ Don't use
```

## 🔄 Migration Notes

### class-transformer Deprecation Fix

The project has been updated to use current class-transformer APIs:

| Old Function (Deprecated) | New Function (Current) | Purpose |
|--------------------------|----------------------|---------|
| `classToPlain` | `instanceToPlain` | Convert class instance to plain object |
| `plainToClass` | `plainToClass` (still current) | Convert plain object to class instance |

```typescript
// ✅ Current implementation
import { plainToClass, instanceToPlain } from 'class-transformer';

static mapFromAccount(account: Account): any {
  const plain = instanceToPlain(account);  // ✅ Current API
  return { ... };
}
```

### Bundle Optimization

- **Before**: 417 KiB with manual mapping and unused functions
- **After**: 379 KiB with auto-mapping and cleaned code
- **Savings**: 38 KiB (9% reduction) through code cleanup and optimization

## 🚀 Build and Development

```bash
# Install dependencies
npm install

# Build for development
npm run build

# Build for production
npm run build:prod
```

## 📁 Project Structure

```
src/
├── Forms/
│   └── AccountForm.ts          # Form event handlers
├── helpers/
│   ├── DataverseHelpers.ts     # UI and context utilities
│   └── TeamHelpers.ts          # Team-specific helpers
├── mappings/
│   └── AutoMapperConfig.ts     # Entity mapping configuration
└── repositories/
    ├── index.ts                # Repository exports
    ├── BaseRepository.ts       # Base repository implementation
    ├── AccountRepository.ts    # Account-specific repository
    ├── TeamRepository.ts       # Team-specific repository
    ├── entities/
    │   ├── Account.ts          # Account entity class
    │   └── Team.ts             # Team entity class
    └── interfaces/
        ├── IEntity.ts          # Base entity interface
        └── IRepository.ts      # Repository interface
```

---

*This project demonstrates modern TypeScript practices for Microsoft Dataverse web resources with clean architecture, strong typing, and automatic entity mapping.*