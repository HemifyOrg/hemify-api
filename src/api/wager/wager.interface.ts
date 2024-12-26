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


// export interface WagerCreateInterface{
//     public_id: string
//     event_type: EVENT_TYPE
//     event_id: string
//     wager_status: WAGER_STATUS
//     initiator: Auth
//     opponents?: Auth[]
//     wager_terms: {
//         amount_staked: number,
//         potential_win: number,
//         conditions: Array<WagerTermInterface>
//     }

//     wager_winner?: "initiator" | "opponent"
// }

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

