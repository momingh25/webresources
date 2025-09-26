// Using @types/xrm - no imports needed, Xrm is globally available
import { TeamHelpers } from "../helpers/TeamHelpers";
import { accountRepository, teamRepository } from "../repositories";

export class AccountForm {
  static async onLoad(context: Xrm.Events.EventContext): Promise<void> {
    context.getFormContext().getAttribute("websiteurl").addOnChange(AccountForm.onWebsiteChanged);
    
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
        const nameControl = formContext.getControl<Xrm.Controls.StringControl>("name");
        nameControl.setDisabled(true);
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
        const account = await accountRepository.retrieveById(accountId, ['name', 'accountnumber', 'telephone1', 'fax']);
        
        console.log('Account Data:', account);
        console.log('Account Name:', account?.name);
        console.log('Account Number:', account?.accountnumber);
        console.log('Account Telephone:', account?.telephone1);
        console.log('Account Fax:', account?.fax);
      }
    } catch (error) {
      console.error('Error validating account data:', error);
    }
  }

  static onWebsiteChanged(context: Xrm.Events.EventContext): void {
    const formContext = context.getFormContext();
    const websiteAttribute = formContext.getAttribute("websiteurl") as Xrm.Attributes.StringAttribute;
    const websiteRegex = /^(https?:\/\/)?([\w\d]+\.)?[\w\d]+\.\w+\/?.+$/g;

    let isValid = true;
    if (websiteAttribute && websiteAttribute.getValue()) {
      const match = websiteAttribute.getValue().match(websiteRegex);
      isValid = match != null;
    }

    websiteAttribute.controls.forEach((c) => {
      if (isValid) {
        (c as Xrm.Controls.StringControl).clearNotification("websiteurl");
      } else {
        (c as Xrm.Controls.StringControl).setNotification(
          "Hi, This is Invalid Website Address! Please enter a valid URL.",
          "websiteurl",
        );
      }
    });
  }
}
