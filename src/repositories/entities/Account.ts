import { Transform } from 'class-transformer';
import { IEntity } from '../interfaces/IEntity';

export class Account implements IEntity {
  @Transform(({ obj }) => obj.accountid || obj.id)
  id: string;
  
  entityLogicalName: string = 'account';
  
  @Transform(({ value }) => value ? new Date(value) : undefined)
  createdon?: Date;

  name: string;
  accountnumber?: string;
  telephone1?: string;
  fax?: string;
  address1_line1?: string;
  address1_city?: string;
  address1_stateorprovince?: string;
  address1_postalcode?: string;
  address1_country?: string;
  websiteurl?: string;
  numberofemployees?: number;
  creditonhold?: boolean;
  industrycode?: number
  ownershipcode?: number;
  
  parentaccountid?: { id: string; name?: string };

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}