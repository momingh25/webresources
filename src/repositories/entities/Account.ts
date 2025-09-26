import { IEntity } from '../interfaces/IEntity';

export class Account implements IEntity {
  id: string;
  entityLogicalName: string = 'account';
  createdon?: Date;

  name: string;
  accountnumber?: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}