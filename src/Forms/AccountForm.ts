// Using @types/xrm - no imports needed, Xrm is globally available
import { DataverseHelpers } from "../helpers/DataverseHelpers";
import { TeamHelpers } from "../helpers/TeamHelpers";
import { accountRepository, teamRepository } from "../repositories";
import { EntityMapper } from "../mappings/AutoMapperConfig";
import { Account } from "../repositories/entities/Account";

export class AccountForm {
  static async onLoad(context: Xrm.Events.EventContext): Promise<void> {
      const formContext = context.getFormContext();
      
      // Check team membership and set name field readonly if needed
      await AccountForm.checkNameFieldAccess(context);

      await AccountForm.retrieveAccountById(formContext);
      await AccountForm.retrieveTeamByName(formContext);
  }

  /**
   * Retrieves an account by ID using FetchXML and logs it to console
   * Uses FetchXML for data retrieval with proper lookup field handling
   * @param formContext - FormContext to get current record ID
   */
  static async retrieveAccountById(formContext: Xrm.FormContext): Promise<void> {
    try {

      const currentRecord = formContext.data.entity;
      const idToRetrieve = currentRecord.getId().replace(/[{}]/g, '');
      
      const account = await accountRepository.getById(idToRetrieve, [
        'name', 'accountnumber', 'telephone1', 'fax', 'createdon',
        'address1_line1', 'address1_city', 'address1_stateorprovince', 
        'address1_postalcode', 'address1_country', 'websiteurl', 
        'numberofemployees', 'creditonhold', 'industrycode', 
        'ownershipcode', 'parentaccountid'
      ]);
      
      console.log('🏢 Retrieved Account via FetchXML:', account);
    } catch (error) {
      console.error('❌ Error retrieving account by ID with FetchXML:', error);
    }
  }

  /**
   * Retrieves a team by name and logs it to console
   * Demonstrates team retrieval using FetchXML
   * @param formContext - FormContext (not used but kept for consistency)
   */
  static async retrieveTeamByName(formContext: Xrm.FormContext): Promise<void> {
    try {
      // Retrieve team by name
      const team = await teamRepository.findByName('Client Services');
      
      if (team) {
        // Demonstrate additional team functionality
        const currentUser = DataverseHelpers.getCurrentUser();
        
        // Test user membership in this specific team
        const isMember = await teamRepository.isUserMemberOfTeam('Client Services', currentUser.userId);
        
        // Test getting all teams for current user
        const userTeams = await teamRepository.getTeamsForUser(currentUser.userId);
        
      } else {
        // Team not found - could show notification if needed
      }
    } catch (error) {
      // Error already logged by repository layer if needed
    }
  }

  /**
   * Checks if the current user is a member of 'Client Services' team
   * and makes the name field readonly if they are not a member
   */
  static async checkNameFieldAccess(context: Xrm.Events.EventContext): Promise<void> {
    const formContext = context.getFormContext();
    
    try {
      const currentUser = DataverseHelpers.getCurrentUser();
      const orgSettings = DataverseHelpers.getOrgSettings();
      
      const isClientServicesMember = await TeamHelpers.isUserInTeam('Client Services');
      
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
