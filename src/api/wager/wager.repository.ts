import { Auth } from "../authentication/auth.model";
import { appDataSource } from "../datasource";
import { WagerCreateIO } from "./wager.interface";
import { Wager } from "./wager.model";


export class WagerRepository{
    private wagerRepository = appDataSource.getRepository(Wager)


    public async create(payload: WagerCreateIO): Promise<Wager|null>{
        const wager = this.wagerRepository.create(payload)

        const newWager = await this.wagerRepository.save(wager)

        return newWager
    }

    public async get(id: string): Promise<Wager|null>{
        const wager = await this.wagerRepository.findOne({
            where: {id},
            relations: ['initiator', 'opponents']
        })

        return wager
    }

    public async getByPublicId(id: string): Promise<Wager|null>{
        const wager = await this.wagerRepository.findOne({
            where: {public_id: id}
        })

        return wager
    }

    public async join(id: string, opponent: Auth){
        const wager = await this.wagerRepository.findOne({
            where: {id}
        })

        if (!wager) throw new Error(`Wager with ID ${id} not found`)

        if (wager.opponents?.some(existingOpponent => existingOpponent.id === opponent.id)){
            throw new Error(`You have already joined this wager`)
        }

        // appending a new opponent to the wager.opponents array or initializing the array if it doesn’t exist
        wager.opponents = wager.opponents ? [...wager.opponents, opponent] : [opponent]

        await this.wagerRepository.save(wager)
        
    }

    
}