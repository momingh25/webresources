// Using @types/xrm - no imports needed, Xrm is globally available
import { DataverseHelpers } from "../helpers/DataverseHelpers";
import { TeamHelpers } from "../helpers/TeamHelpers";
import { accountRepository, teamRepository } from "../repositories";

export class AccountForm {
  static async onLoad(context: Xrm.Events.EventContext): Promise<void> {
      const formContext = context.getFormContext();
      
      // Check team membership and set name field readonly if needed
      await AccountForm.checkNameFieldAccess(context);

      await AccountForm.retrieveAccountById(formContext);
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

        // Auto-clear the notification after 10 seconds
        setTimeout(() => {
          DataverseHelpers.clearNotification(formContext, "readonly-warning");
        }, 10000);
      }
    } catch (error) {
      DataverseHelpers.showNotification(
        formContext,
        "Error checking access permissions", 
        "ERROR", 
        "access-error"
      );

      // Auto-clear the error notification after 10 seconds
      setTimeout(() => {
        DataverseHelpers.clearNotification(formContext, "access-error");
      }, 10000);
    }
  }
}
