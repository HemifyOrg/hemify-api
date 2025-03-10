export enum FootballEventStatus{
    PENDING = "pending",
    RUNNING = "running",
    CONCLUDED = "concluded"
}

export enum FootballMatchWinner{
    HOME = "home",
    AWAY = "away",
    DRAW = "draw"
}

export interface FootballEventCreateInterface{
    tournament_name: string
    tournament_icon_url: string
    fixture_id: string
    fixture_venue?: string
    home_team: string
    home_team_id: string
    home_team_icon_url: string
    away_team: string
    away_team_id: string
    away_team_icon_url: string
    start_time?: Date

}

export interface FootballEventUpdateInterface{
    home_team_goals: number
    away_team_goals: number
    event_status: FootballEventStatus
    match_winner?: FootballMatchWinner
}



export interface ManualFootballEventCreateInterface{
    today: string
    nextWeek: string
    league: number
    season: string
}

export interface IBasicFootballEvent{
    id: string
    tournament_name: string
    tournament_icon_url: string
    fixture_id: string
    home_team: string
    away_team: string 
    start_time: Date | null
    fixture_venue: string | null
    home_team_icon_url: string
    away_team_icon_url: string
    home_team_goals: number | null
    away_team_goals: number | null
    match_winner: string | null
}

export const getBasicFootballEvent = (event: IBasicFootballEvent) => {
    return {
        id: event.id,
        tournament_name: event.tournament_name,
        tournament_icon_url: event.tournament_icon_url,
        fixture_id: event.fixture_id,
        home_team: event.home_team,
        away_team: event.away_team,
        start_time: event.start_time,
        fixture_venue: event.fixture_venue,
        home_team_icon_url: event.home_team_icon_url,
        away_team_icon_url: event.away_team_icon_url,
        home_team_goals: event.home_team_goals,
        away_team_goals: event.away_team_goals,
        match_winner: event.match_winner
    }
}