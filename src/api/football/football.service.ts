import { FootballEventRepository } from "./football.repository";
import { ServiceResponse } from "../utils/responses";
import { FootballEventCreateInterface, FootballEventStatus, FootballMatchWinner, getBasicFootballEvent, ManualFootballEventCreateInterface } from "./football.interface";
import { trackedLeagues } from "../utils/secrets";
import { FootballAPIService } from "./football.api";
import { FootballEvent } from "./football.model";

export class FootballEventService{
    private footballRepository = new FootballEventRepository()
    private footballapiService = new FootballAPIService()

    public async get(id: string){
        try{

            const footballEvent = await this.footballRepository.get(id)
            const headtohead = await this._assembleHeadtoHead(footballEvent)
            const teamform = await this._assembleTeamFormData(footballEvent)

            return ServiceResponse.success(`Successfully returned football event`, {football_event: getBasicFootballEvent(footballEvent), headtohead, teamform})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }

    public async getUpcoming(){
        try{

            const events = await this.footballRepository.getUpcoming()

            const formatted = await Promise.all(events.map((event) => getBasicFootballEvent(event)))

            return ServiceResponse.success(`Successfully returned football events`, {events: formatted})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }

    public async getRecent(){
        try{
            const events = await this.footballRepository.getRecent()

            const formatted = await Promise.all(events.map((event) => getBasicFootballEvent(event)))

            return ServiceResponse.success(`Successfully returned football events`, {events: formatted})
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


    public async getFixtureInfo(fixtureId: string){

        const {data} = await this.footballapiService.fetchFixtureInfo(fixtureId)
        if (!data) return ServiceResponse.error(`Operation failed.`)
        const update = await this._extractUpdatedInfo(data)


        return ServiceResponse.success(`Successfully fetched fixture info`, update)
    }




    public async autoUpdateLiveFootballEvents(){
        try{
            const footballEvents = await this.footballRepository.getLiveEvents()

            for (let event of footballEvents){
               const {data} = await this.footballapiService.fetchFixtureInfo(event.fixture_id)

               if (!data) return ServiceResponse.error(`Operation failed.`)

                const update = await this._extractUpdatedInfo(data)

                await this.footballRepository.update(event.id, update)

            }

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }


    private async _extractUpdatedInfo(data: any){
        const fte = data[0]

        const status = fte.fixture.status.short
        const home_team_goals = fte.goals.home || 0
        const away_team_goals = fte.goals.away || 0
        let event_status;
        let match_winner;

        if (['TBD', 'NS', 'PST', 'CANC', 'ABD', 'WO', 'AWD'].includes(status)) {
            event_status = FootballEventStatus.PENDING;
        } else if (['AET', 'FT', 'PEN'].includes(status)) {
            event_status = FootballEventStatus.CONCLUDED;
        } else {
            event_status = FootballEventStatus.RUNNING
        }

        if (event_status === FootballEventStatus.CONCLUDED){
            match_winner = fte.teams.home?.winner ? FootballMatchWinner.HOME : fte.teams.away?.winner ? FootballMatchWinner.AWAY : FootballMatchWinner.DRAW;
        }


        const response = {
            home_team_goals,
            away_team_goals,
            event_status,
            match_winner
        }

        return response


    }



    private async _assembleTeamFormData(event: FootballEvent){
        const homeTeamId = Number(event.home_team_id)
        const awayTeamId = Number(event.away_team_id)

        const home_team = []
        const away_team = []

        let {data:home} = await this.footballapiService.fetchLastFewMatchesForTeam(homeTeamId)

        for (let fte of home){
            home_team.push({
                league_name: fte.league.name,
                fixture_home: fte.teams.home.name,
                fixture_away: fte.teams.away.name, 
                fixture_home_goals: fte.goals.home,
                fixture_away_goals: fte.goals.away,
                fixture_winner: fte.teams.home.winner ? fte.teams.home.name : fte.teams.away.winner ? fte.teams.away.name : null
            })
        }

       let {data:away} = await this.footballapiService.fetchLastFewMatchesForTeam(awayTeamId)

       for (let fte of away){
            away_team.push({
                league_name: fte.league.name,
                fixture_home: fte.teams.home.name,
                fixture_away: fte.teams.away.name, 
                fixture_home_goals: fte.goals.home,
                fixture_away_goals: fte.goals.away,
                fixture_winner: fte.teams.home.winner ? fte.teams.home.name : fte.teams.away.winner ? fte.teams.away.name : null
             })
        }
        
        const teamform = {home_team, away_team}

        return teamform
    }




    private async _assembleHeadtoHead(event: FootballEvent){
        const homeTeamId = event.home_team_id
        const awayTeamId = event.away_team_id

       

        const {data} = await this.footballapiService.fetchHeadtoHead(homeTeamId, awayTeamId)

        if (!data) throw new Error(`Could not compute head to head information`)

        let headtohead = {
            'number_home_wins': 0,
            'number_away_wins': 0,
            'number_draws': 0,
            'home_win_percent': 0,
            'away_win_percent': 0,
            'draw_percent': 0,
            'no_of_games': 0
        }

        const noOfGames = data.length
        let numberAWins = 0
        let numberBWins = 0
        let numberDraws = 0

        for (let fte of data){
            if (homeTeamId == fte.teams.home.id){       // Home team plays home for the match
                if (fte.teams.home.winner == true) numberAWins += 1
                else if (fte.teams.away.winner == true) numberBWins+= 1
                else numberDraws+= 1
            }else  if (homeTeamId == fte.teams.away.id){     // Home team plays away for the match
                if (fte.teams.home.winner == true) numberBWins+= 1
                else if (fte.teams.away.winner == true) numberAWins+= 1
                else numberDraws+= 1
            }
        }

        headtohead.number_home_wins = numberAWins
        headtohead.number_away_wins = numberBWins
        headtohead.number_draws = numberDraws
        headtohead.no_of_games = noOfGames
        headtohead.home_win_percent = Math.round(numberAWins/noOfGames * 100)
        headtohead.away_win_percent = Math.round(numberBWins/noOfGames * 100)
        headtohead.draw_percent = Math.round(numberDraws/noOfGames * 100)


        return headtohead
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