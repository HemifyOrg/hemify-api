import { FootballEventRepository } from "./football.repository";
import { ServiceResponse } from "../utils/responses";
import { FootballEventCreateInterface, getBasicFootballEvent, ManualFootballEventCreateInterface } from "./football.interface";
import { trackedLeagues } from "../utils/secrets";
import { FootballAPIService } from "./football.api";

export class FootballEventService{
    private footballRepository = new FootballEventRepository()
    private footballapiService = new FootballAPIService()

    public async get(id: string){
        try{

            const footballEvent = await this.footballRepository.get(id)

            return ServiceResponse.success(`Successfully returned football event`, {football_event: getBasicFootballEvent(footballEvent)})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }

    public async autoCreateFootballEvents(){
        try{
            const leageueIds = trackedLeagues

            const fixtures:FootballEventCreateInterface[] = []
            for (let league of leageueIds){
                const {data} = await this.footballapiService.fetchFixturesForLeagueByNextFewMatches(league, 5)

                for (let event of data){
                    const fixture = this._extractFixtureInfo(event)

                    const existingFixture = await this.footballRepository.getByFixtureId(fixture.fixture_id)
                    if (existingFixture) continue

                    fixtures.push(fixture)
                }                
            }

            await this.footballRepository.batchCreate(fixtures)
            return ServiceResponse.success(`Successfully created football events`, {})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }

    public async manualCreateFootballEvents(payload: ManualFootballEventCreateInterface){
        try{
            const {today, nextWeek, league, season} = payload

            const {data} = await this.footballapiService.fetchFixturesByLeagueAndDateRange(league, today, nextWeek, season)
            
            const fixtures:FootballEventCreateInterface[] = []
            for (let event of data){
                const fixture = this._extractFixtureInfo(event)

                const existingFixture = await this.footballRepository.getByFixtureId(fixture.fixture_id)
                if (existingFixture) continue

                fixtures.push(fixture)
            }

            await this.footballRepository.batchCreate(fixtures)
            return ServiceResponse.success(`Successfully created football events`, {})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }


    private _extractFixtureInfo(event: any): FootballEventCreateInterface{
        return {
            tournament_name: event.league.name,
            tournament_icon_url: event.league.logo,
            fixture_id: event.fixture.id,
            fixture_venue: event.fixture.venue.name,
            home_team: event.teams.home.name,
            home_team_id: event.teams.home.id,
            home_team_icon_url: event.teams.home.logo,
            away_team: event.teams.away.name,
            away_team_id: event.teams.away.id,
            away_team_icon_url: event.teams.away.logo,
            start_time: event.fixture.date
        }

    }
}