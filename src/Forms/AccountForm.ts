// Using @types/xrm - no imports needed, Xrm is globally available
import { DataverseHelpers } from "../helpers/DataverseHelpers";
import { TeamHelpers } from "../helpers/TeamHelpers";
import { accountRepository } from "../repositories";

export class AccountForm {
  static async onLoad(context: Xrm.Events.EventContext): Promise<void> {
      const formContext = context.getFormContext();
      
      // Check team membership and set name field readonly if needed
      await AccountForm.checkNameFieldAccess(context);

      await AccountForm.retrieveAccountById(formContext);
  }

  /**
   * Retrieves an account by ID and logs it to console
   * @param formContext - FormContext to get current record ID
   */
  static async retrieveAccountById(formContext: Xrm.FormContext): Promise<void> {
    try {
      // Get current record ID from FormContext
      const currentRecord = formContext.data.entity;
      const idToRetrieve = currentRecord.getId().replace(/[{}]/g, '');
      
      console.log(`\n--- Retrieving account by ID: ${idToRetrieve} ---`);
      
      // Retrieve account by ID with specific columns
      const account = await accountRepository.retrieveById(idToRetrieve, ['name', 'accountnumber', 'telephone1', 'fax', 'createdon']);
      
      if (account) {
        console.log('Account retrieved by ID (retrieveById method):', account);
        console.log('Account details from retrieveById:');
        console.log('- ID:', account.id);
        console.log('- Name:', account.name);
        console.log('- Account Number:', account.accountnumber);
        console.log('- Phone:', account.telephone1);
        console.log('- Fax:', account.fax);
        console.log('- Created On:', account.createdon);
        console.log('- Entity Type:', account.entityLogicalName);
      } else {
        console.log(`Account with ID ${idToRetrieve} not found`);
      }
    } catch (error) {
      console.error('Error retrieving account by ID:', error);
    }
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
