export * from '../repositories/BaseRepository';
export * from '../repositories/TeamRepository';
export * from '../repositories/AccountRepository';

export * from './entities/Team';
export * from './entities/Account';

export * from './interfaces/IEntity';

import { TeamRepository } from './TeamRepository';
import { AccountRepository } from '../repositories/AccountRepository';

export const teamRepository = new TeamRepository();
export const accountRepository = new AccountRepository();