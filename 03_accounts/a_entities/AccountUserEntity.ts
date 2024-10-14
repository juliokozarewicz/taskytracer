import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, Unique, OneToOne, OneToMany
} from 'typeorm'
import { AccountProfileEntity } from './AccountProfileEntity'
import { EmailActivate } from './EmailActivate'
import { RefreshTokenEntity } from './RefreshTokenEntity'

@Entity()
@Unique(['email'])
export class AccountUserEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @Column({ type: 'boolean', default: true, nullable: false })
  isActive: boolean

  @Column({ type: 'boolean', default: false, nullable: false })
  level: boolean

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string

  @Column({ type: 'boolean', default: false, nullable: false })
  isEmailConfirmed: boolean

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string

  @Column({ type: 'boolean', default: true, nullable: false })
  isBanned: boolean

  @OneToOne(() => AccountProfileEntity, profile => profile.user, { cascade: true, eager: true })
  profile: AccountProfileEntity;

  @OneToMany(() => EmailActivate, emailCode => emailCode.user, { cascade: true })
  emailCode: EmailActivate[];

  @OneToMany(() => RefreshTokenEntity, tokenRefresh => tokenRefresh.user, { cascade: true })
  tokenRefresh: RefreshTokenEntity[];
}