import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  stock: number;
}
