import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { AccountStatus, Genders } from "./auth.interface";

@Entity({
    name: "auth"
})

export class Auth{
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({unique: true})
    email!: string

    @Column({unique: true})
    username!: string

    @Column()
    password!: string

    @Column({type: "enum", enum: Genders, nullable: true})
    gender?: Genders

    @Column({nullable: true})
    profileIconUrl?: string

    @Column({nullable: true})
    password_reset_token?: string

    @Column()
    account_create_token!: string

    @Column()
    account_create_token_expires!: Date
    
    @Column({default: false})
    isVerified!: boolean

    @Column({type: "enum", enum: AccountStatus, default: AccountStatus.ACTIVE})
    account_status!: AccountStatus

    @Column({nullable: true})
    suspended_at!: Date

    @Column({nullable: true})
    suspended_until!: Date

    @Column({nullable: true})
    terminated_at!: Date

    @Column({nullable: true})
    password_reset_token_expires_at?: Date

    @Column({nullable: true})
    password_changed_at?: Date

    @CreateDateColumn({name: "created_at"})
    created_at!: Date

    @UpdateDateColumn({name: "updated_at"})
    updated_at!: Date

}