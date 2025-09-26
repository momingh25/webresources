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

  static async getTeamByName(teamName: string): Promise<import('../repositories').Team | null> {
    try {
      return await teamRepository.findByName(teamName);
    } catch (error) {
      console.error('Error getting team by name:', error);
      return null;
    }
  }
}