import axios from "axios"
import { RAPID_API_KEY } from "../../../env"
import { ServiceResponse } from "../utils/responses"

export class FootballAPIService{

    public async fetchFixturesByLeagueAndDateRange(leagueId: number, minDate: string, maxDate: string, season: string){
        try{
            const options = {
                headers: {
                    'x-rapidapi-key': RAPID_API_KEY,
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                },

                params: {league: leagueId, from: minDate, to: maxDate, season: season}
            }

            const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures`, options)
            const data = response.data.response

            return ServiceResponse.success(`Successfully fetched fixture information`, data)

        }catch(error:any){
            console.log(error)
            return ServiceResponse.error(error.message)
        }

    }

    public async fetchFixturesForLeagueByNextFewMatches(leagueId: number, next: number){
        try{
            const options = {
                headers: {
                    'x-rapidapi-key': RAPID_API_KEY,
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                },

                params: {league: leagueId, next: next}
            }

            const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures`, options)
            const data = response.data.response

            return ServiceResponse.success(`Successfully fetched fixture information`, data)

        }catch(error: any){
            console.log(error)
            return ServiceResponse.error(error.message)
        }
    }


    public async fetchLeagueInfoById(id: number){
        try{
            const options = {
                headers: {
                    'x-rapidapi-key': RAPID_API_KEY,
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                },

                params: {id: id}
            }

            const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/leagues', options)
            const data = response.data.response

            return ServiceResponse.success(`Successfully fetched League Information`, data)

        }catch(error: any){
            console.log(error)
            return ServiceResponse.error(error.message)
        }
    }


    public async fetchHeadtoHead(home_team_id: string, away_team_id: string){
        try{

            const options = {
                headers: {
                    'x-rapidapi-key': RAPID_API_KEY,
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                },

                params: {h2h: `${home_team_id}-${away_team_id}`, timezone: 'Africa/Lagos'}
            }

            const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures/headtohead`, options)

            const data = response.data.response

            return ServiceResponse.success(`Successfully fetched Head to Head data`, data)

        }catch(error: any){
            console.log(error)
            return ServiceResponse.error(error.message)
        }
    }


    public async fetchTimezones() {
        try{
            const options = {
                headers: {
                    'x-rapidapi-key': RAPID_API_KEY,
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                }
            }

            const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/timezone`, options)

            const data = response.data.response

            return ServiceResponse.success(`Successfully fetched timezones`, data)

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }
}