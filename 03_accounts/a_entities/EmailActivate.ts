import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { AccountUserEntity } from "./AccountUserEntity"

@Entity()
export class EmailActivate {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({ type: 'varchar', length: 255 })
    email: string

    @Column({ type: 'varchar', length: 515 })
    code: string

    @ManyToOne(() => AccountUserEntity, user => user.emailCode)
    @JoinColumn({ name: 'user' })
    user: AccountUserEntity; 
}