import { BaseRepository } from './BaseRepository';
import { Team } from './entities/Team';
import { IQueryOptions } from './interfaces/IEntity';

export class TeamRepository extends BaseRepository<Team> {
  constructor() {
    super('teams', 'team');
  }

  protected mapFromDataverse(entity: any): Team {
    const team = new Team(entity.teamid, entity.name);
    team.createdon = this.parseDate(entity.createdon);
    return team;
  }

  protected mapToDataverse(entity: Partial<Team>): any {
    const dataverseEntity: any = {};
    if (entity.name !== undefined) dataverseEntity.name = entity.name;
    return dataverseEntity;
  }

  async findByName(teamName: string): Promise<Team | null> {
    try {
      const query = `$filter=name eq '${teamName.replace(/'/g, "''")}'`;
      const result = await this.retrieveMultiple(query);
      return result.entities.length > 0 ? result.entities[0] : null;
    } catch (error) {
      console.error('Error finding team by name:', error);
      throw error;
    }
  }

  async isUserMemberOfTeam(teamName: string, userId: string): Promise<boolean> {
    try {
      const cleanUserId = this.cleanEntityId(userId);
      const query = `$filter=name eq '${teamName.replace(/'/g, "''")}'&$expand=teammembership_association($filter=systemuserid eq ${cleanUserId})`;
      
      const result = await this.retrieveMultiple(query);
      
      if (result.entities.length === 0) {
        return false;
      }

      const team = result.entities[0];
      return !!(team as any).teammembership_association && (team as any).teammembership_association.length > 0;
    } catch (error) {
      console.error('Error checking team membership:', error);
      return false;
    }
  }

  async getTeamsForUser(userId: string): Promise<Team[]> {
    try {
      const cleanUserId = this.cleanEntityId(userId);
      const query = `$expand=teammembership_association($filter=systemuserid eq ${cleanUserId})&$select=teamid,name`;
      
      const result = await this.retrieveMultiple(query);
      
      return result.entities.filter(team => 
        (team as any).teammembership_association && (team as any).teammembership_association.length > 0
      );
    } catch (error) {
      console.error('Error getting teams for user:', error);
      throw error;
    }
  }

  async isUserMemberOfAnyTeam(teamNames: string[], userId: string): Promise<boolean> {
    try {
      if (teamNames.length === 0) return false;

      const cleanUserId = this.cleanEntityId(userId);
      const teamNameFilter = teamNames
        .map(name => `name eq '${name.replace(/'/g, "''")}'`)
        .join(' or ');

      const query = `$filter=(${teamNameFilter})&$expand=teammembership_association($filter=systemuserid eq ${cleanUserId})`;
      
      const result = await this.retrieveMultiple(query);
      
      return result.entities.some(team => 
        (team as any).teammembership_association && (team as any).teammembership_association.length > 0
      );
    } catch (error) {
      console.error('Error checking membership in any team:', error);
      return false;
    }
  }
}