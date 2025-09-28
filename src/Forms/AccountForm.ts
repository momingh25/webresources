// Using @types/xrm - no imports needed, Xrm is globally available
import { DataverseHelpers } from "../helpers/DataverseHelpers";
import { TeamHelpers } from "../helpers/TeamHelpers";
import { accountRepository } from "../repositories";
import { EntityMapper } from "../mappings/AutoMapperConfig";
import { Account } from "../repositories/entities/Account";

export class AccountForm {
  static async onLoad(context: Xrm.Events.EventContext): Promise<void> {
      const formContext = context.getFormContext();
      
      // Check team membership and set name field readonly if needed
      await AccountForm.checkNameFieldAccess(context);

      await AccountForm.retrieveAccountById(formContext);
  }

  /**
   * Retrieves an account by ID and logs it to console
   * Demonstrates both generic mapping methods: mapToEntity and mapFromEntity
   * @param formContext - FormContext to get current record ID
   */
  static async retrieveAccountById(formContext: Xrm.FormContext): Promise<void> {
    try {
      // Get current record ID from FormContext
      const currentRecord = formContext.data.entity;
      const idToRetrieve = currentRecord.getId().replace(/[{}]/g, '');
      
      console.log(`\n--- Retrieving account by ID: ${idToRetrieve} ---`);
      
      // Retrieve account by ID with all Account class fields
      const account = await accountRepository.retrieveById(idToRetrieve, [
        'name', 'accountnumber', 'telephone1', 'fax', 'createdon',
        'address1_line1', 'address1_city', 'address1_stateorprovince', 
        'address1_postalcode', 'address1_country', 'websiteurl', 
        'numberofemployees', 'creditonhold', 'industrycode', 
        'ownershipcode', '_parentaccountid_value'
      ]);
      
      if (account) {
        console.log('✅ Account retrieved by ID (uses mapToEntity internally):', account);
        console.log('Account details from retrieveById:');
        console.log('- ID:', account.id);
        console.log('- Name:', account.name);
        console.log('- Account Number:', account.accountnumber);
        console.log('- Phone:', account.telephone1);
        console.log('- Fax:', account.fax);
        console.log('- Created On:', account.createdon);
        console.log('- Address Line 1:', account.address1_line1);
        console.log('- City:', account.address1_city);
        console.log('- State/Province:', account.address1_stateorprovince);
        console.log('- Postal Code:', account.address1_postalcode);
        console.log('- Country:', account.address1_country);
        console.log('- Website:', account.websiteurl);
        console.log('- Number of Employees:', account.numberofemployees);
        console.log('- Credit On Hold:', account.creditonhold);
        console.log('- Industry Code:', account.industrycode);
        console.log('- Ownership Code:', account.ownershipcode);
        console.log('- Parent Account ID:', account.parentaccountid);
        console.log('- Parent Account ID (detailed):', account.parentaccountid ? 
          `{ id: "${account.parentaccountid.id}", name: "${account.parentaccountid.name}" }` : 
          'Not set or null');
        console.log('- Entity Type:', account.entityLogicalName);

        console.log('\n🔄 --- Demonstrating mapToEntityClass Method ---');
        
        // 🎯 DEMONSTRATION: Creating a simple Dataverse-like object for testing
        console.log('🔹 Testing mapToEntityClass with mock Dataverse data:');
        const mockDataverseData = {
          accountid: account.id,
          name: account.name,
          telephone1: account.telephone1,
          entityLogicalName: 'account'
        };
        
        const mappedEntity = EntityMapper.mapToEntityClass(Account, mockDataverseData);
        console.log('✅ mapToEntityClass result:', mappedEntity);
        console.log('- Notice: accountid became id:', mappedEntity.id);
        console.log('- Name preserved:', mappedEntity.name);
        console.log('- Entity type added:', mappedEntity.entityLogicalName);
        
      } else {
        console.log(`❌ Account with ID ${idToRetrieve} not found`);
      }
    } catch (error) {
      console.error('❌ Error retrieving account by ID:', error);
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
