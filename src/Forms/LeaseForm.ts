// Using @types/xrm - no imports needed, Xrm is globally available

export class LeaseForm {
  static async onLoad(context: Xrm.Events.EventContext): Promise<void> {
    console.log("LeaseForm loaded");
  }
}
