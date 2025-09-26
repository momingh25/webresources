// Using @types/xrm - no imports needed, Xrm is globally available
import { ContactAttributes } from "../constants/EntityAttributes";

export class ContactForm {
  static async onLoad(context: Xrm.Events.EventContext): Promise<void> {
    const formContext = context.getFormContext();
    console.log("ContactForm loaded");
    
    // Example: Add validation to email field
    const emailAttribute = formContext.getAttribute(ContactAttributes.EmailAddress1);
    if (emailAttribute) {
      emailAttribute.addOnChange(ContactForm.onEmailChanged);
    }
  }
  
  static onEmailChanged(context: Xrm.Events.EventContext): void {
    const formContext = context.getFormContext();
    const emailAttribute = formContext.getAttribute(ContactAttributes.EmailAddress1) as Xrm.Attributes.StringAttribute;
    
    if (!emailAttribute || !emailAttribute.getValue()) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(emailAttribute.getValue());
    
    emailAttribute.controls.forEach((control) => {
      if (isValid) {
        (control as Xrm.Controls.StringControl).clearNotification(ContactAttributes.EmailAddress1);
      } else {
        (control as Xrm.Controls.StringControl).setNotification(
          "Please enter a valid email address TEST", 
          ContactAttributes.EmailAddress1
        );
      }
    });
  }
}
