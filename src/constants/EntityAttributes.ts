// Entity attribute logical names for type safety
export const AccountAttributes = {
  WebSiteURL: "websiteurl",
  Name: "name",
  AccountNumber: "accountnumber",
  PrimaryContactId: "primarycontactid",
  // Add more as needed
} as const;

export const ContactAttributes = {
  FirstName: "firstname",
  LastName: "lastname",
  EmailAddress1: "emailaddress1",
  // Add more as needed
} as const;

export const OpportunityAttributes = {
  Name: "name",
  EstimatedValue: "estimatedvalue",
  CustomerId: "customerid",
  // Add more as needed
} as const;

// Type helpers for autocomplete and type safety
export type AccountAttributeKey = keyof typeof AccountAttributes;
export type ContactAttributeKey = keyof typeof ContactAttributes;
export type OpportunityAttributeKey = keyof typeof OpportunityAttributes;
