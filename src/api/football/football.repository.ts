import { FootballEvent } from "./football.model";
import { appDataSource } from "../datasource";
import { FootballEventCreateInterface, FootballEventStatus, FootballEventUpdateInterface } from "./football.interface";
import { Between } from "typeorm";

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

    public async update(id: string, updated: FootballEventUpdateInterface): Promise<void>{
        const event = await this.footballRepository.findOne({
            where: {id}
        })

        if (!event) throw new Error(`Event with ID ${id} not found`)

        const updatedEvent = this.footballRepository.merge(event, updated)

        await this.footballRepository.save(updatedEvent)
    }




    public async getUpcoming(): Promise<FootballEvent[]>{
        const today = new Date()

        const startOfToday = new Date(today);
        startOfToday.setHours(0, 0, 0, 0);
        
        const endOfNext7Days = new Date(today);
        endOfNext7Days.setDate(today.getDate() + 7);
        endOfNext7Days.setHours(23, 59, 59, 999);


        const events = await this.footballRepository.find({
            where: {
                start_time: Between(startOfToday, endOfNext7Days)
            }
        })

        return events
    }

    public async getRecent(): Promise<FootballEvent[]>{
        const today = new Date()

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay())
        startOfWeek.setHours(0, 0, 0, 0)


        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        endOfWeek.setHours(23, 59, 59, 999);

        const events = await this.footballRepository.find({
            where: {
                start_time: Between(startOfWeek, endOfWeek)
            }
        })

        return events
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