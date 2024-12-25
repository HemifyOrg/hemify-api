import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Entity } from "typeorm";
import { FootballEventStatus, FootballMatchWinner } from "./football.interface";

@Entity({
    name: "football_event"
})

export class FootballEvent{
    
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    tournament_name!: string

    @Column()
    tournament_icon_url!: string

    @Column({unique: true}) // a pointer to Rapid-API fixture
    fixture_id!: string

    @Column({nullable: true})
    fixture_venue!: string

    @Column()
    home_team!: string

    @Column() // a pointer to RAPID-API team id
    home_team_id!: string

    @Column()
    home_team_icon_url!: string

    @Column()
    away_team!: string

    @Column() // a pointer to RAPID API team id
    away_team_id!: string

    @Column()
    away_team_icon_url!: string

    @Column({nullable: true})
    start_time!: Date

    @Column({type: "enum", enum: FootballEventStatus, default: FootballEventStatus.PENDING})
    event_status!: FootballEventStatus

    @Column({nullable: true})
    home_team_goals!: number

    @Column({nullable: true})
    away_team_goals!: number

    @Column({type: "enum", enum: FootballMatchWinner, nullable: true})
    match_winner!: FootballMatchWinner

    @Column({nullable: true}) // popularity among Hemify users
    popularity?: number

    @Column({nullable: true})
    description?: string

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date


}