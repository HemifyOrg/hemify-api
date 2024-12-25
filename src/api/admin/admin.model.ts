import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Entity } from "typeorm";

@Entity({
    name: "admin"
})

export class Admin{
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    first_name!: string

    @Column()
    last_name!: string

    @Column({unique: true})
    email_address!: string

    @Column()
    password!: string

    @CreateDateColumn({name: "created_at"})
    created_at!: Date

    @UpdateDateColumn({name: "updated_at"})
    updated_at!: Date
}