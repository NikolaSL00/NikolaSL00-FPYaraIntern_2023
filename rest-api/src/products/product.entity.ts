import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  height: number;

  @Column()
  width: number;

  @Column()
  weight: number;

  @Column()
  price: number;

  @Column()
  isHazardous: boolean;
}
