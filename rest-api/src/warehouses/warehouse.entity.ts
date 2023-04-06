import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { WarehouseType } from './dtos/enums/warehouse-type.enum';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  volume: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  volumeLimit: number;

  @Column({
    type: 'enum',
    enum: WarehouseType,
    default: WarehouseType.NORMAL,
  })
  type: WarehouseType;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}
