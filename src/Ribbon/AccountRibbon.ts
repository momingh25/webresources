/* eslint-disable camelcase */
import { DataverseHelpers } from "../helpers/DataverseHelpers";

// Define interfaces for the data structures we need
interface Opportunity {
  opportunityid: string;
  name: string;
  statecode: number;
  statuscode: number;
  _customerid_value?: string;
}

interface OpportunityClose {
  opportunityid: string;
  subject: string;
  actualend: string;
}

export default class AccountRibbon {
  static async closeOpporunities(context: Xrm.FormContext): Promise<void> {
    const accountId = context.data.entity.getId().replace(/[{}]/g, "");
    await AccountRibbon.closeOpportunitiesInternal(accountId);
  }

  static async closeOpportunitiesInternal(accountId: string): Promise<void> {
    try {
      // Get all open opportunities for this account
      const query = `$filter=_customerid_value eq ${accountId} and statecode eq 0&$select=opportunityid,name,statecode,statuscode`;
      const opportunities = await DataverseHelpers.executeWebApiRequest<Opportunity>("opportunities", query);

      if (opportunities.length === 0) {
        await DataverseHelpers.alertDialog("There are no open opportunities!");
        return;
      }

      const confirmed = await DataverseHelpers.confirmDialog(
        "Close All Open Opportunities?",
        `Are you sure you want to close the ${opportunities.length} open opportunities?`
      );

      if (!confirmed) return;

      Xrm.Utility.showProgressIndicator("Closing Opportunities, Please Wait...");

      let opportunityCount = 0;
      for (const opportunity of opportunities) {
        opportunityCount++;
        Xrm.Utility.showProgressIndicator(
          `Closing Opportunity ${opportunityCount} of ${opportunities.length} - '${opportunity.name}', Please Wait...`
        );

        await AccountRibbon.winOpportunity(opportunity.opportunityid);
      }

      Xrm.Utility.closeProgressIndicator();
      await DataverseHelpers.alertDialog(
        `${opportunityCount} Opportunities closed successfully!`,
        "Success"
      );

    } catch (error) {
      Xrm.Utility.closeProgressIndicator();
      console.error("Error closing opportunities:", error);
      await DataverseHelpers.alertDialog(
        `Could not close opportunities: ${error.message || error}`,
        "Error"
      );
    }
  }

  private static async winOpportunity(opportunityId: string): Promise<void> {
    const clientUrl = Xrm.Utility.getGlobalContext().getClientUrl();
    
    // First create an OpportunityClose record
    const opportunityClose = {
      subject: "Opportunity Won",
      actualend: new Date().toISOString(),
      "opportunityid@odata.bind": `/opportunities(${opportunityId})`
    };

    const closeResponse = await fetch(`${clientUrl}/api/data/v9.2/opportunityclose`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0"
      },
      body: JSON.stringify(opportunityClose)
    });

    if (!closeResponse.ok) {
      throw new Error(`Failed to create OpportunityClose: ${closeResponse.statusText}`);
    }

    const closeData = await closeResponse.json();
    const activityId = closeData.activityid;

    // Now call the WinOpportunity action
    const winRequest = {
      Status: 3, // Won status code
      OpportunityClose: {
        "@odata.type": "Microsoft.Dynamics.CRM.opportunityclose",
        activityid: activityId
      }
    };

    const winResponse = await fetch(`${clientUrl}/api/data/v9.2/WinOpportunity`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0"
      },
      body: JSON.stringify(winRequest)
    });

    if (!winResponse.ok) {
      throw new Error(`Failed to win opportunity: ${winResponse.statusText}`);
    }
  }
}
