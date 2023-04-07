import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Warehouse } from 'src/warehouses/warehouse.entity';
import { MovementProduct } from 'src/junction-table/movement-product.entity';

@Entity()
export class Movement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.exports)
  source: Warehouse;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.imports)
  destination: Warehouse;

  @OneToMany(
    () => MovementProduct,
    (movementProduct) => movementProduct.movement,
  )
  products: MovementProduct[];

  @Column({ type: 'timestamptz' })
  date: Date;
}
