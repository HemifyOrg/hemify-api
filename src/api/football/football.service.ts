import { FootballEventRepository } from "./football.repository";
import { ServiceResponse } from "../utils/responses";
import { getBasicFootballEvent } from "./football.interface";

export class FootballEventService{
    private footballRepository = new FootballEventRepository()

    public async get(id: string){
        try{

            const footballEvent = await this.footballRepository.get(id)

            return ServiceResponse.success(`Successfully returned football event`, {football_event: getBasicFootballEvent(footballEvent)})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }
}