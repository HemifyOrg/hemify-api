import { FootballEvent } from "./football.model";
import { appDataSource } from "../datasource";
import { FootballEventCreateInterface } from "./football.interface";

export class FootballEventRepository{
    private footballRepository = appDataSource.getRepository(FootballEvent)

    public async create(payload: FootballEventCreateInterface): Promise<void>{
        const event = this.footballRepository.create(payload)

        await this.footballRepository.save(event)
    }

    public async get(id: string): Promise<FootballEvent>{
        const event = await this.footballRepository.findOne({
            where: {id}
        })

        if (!event) throw new Error(`Event with ID ${id} not found`)

        return event
    }

}