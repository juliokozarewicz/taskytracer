import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { AccountUserEntity } from "./AccountUserEntity"

@Entity()
export class RefreshTokenEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({ type: 'varchar', length: 255 })
    email: string

    @Column({ type: 'varchar', length: 3500 })
    token: string

    @ManyToOne(() => AccountUserEntity, user => user.tokenRefresh)
    user: AccountUserEntity; 
}