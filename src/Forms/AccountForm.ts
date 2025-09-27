// Using @types/xrm - no imports needed, Xrm is globally available
import { DataverseHelpers } from "../helpers/DataverseHelpers";
import { TeamHelpers } from "../helpers/TeamHelpers";

export class AccountForm {
  static async onLoad(context: Xrm.Events.EventContext): Promise<void> {
      // Check team membership and set name field readonly if needed
      await AccountForm.checkNameFieldAccess(context); 
  }

  /**
   * Checks if the current user is a member of 'Client Services' team
   * and makes the name field readonly if they are not a member
   * Now uses DataverseHelpers for user context and UI notifications
   */
  static async checkNameFieldAccess(context: Xrm.Events.EventContext): Promise<void> {
    const formContext = context.getFormContext();
    
    try {
      // Use DataverseHelpers to get current user information
      const currentUser = DataverseHelpers.getCurrentUser();
      const orgSettings = DataverseHelpers.getOrgSettings();
      
      console.log(`Checking access for user: ${currentUser.userName} in org: ${orgSettings.organizationId}`);
      
      // Use TeamHelpers for cleaner team membership checking
      const isClientServicesMember = await TeamHelpers.isUserInTeam('Client Services');
      
      if (!isClientServicesMember) {
        // Directly disable field for non-members
        const nameControl = formContext.getControl<Xrm.Controls.StringControl>("name");
        nameControl.setDisabled(true);
        
        // Show informational notification
        DataverseHelpers.showNotification(
          formContext,
          "Account name field is read-only - requires 'Client Services' team membership", 
          "INFO", 
          "readonly-warning"
        );
      }
    } catch (error) {
      console.error('Error checking team membership for name field access:', error);
      DataverseHelpers.showNotification(
        formContext,
        "Error checking access permissions", 
        "ERROR", 
        "access-error"
      );
    }
  }
}
