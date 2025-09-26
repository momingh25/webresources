import { BaseRepository } from './BaseRepository';
import { Team } from './entities/Team';

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
      const fetchXml = `
        <fetch version="1.0">
          <entity name="team">
            <attribute name="teamid" />
            <attribute name="name" />
            <attribute name="createdon" />
            <filter type="and">
              <condition attribute="name" operator="eq" value="${teamName.replace(/'/g, "&apos;")}" />
            </filter>
          </entity>
        </fetch>`;

      const result = await this.fetchXml(fetchXml);
      return result.entities.length > 0 ? result.entities[0] : null;
    } catch (error) {
      console.error('Error finding team by name:', error);
      throw error;
    }
  }

  async isUserMemberOfTeam(teamName: string, userId: string): Promise<boolean> {
    try {
      const cleanUserId = this.cleanEntityId(userId);
      const fetchXml = `
        <fetch version="1.0">
          <entity name="team">
            <attribute name="teamid" />
            <attribute name="name" />
            <filter type="and">
              <condition attribute="name" operator="eq" value="${teamName.replace(/'/g, "&apos;")}" />
            </filter>
            <link-entity name="teammembership" from="teamid" to="teamid" intersect="true">
              <link-entity name="systemuser" from="systemuserid" to="systemuserid">
                <filter type="and">
                  <condition attribute="systemuserid" operator="eq" value="${cleanUserId}" />
                </filter>
              </link-entity>
            </link-entity>
          </entity>
        </fetch>`;
      
      const result = await this.fetchXml(fetchXml);
      return result.entities.length > 0;
    } catch (error) {
      console.error('Error checking team membership:', error);
      return false;
    }
  }

  async getTeamsForUser(userId: string): Promise<Team[]> {
    try {
      const cleanUserId = this.cleanEntityId(userId);
      const fetchXml = `
        <fetch version="1.0">
          <entity name="team">
            <attribute name="teamid" />
            <attribute name="name" />
            <attribute name="createdon" />
            <link-entity name="teammembership" from="teamid" to="teamid" intersect="true">
              <link-entity name="systemuser" from="systemuserid" to="systemuserid">
                <filter type="and">
                  <condition attribute="systemuserid" operator="eq" value="${cleanUserId}" />
                </filter>
              </link-entity>
            </link-entity>
          </entity>
        </fetch>`;
      
      const result = await this.fetchXml(fetchXml);
      return result.entities;
    } catch (error) {
      console.error('Error getting teams for user:', error);
      throw error;
    }
  }

  async isUserMemberOfAnyTeam(teamNames: string[], userId: string): Promise<boolean> {
    try {
      if (teamNames.length === 0) return false;

      const cleanUserId = this.cleanEntityId(userId);
      const teamConditions = teamNames
        .map(name => `<condition attribute="name" operator="eq" value="${name.replace(/'/g, "&apos;")}" />`)
        .join('');

      const fetchXml = `
        <fetch version="1.0">
          <entity name="team">
            <attribute name="teamid" />
            <attribute name="name" />
            <filter type="or">
              ${teamConditions}
            </filter>
            <link-entity name="teammembership" from="teamid" to="teamid" intersect="true">
              <link-entity name="systemuser" from="systemuserid" to="systemuserid">
                <filter type="and">
                  <condition attribute="systemuserid" operator="eq" value="${cleanUserId}" />
                </filter>
              </link-entity>
            </link-entity>
          </entity>
        </fetch>`;
      
      const result = await this.fetchXml(fetchXml);
      return result.entities.length > 0;
    } catch (error) {
      console.error('Error checking membership in any team:', error);
      return false;
    }
  }
}