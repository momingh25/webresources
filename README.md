# Repository Pattern Implementation

This document provides examples and best practices for using the simplified repository pattern in your Dataverse web resources project.

## Overview

The repository pattern provides a consistent, strongly-typed interface for accessing Dataverse entities with minimal overhead. 

**Core Interfaces:**
- `IEntity`: Basic entity with id, entityLogicalName, createdon
- `IFetchXmlResult<T>`: Simple result wrapper containing only entities array
- `IRepository<T>`: Repository contract with fetchXml and retrieveById methods only

## Quick Start

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

## Entity Classes

### Team Entity
```typescript
export class Team implements IEntity {
  id: string;
  entityLogicalName: string = 'team';
  createdon?: Date;
  name: string;
}
```

### Account Entity
```typescript
export class Account implements IEntity {
  id: string;
  entityLogicalName: string = 'account';
  createdon?: Date;
  name: string;
  accountnumber?: string;
}
```

## Repository Examples

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

## Form Integration

```typescript
import { teamRepository } from '../repositories';

export class AccountForm {
  static async onLoad(context: Xrm.Events.EventContext): Promise<void> {
    // Check team membership using repository
    const currentUserId = Xrm.Utility.getGlobalContext().userSettings.userId;
    const isClientServicesMember = await teamRepository.isUserMemberOfTeam('Client Services', currentUserId);
    
    if (!isClientServicesMember) {
      // Apply restrictions
    }
  }
}
```

## Updated TeamHelpers

The existing `TeamHelpers` class now uses the repository pattern internally:

```typescript
import { TeamHelpers } from '../helpers/TeamHelpers';

// Existing methods still work
const isMember = await TeamHelpers.isUserInTeam('Team Name');
const userTeams = await TeamHelpers.getCurrentUserTeams();

// New repository-based method
const team = await TeamHelpers.getTeamByName('Team Name');
```

## Best Practices

1. **Use Singleton Instances**
   ```typescript
   import { teamRepository } from '../repositories';
   ```

2. **Handle Async Operations**
   ```typescript
   const [team, account] = await Promise.all([
     teamRepository.findByName('Team A'),
     accountRepository.findByAccountNumber('ACC-001')
   ]);
   ```

3. **Error Handling**
   ```typescript
   try {
     const team = await teamRepository.findByName('Non-existent Team');
     // team will be null if not found
   } catch (error) {
     console.error('Repository operation failed:', error);
   }
   ```