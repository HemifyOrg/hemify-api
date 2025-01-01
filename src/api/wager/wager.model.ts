import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { EVENT_TYPE, WAGER_STATUS, WagerTermInterface } from "./wager.interface";
import { Auth } from "../authentication/auth.model";

@Entity({
    name: "wager"
})

export class Wager{
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    public_id!: string

    @Column({type: "enum", enum: EVENT_TYPE})
    event_type!: EVENT_TYPE

    @Column()
    event_id!: string

    @Column({type: "enum", enum: WAGER_STATUS, default: WAGER_STATUS.OPEN})
    wager_status!: WAGER_STATUS

    @ManyToOne(() => Auth)
    @JoinColumn()
    initiator!: Auth

    @ManyToMany(() => Auth, { nullable: true })
    @JoinTable() 
    opponents?: Auth[];

    @Column({type: "jsonb"})
    wager_terms!: {
        amount_staked: number,
        potential_win: number,
        conditions: Array<WagerTermInterface>
    }

    @Column({nullable: true})
    wager_winner?: "initiator" | "opponent" | "n/a"

    @CreateDateColumn({name: "created_at"})
    created_at!: Date

    @UpdateDateColumn({name: "updated_at"})
    updated_at!: Date


}