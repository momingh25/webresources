// Using @types/xrm - no imports needed, Xrm is globally available
import { AccountAttributes } from "../constants/EntityAttributes";
import { TeamHelpers } from "../helpers/TeamHelpers";
import { accountRepository, teamRepository } from "../repositories";

export class AccountForm {
  static async onLoad(context: Xrm.Events.EventContext): Promise<void> {
    context.getFormContext().getAttribute(AccountAttributes.WebSiteURL).addOnChange(AccountForm.onWebsiteChanged);
    
    // Check team membership and set name field readonly if needed
    await AccountForm.checkNameFieldAccess(context);
    
    // Additional repository-based validations
    await AccountForm.validateAccountData(context);
  }

  /**
   * Checks if the current user is a member of 'Client Services' team
   * and makes the name field readonly if they are not a member
   * Now uses the repository pattern for improved team membership checking
   */
  static async checkNameFieldAccess(context: Xrm.Events.EventContext): Promise<void> {
    try {
      const formContext = context.getFormContext();
      const currentUserId = Xrm.Utility.getGlobalContext().userSettings.userId;
      
      // Use repository pattern directly for more flexibility
      const isClientServicesMember = await teamRepository.isUserMemberOfTeam('Client Services', currentUserId);
      
      if (!isClientServicesMember) {
        const nameAttribute = formContext.getAttribute(AccountAttributes.Name);
        if (nameAttribute) {
          nameAttribute.controls.forEach((control) => {
            control.setDisabled(true);
          });
        }
      }
    } catch (error) {
      console.error('Error checking team membership for name field access:', error);
    }
  }

  /**
   * Validates account data using the repository pattern
   * Demonstrates retrieving account data and performing business logic
   */
  static async validateAccountData(context: Xrm.Events.EventContext): Promise<void> {
    try {
      const formContext = context.getFormContext();
      const accountId = formContext.data.entity.getId();
      
      if (accountId) {
        // Use repository to get strongly-typed account entity
        const account = await accountRepository.retrieveById(accountId, ['name', 'accountnumber']);
        
        if (account) {
          console.log(`Loaded account: ${account.name} (ID: ${account.id})`);
          
          // Check for duplicate account numbers if account number exists
          if (account.accountnumber) {
            const duplicateAccount = await accountRepository.findByAccountNumber(account.accountnumber);
            if (duplicateAccount && duplicateAccount.id !== account.id) {
              console.warn(`Potential duplicate found: Account ${duplicateAccount.name} has the same account number`);
            }
          }
          
          // Example: Find related accounts with similar names
          if (account.name.length > 3) {
            const similarAccounts = await accountRepository.findByName(account.name.substring(0, 3), false);
            const relatedAccounts = similarAccounts.filter(a => a.id !== account.id);
            
            if (relatedAccounts.length > 0) {
              console.log(`Found ${relatedAccounts.length} related accounts with similar names`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error validating account data:', error);
    }
  }

  static onWebsiteChanged(context: Xrm.Events.EventContext): void {
    const formContext = context.getFormContext();
    const websiteAttribute = formContext.getAttribute(AccountAttributes.WebSiteURL) as Xrm.Attributes.StringAttribute;
    const websiteRegex = /^(https?:\/\/)?([\w\d]+\.)?[\w\d]+\.\w+\/?.+$/g;

    let isValid = true;
    if (websiteAttribute && websiteAttribute.getValue()) {
      const match = websiteAttribute.getValue().match(websiteRegex);
      isValid = match != null;
    }

    websiteAttribute.controls.forEach((c) => {
      if (isValid) {
        (c as Xrm.Controls.StringControl).clearNotification(AccountAttributes.WebSiteURL);
      } else {
        (c as Xrm.Controls.StringControl).setNotification(
          "Hi, This is Invalid Website Address!",
          AccountAttributes.WebSiteURL,
        );
      }
    });
  }
}
