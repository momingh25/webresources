export * from './BaseRepository';
export * from './TeamRepository';
export * from './AccountRepository';

export * from './entities/Team';
export * from './entities/Account';

export * from './interfaces/IEntity';

import { TeamRepository } from './TeamRepository';
import { AccountRepository } from './AccountRepository';

export const teamRepository = new TeamRepository();
export const accountRepository = new AccountRepository();