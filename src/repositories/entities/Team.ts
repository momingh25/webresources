import { IEntity } from '../interfaces/IEntity';

export class Team implements IEntity {
  id: string;
  entityLogicalName: string = 'team';
  createdon?: Date;

  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}