import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false
  })
  category: string;
}