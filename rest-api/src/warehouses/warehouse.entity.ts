import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  capacityLimit: number;

  @Column()
  capacity: number;

  @Column()
  isHazardous: boolean;
}
