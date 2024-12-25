import { FootballEvent } from "./football.model";
import { appDataSource } from "../datasource";
import { FootballEventCreateInterface, FootballEventStatus } from "./football.interface";

export class FootballEventRepository{
    private footballRepository = appDataSource.getRepository(FootballEvent)

    public async create(payload: FootballEventCreateInterface): Promise<void>{
        const event = this.footballRepository.create(payload)

        await this.footballRepository.save(event)
    }

    public async batchCreate(payload: FootballEventCreateInterface[]): Promise<void>{
        if (payload.length === 0) return

        await this.footballRepository.insert(payload)
    }

    public async get(id: string): Promise<FootballEvent>{
        const event = await this.footballRepository.findOne({
            where: {id}
        })

        if (!event) throw new Error(`Event with ID ${id} not found`)

        return event
    }

    public async getByFixtureId(id: string): Promise<FootballEvent|null>{
        const event = await this.footballRepository.findOne({
            where: {fixture_id: id}
        })

        return event
    }

    public async getLiveEvents(): Promise<FootballEvent[]>{
        const events = await this.footballRepository.find({
            where: {event_status: FootballEventStatus.RUNNING}
        })

        return events
    }

    public async getPendingEvents(): Promise<FootballEvent[]>{
        const events = await this.footballRepository.find({
            where:{event_status: FootballEventStatus.PENDING}
        })

        return events
    }

}