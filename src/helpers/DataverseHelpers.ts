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

  // Execute Web API request
  static async executeWebApiRequest<T>(
    entitySetName: string,
    query?: string
  ): Promise<T[]> {
    const clientUrl = Xrm.Utility.getGlobalContext().getClientUrl();
    const apiVersion = "9.2";
    
    let url = `${clientUrl}/api/data/v${apiVersion}/${entitySetName}`;
    if (query) {
      url += `?${query}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.value;
  }

  // Show notification
  static showNotification(
    message: string, 
    type: Xrm.FormNotificationLevel = "INFO",
    uniqueId?: string
  ): void {
    Xrm.Page.ui.setFormNotification(message, type, uniqueId);
  }

  // Clear notification
  static clearNotification(uniqueId?: string): void {
    if (uniqueId) {
      Xrm.Page.ui.clearFormNotification(uniqueId);
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
