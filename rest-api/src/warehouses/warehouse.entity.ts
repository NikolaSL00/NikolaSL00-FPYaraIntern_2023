import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { WarehouseType } from './dtos/enums/warehouse-type.enum';
import { User } from 'src/users/user.entity';
import { Movement } from 'src/movements/movement.entity';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ unique: true })
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

  @OneToMany(() => Movement, (movement) => movement.source, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  exports: Movement[];

  @OneToMany(() => Movement, (movement) => movement.destination, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  imports: Movement[];
}
