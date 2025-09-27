# class-transformer Deprecation Fix

## Issue
`classToPlain` function was deprecated in newer versions of class-transformer.

## Solution
Updated to use the new non-deprecated function:

### Before (Deprecated):
```typescript
import { plainToClass, classToPlain } from 'class-transformer';

static mapFromAccount(account: Account): any {
  const plain = classToPlain(account);  // ⚠️ Deprecated
  return { ... };
}
```

### After (Current):
```typescript
import { plainToClass, instanceToPlain } from 'class-transformer';

static mapFromAccount(account: Account): any {
  const plain = instanceToPlain(account);  // ✅ Current
  return { ... };
}
```

## Migration Summary

| Old Function | New Function | Purpose |
|-------------|-------------|---------|
| `classToPlain` | `instanceToPlain` | Convert class instance to plain object |
| `plainToClass` | `plainToInstance` (also available) | Convert plain object to class instance |

## Changes Made:
1. ✅ Updated import statement
2. ✅ Replaced `classToPlain()` with `instanceToPlain()` in `mapFromAccount()`  
3. ✅ Replaced `classToPlain()` with `instanceToPlain()` in `mapFromTeam()`
4. ✅ Build successful - no more deprecation warnings

## Future-Proofing:
The code now uses the current class-transformer API and will continue to work with future versions.

**Note**: `plainToClass` is still supported but may also be deprecated in future versions. If needed, it can be replaced with `plainToInstance` later.