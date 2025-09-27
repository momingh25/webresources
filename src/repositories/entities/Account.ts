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

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}