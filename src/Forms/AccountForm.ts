// Using @types/xrm - no imports needed, Xrm is globally available
import { AccountAttributes } from "../constants/EntityAttributes";
import { TeamHelpers } from "../helpers/TeamHelpers";

export class AccountForm {
  static async onLoad(context: Xrm.Events.EventContext): Promise<void> {
    context.getFormContext().getAttribute(AccountAttributes.WebSiteURL).addOnChange(AccountForm.onWebsiteChanged);
    
    // Check team membership and set name field readonly if needed
    await AccountForm.checkNameFieldAccess(context);
  }

  /**
   * Checks if the current user is a member of 'Client Services' team
   * and makes the name field readonly if they are not a member
   */
  static async checkNameFieldAccess(context: Xrm.Events.EventContext): Promise<void> {
    try {
      const formContext = context.getFormContext();
      const isClientServicesMember = await TeamHelpers.isUserInTeam('Client Services');
      
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
