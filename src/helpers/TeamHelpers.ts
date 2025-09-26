/**
 * Team-related utility functions for Dataverse operations
 */
export class TeamHelpers {
  /**
   * Checks if the current user is a member of the specified team
   * @param teamName - The name of the team to check membership for
   * @returns Promise<boolean> - True if user is a member, false otherwise
   */
  static async isUserInTeam(teamName: string): Promise<boolean> {
    try {
      // Get current user ID
      const currentUserId = Xrm.Utility.getGlobalContext().userSettings.userId.replace(/[{}]/g, '');
      
      // Query to find the team by name and check if current user is a member
      const query = `teams?$filter=name eq '${teamName}'&$expand=teammembership_association($filter=systemuserid eq ${currentUserId})`;
      const response = await Xrm.WebApi.retrieveMultipleRecords('team', query);
      
      if (response.entities.length > 0) {
        const team = response.entities[0];
        return team.teammembership_association && team.teammembership_association.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking team membership:', error);
      return false;
    }
  }

  /**
   * Checks if a specific user is a member of the specified team
   * @param teamName - The name of the team to check membership for
   * @param userId - The ID of the user to check (without curly braces)
   * @returns Promise<boolean> - True if user is a member, false otherwise
   */
  static async isSpecificUserInTeam(teamName: string, userId: string): Promise<boolean> {
    try {
      // Remove curly braces if present
      const cleanUserId = userId.replace(/[{}]/g, '');
      
      // Query to find the team by name and check if specified user is a member
      const query = `teams?$filter=name eq '${teamName}'&$expand=teammembership_association($filter=systemuserid eq ${cleanUserId})`;
      const response = await Xrm.WebApi.retrieveMultipleRecords('team', query);
      
      if (response.entities.length > 0) {
        const team = response.entities[0];
        return team.teammembership_association && team.teammembership_association.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking team membership for specific user:', error);
      return false;
    }
  }

  /**
   * Gets all teams that the current user is a member of
   * @returns Promise<string[]> - Array of team names the user belongs to
   */
  static async getCurrentUserTeams(): Promise<string[]> {
    try {
      const currentUserId = Xrm.Utility.getGlobalContext().userSettings.userId.replace(/[{}]/g, '');
      
      // Query to get all teams where current user is a member
      const query = `teams?$expand=teammembership_association($filter=systemuserid eq ${currentUserId})&$select=name`;
      const response = await Xrm.WebApi.retrieveMultipleRecords('team', query);
      
      return response.entities
        .filter(team => team.teammembership_association && team.teammembership_association.length > 0)
        .map(team => team.name);
    } catch (error) {
      console.error('Error getting current user teams:', error);
      return [];
    }
  }

  /**
   * Checks if the current user is a member of any of the specified teams
   * @param teamNames - Array of team names to check membership for
   * @returns Promise<boolean> - True if user is a member of any team, false otherwise
   */
  static async isUserInAnyTeam(teamNames: string[]): Promise<boolean> {
    try {
      const userTeams = await TeamHelpers.getCurrentUserTeams();
      return teamNames.some(teamName => userTeams.includes(teamName));
    } catch (error) {
      console.error('Error checking membership in any team:', error);
      return false;
    }
  }
}