import { FootballEventService } from "../football/football.service";
import { FootballEvent } from "../football/football.model";
import { ServiceResponse } from "../utils/responses";
import { WagerService } from "../wager/wager.service";
import { EVENT_TYPE, WAGER_CONDITION_TYPES, WAGER_CONDITION_VALUES } from "../wager/wager.interface";
import { FootballMatchWinner } from "../football/football.interface";


export class FootballTruthService{
    private footballService = new FootballEventService()
    private wagerService = new WagerService()

    public async decideWinner(event: FootballEvent){
        try{
            const fixtureId = event.fixture_id

            const matchToWagerMap:Record<FootballMatchWinner, WAGER_CONDITION_VALUES> = {
                [FootballMatchWinner.HOME]: WAGER_CONDITION_VALUES.HOME,   
                [FootballMatchWinner.AWAY]: WAGER_CONDITION_VALUES.AWAY,   
                [FootballMatchWinner.DRAW]: WAGER_CONDITION_VALUES.DRAW   
            }

            const {data} = await this.footballService.getFixtureInfo(fixtureId)

            if (!data) return ServiceResponse.error(`Could not verify event info`)
            
            const matchWinner = data.match_winner

            console.log(`Match Winner, ${matchWinner}`)

            if (!matchWinner) return ServiceResponse.error(`This event does not have a defined winner`)

            const {data:wagers} = await this.wagerService.getByEvent(event.id)

            if (!wagers || wagers.length == 0) return ServiceResponse.error(`Wagers for this event does not exist`)

            for (const wager of wagers){
                const wagerConditions = wager.wager_terms.conditions
                let wagerWinner;

                for (const condition of wagerConditions){
                    if (condition.condition_type === WAGER_CONDITION_TYPES.WINNER){
                        wagerWinner = condition.value
                        break
                    }
                }

                if (!wagerWinner) continue

                console.log(`Wager Winner, ${wagerWinner}`)

                if (matchWinner === FootballMatchWinner.DRAW){
                    await this.wagerService.updateWithWinner(wager.id, "n/a")
                    continue
                }else if (matchToWagerMap[matchWinner] === wagerWinner){
                    await this.wagerService.updateWithWinner(wager.id, "initiator")
                }else{
                    await this.wagerService.updateWithWinner(wager.id, "opponent")
                }

            }


            return ServiceResponse.success(`Successfully decided wager winner`, {})


        }catch(error: any){
            console.error("Error deciding truth:", error);
            return ServiceResponse.error(error.message)
        }
    }

    public async decideFullTimeDraw(event: FootballEvent){
        try{
            const fixtureId = event.fixture_id
            const {data} = await this.footballService.getFixtureInfo(fixtureId)

            if (!data) return ServiceResponse.error(`Could not verify event info`)

            console.log(data)

            const matchWinner = data.match_winner

            if (matchWinner !== FootballMatchWinner.DRAW) return ServiceResponse.error(`Cannot process full-time draw wagers for non-draw event`)


            const {data: wagers} = await this.wagerService.getByEvent(event.id)

            if (!wagers || wagers.length == 0) return ServiceResponse.error(`Wagers for this event does not exist`)

            for (const wager of wagers){
                const wagerConditions = wager.wager_terms.conditions
                let wagerDrawDecision;

                for (const condition of wagerConditions){
                    if (condition.condition_type === WAGER_CONDITION_TYPES.FULL_TIME_DRAW){
                        wagerDrawDecision = condition.value
                        break
                    }
                }

                if (!wagerDrawDecision) continue

                
                if (matchWinner === FootballMatchWinner.DRAW && wagerDrawDecision === WAGER_CONDITION_VALUES.YES){
                    await this.wagerService.updateWithWinner(wager.id, "initiator")
                }else{
                    await this.wagerService.updateWithWinner(wager.id, "opponent")
                }
            }

            return ServiceResponse.success(`Successfully decided wager winner`, {})



        }catch(error: any){
            console.error(`Error deciding truth:`, error)
            return ServiceResponse.error(error.message)
        }
    }

    public async decideBothTeamScores(event: FootballEvent){
        try{
            const fixtureId = event.fixture_id
            const {data} = await this.footballService.getFixtureInfo(fixtureId)

            if (!data) return ServiceResponse.error(`could not verify event info`)
            
            const home_goals = data.home_team_goals
            const away_goals = data.away_team_goals

            const matchTruth = (home_goals != 0 && away_goals != 0) ? WAGER_CONDITION_VALUES.YES: WAGER_CONDITION_VALUES.NO

            const {data: wagers} = await this.wagerService.getByEvent(event.id)

            if (!wagers || wagers.length == 0) return ServiceResponse.error(`Wagers for this event does not exist`)


            for (const wager of wagers){
                const wagerConditions = wager.wager_terms.conditions
                let wagerDecision;

                for (const condition of wagerConditions){
                    if (condition.condition_type === WAGER_CONDITION_TYPES.BOTH_TEAM_SCORES){
                        wagerDecision = condition.value
                        break
                    }
                }

                if (!wagerDecision) continue


                if (matchTruth === wagerDecision){
                    await this.wagerService.updateWithWinner(wager.id, "initiator")
                }else{
                    await this.wagerService.updateWithWinner(wager.id, "opponent")
                }
                
            }

            return ServiceResponse.success(`Successfully decided wager winner`, {})

        }catch(error: any){
            console.error(`Error deciding truth:`, error)
            return ServiceResponse.error(error.message)
        }
    }

    
}


// and the truth shall set you free