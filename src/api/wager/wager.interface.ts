import { Auth } from "../authentication/auth.model"

export enum EVENT_TYPE {
    FOOTBALL = "football",
    BASKETBALL = "basketball",
    CRYPTO = "crypto",
    POLITICS = "politics",
    STOCKS = "stocks",
    CUSTOM = "custom"
}


export enum WAGER_STATUS{
    OPEN = "open",
    MATCHED = "matched",
    COMPLETED = "completed",
    VOID = "void"
}

enum WAGER_CONDITION_TYPES {
    WINNER = "winner",
    BOTH_TEAM_SCORES = "both_team_scores",
    FULL_TIME_DRAW = "full_time_draw"
}

enum WAGER_CONDITION_VALUES {
    HOME = "home",
    AWAY = "away",
    YES = "yes",
    NO = "no",
    TEAM1 = "team1",
    TEAM2 = "team2"
}

export interface WagerTermInterface{
    condition_type: WAGER_CONDITION_TYPES
    value: WAGER_CONDITION_VALUES | number
    description?: string
}


export interface WagerCreateIO{
    public_id: string
    initiator: Auth
    event_type: EVENT_TYPE
    event_id: string
    wager_terms: {
        amount_staked: number,
        potential_win: number,
        conditions: Array<WagerTermInterface>
    }
}


interface IBasicWager{
    id: string
    public_id: string
    event_type: EVENT_TYPE
    wager_status: WAGER_STATUS
    wager_winner?: string
    wager_terms: {
        amount_staked: number,
        potential_win: number,
        conditions: Array<WagerTermInterface>
    },
    initiator: Auth,
    opponents?: Auth[]
    created_at: Date
    updated_at: Date
}


export const getBasicWager = (wager: IBasicWager) => {
    return {
        id: wager.id,
        public_id: wager.public_id,
        event_type: wager.event_type,
        wager_status: wager.wager_status,
        wager_terms: wager.wager_terms,
        initiator: wager.initiator.username,
        opponents: wager.opponents?.map(opponent => opponent.username) || [],
        wager_winner: wager.wager_winner,
        created_at: wager.created_at,
        updated_at: wager.updated_at
    }

}

