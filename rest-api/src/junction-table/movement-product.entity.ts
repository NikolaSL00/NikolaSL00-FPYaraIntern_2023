import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Movement } from 'src/movements/movement.entity';
import { Product } from 'src/products/product.entity';

@Entity()
export class MovementProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movement, (movement) => movement.products)
  movement: Movement;

  @ManyToOne(() => Product, (product) => product.movements)
  product: Product;

  @Column()
  quantity: number;
}
