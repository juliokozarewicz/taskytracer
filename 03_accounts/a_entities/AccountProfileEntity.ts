import {
    Entity, PrimaryGeneratedColumn, Column,
    OneToOne,
    JoinColumn
} from 'typeorm'
import { AccountUserEntity } from './AccountUserEntity';

@Entity()
export class AccountProfileEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    biography: string;

    @Column({ type: 'varchar', length: 25, nullable: true })
    phone: string;

    @Column({ type: 'varchar', length: 25, nullable: true })
    cpf: string;

    @OneToOne(() => AccountUserEntity, user => user.profile)
    @JoinColumn({ name: 'user' })
    user: AccountUserEntity;
}