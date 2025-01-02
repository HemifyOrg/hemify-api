import {Column, PrimaryGeneratedColumn, Entity, CreateDateColumn, UpdateDateColumn} from 'typeorm'

@Entity({
    name: "basketball_event"
})

export class BasketballEvent{
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @CreateDateColumn({name: "created_at"})
    created_at!: Date

    @UpdateDateColumn({name: "updated_at"})
    updated_at!: Date
}