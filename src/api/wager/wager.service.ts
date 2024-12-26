import { WagerRepository } from "./wager.repository";
import { ServiceResponse } from "../utils/responses";
import { WAGER_STATUS, WagerCreateIO } from "./wager.interface";
import { generatePublicWagerId } from "../utils/common";
import { Wager } from "./wager.model";
import { Auth } from "../authentication/auth.model";

export class WagerService{
    private wagerRepository = new WagerRepository()

    public async create(payload: WagerCreateIO){
        try{

            const wager = await this.wagerRepository.create(payload)

            return ServiceResponse.success(`Successfully created wager`, {wager})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }

    }

    public async join(opponent: Auth, wagerId: string){
        try{
            const wager = await this.wagerRepository.get(wagerId)

            if (!wager) return ServiceResponse.error(`Wager with ID ${wagerId} not found`)

            if (wager.initiator.id === opponent.id) return ServiceResponse.error(`You cannot oppose a wager you created`)

            // ensures a p2p wager system
            if (wager.wager_status === WAGER_STATUS.MATCHED) return ServiceResponse.error(`You cannot join this wager as it has already been matched`)

            await this.wagerRepository.join(wagerId, opponent)

            return ServiceResponse.success(`Successfully joined a wager`, {})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }




    public async get(id:string){
        try{

            const wager = await this.wagerRepository.get(id)

            return ServiceResponse.success(`Successfully returned wager`, {wager})
        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }

    public async _ensureUniquePublicId(): Promise<string>{
        const maxAttempts = 10
        let attempt = 0

        while (attempt < maxAttempts){
            const publicWagerId = generatePublicWagerId()

            const existingWager = await this.wagerRepository.getByPublicId(publicWagerId)

            if (!existingWager) return publicWagerId

            attempt++
        }

        throw new Error(`Failed to generate a unique wager ID. Please contact support`)
    }
}