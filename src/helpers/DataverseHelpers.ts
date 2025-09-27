// Dataverse Web API helpers using @types/xrm
// This file demonstrates common patterns for working with Dataverse

export class DataverseHelpers {
  
  // Get current user information
  static getCurrentUser(): Xrm.UserSettings {
    return Xrm.Utility.getGlobalContext().userSettings;
  }

  // Get organization settings
  static getOrgSettings(): Xrm.OrganizationSettings {
    return Xrm.Utility.getGlobalContext().organizationSettings;
  }

  // Show notification - requires form context
  static showNotification(
    formContext: Xrm.FormContext,
    message: string, 
    type: Xrm.FormNotificationLevel = "INFO",
    uniqueId?: string
  ): void {
    formContext.ui.setFormNotification(message, type, uniqueId);
  }

  // Clear notification - requires form context
  static clearNotification(
    formContext: Xrm.FormContext,
    uniqueId?: string
  ): void {
    if (uniqueId) {
      formContext.ui.clearFormNotification(uniqueId);
    }
  }

  // Open entity form
  static openEntityForm(
    entityName: string,
    entityId?: string,
    parameters?: any
  ) {
    const formOptions = {
      entityName: entityName,
      entityId: entityId,
      ...parameters
    };

    return Xrm.Navigation.openForm(formOptions);
  }

  // Confirm dialog
  static async confirmDialog(
    title: string,
    subtitle: string,
    text?: string
  ): Promise<boolean> {
    const confirmOptions = {
      title: title,
      subtitle: subtitle,
      text: text
    };

    const result = await Xrm.Navigation.openConfirmDialog(confirmOptions);
    return result.confirmed;
  }

  // Alert dialog
  static async alertDialog(
    text: string,
    title?: string
  ): Promise<void> {
    const alertOptions = {
      text: text,
      title: title
    };

    await Xrm.Navigation.openAlertDialog(alertOptions);
  }
}
