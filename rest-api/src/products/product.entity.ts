import { MovementProduct } from 'src/junction-table/movement-product.entity';
import { Warehouse } from 'src/warehouses/warehouse.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { ProductType } from './dtos/enums/product-type.enum';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.NORMAL,
  })
  type: ProductType;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  length: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  width: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  height: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  volume: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @OneToMany(
    () => MovementProduct,
    (movementProduct) => movementProduct.product,
  )
  movements: MovementProduct[];
}
