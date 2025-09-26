import { teamRepository } from '../repositories';

export class TeamHelpers {
  static async isUserInTeam(teamName: string): Promise<boolean> {
    try {
      const currentUserId = Xrm.Utility.getGlobalContext().userSettings.userId;
      return await teamRepository.isUserMemberOfTeam(teamName, currentUserId);
    } catch (error) {
      console.error('Error checking team membership:', error);
      return false;
    }
  }

  static async isSpecificUserInTeam(teamName: string, userId: string): Promise<boolean> {
    try {
      return await teamRepository.isUserMemberOfTeam(teamName, userId);
    } catch (error) {
      console.error('Error checking team membership for specific user:', error);
      return false;
    }
  }

  static async getCurrentUserTeams(): Promise<string[]> {
    try {
      const currentUserId = Xrm.Utility.getGlobalContext().userSettings.userId;
      const teams = await teamRepository.getTeamsForUser(currentUserId);
      return teams.map(team => team.name);
    } catch (error) {
      console.error('Error getting current user teams:', error);
      return [];
    }
  }

  static async isUserInAnyTeam(teamNames: string[]): Promise<boolean> {
    try {
      const currentUserId = Xrm.Utility.getGlobalContext().userSettings.userId;
      return await teamRepository.isUserMemberOfAnyTeam(teamNames, currentUserId);
    } catch (error) {
      console.error('Error checking membership in any team:', error);
      return false;
    }
  }

  static async getTeamByName(teamName: string): Promise<import('../repositories').Team | null> {
    try {
      return await teamRepository.findByName(teamName);
    } catch (error) {
      console.error('Error getting team by name:', error);
      return null;
    }
  }
}