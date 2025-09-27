import { Transform } from 'class-transformer';
import { IEntity } from '../interfaces/IEntity';

export class Team implements IEntity {
  @Transform(({ obj }) => obj.teamid || obj.id)
  id: string;
  
  entityLogicalName: string = 'team';
  
  @Transform(({ value }) => value ? new Date(value) : undefined)
  createdon?: Date;

  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}