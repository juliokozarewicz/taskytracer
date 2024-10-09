import {
    Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,
    UpdateDateColumn
  } from 'typeorm'

  @Entity()
  export class TaskEntity {
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
    taskName: string;

    @Column({
      type: 'varchar',
      length: 255,
      nullable: false
    })
    category: string;
  
    @Column({
      type: 'varchar',
      length: 500,
      nullable: true
    })
    description: string;

    @CreateDateColumn({
      nullable: false
    })
    dueDate: Date;

    @Column({
      type: 'varchar',
      length: 255,
      nullable: false
    })
    statusName: string;
  }