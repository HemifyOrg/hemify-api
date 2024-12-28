import { Auth } from "../authentication/auth.model";
import { appDataSource } from "../datasource";
import { WAGER_STATUS, WagerCreateIO } from "./wager.interface";
import { Wager } from "./wager.model";


export class WagerRepository{
    private wagerRepository = appDataSource.getRepository(Wager)


    public async create(payload: WagerCreateIO): Promise<Wager|null>{
        const wager = this.wagerRepository.create(payload)

        const newWager = await this.wagerRepository.save(wager)

        return newWager
    }

    public async get(id: string): Promise<Wager>{
        const wager = await this.wagerRepository.findOne({
            where: {id},
            relations: ['initiator', 'opponents']
        })

        if (!wager) throw new Error(`Wager with ID ${id} not found`)

        return wager
    }

    public async getOpenWagers(): Promise<Wager[]>{
        const wagers = await this.wagerRepository.find({
            where: {wager_status: WAGER_STATUS.OPEN},
            relations: ['initiator', 'opponents']
        })

        return wagers

    }


    public async getWagersByUser(user: Auth): Promise<Wager[]> {
        const wagers = await this.wagerRepository
            .createQueryBuilder("wager")
            .leftJoinAndSelect("wager.initiator", "initiator")
            .leftJoinAndSelect("wager.opponents", "opponent")
            .where("wager.initiatorId = :userId", { userId: user.id })
            .orWhere("opponent.id = :userId", { userId: user.id })
            .getMany();
    
        return wagers;
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
        wager.wager_status = WAGER_STATUS.MATCHED

        await this.wagerRepository.save(wager)
        
    }

    public async getWagersCount(){
        const allWagersCount = await this.wagerRepository.count()
        const openWagersCount = await this.wagerRepository.count({
            where: {wager_status: WAGER_STATUS.OPEN}
        })

        const matchedWagersCount = await this.wagerRepository.count({
            where: {wager_status: WAGER_STATUS.MATCHED}
        })

        const voidedWagersCount = await this.wagerRepository.count({
            where: {wager_status: WAGER_STATUS.VOID}
        })

        const completedWagersCount = await this.wagerRepository.count({
            where: {wager_status: WAGER_STATUS.COMPLETED}
        })

        const wagerCount = {allWagersCount, openWagersCount, matchedWagersCount, voidedWagersCount, completedWagersCount}

        return wagerCount
    }

    
}