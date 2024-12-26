import { CustomRequest } from "../interfaces/custom-request";
import { Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../utils/responses";
import { WagerService } from "./wager.service";
import { AuthRepository } from "../authentication/auth.repository";



export class WagerController{
    private wagerService = new WagerService()
    private authRepostitory = new AuthRepository()

    create = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const userId = req.user?.id!
            const wager_terms = req.body.wager_terms
            const event_type = req.body.event_type
            const event_id = req.body.event_id

            const initiator = await this.authRepostitory.get(userId)
            const public_id = await this.wagerService._ensureUniquePublicId()

            
            const payload = {
                public_id,
                initiator,
                event_id,
                event_type,
                wager_terms
            }

            const {success, message, data} = await this.wagerService.create(payload)

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 201, message, data)

        }catch(error){
            next(error)
        }
    }


    join = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const userId = req.user?.id!
            const wagerId = req.params.wagerId

            const opponent = await this.authRepostitory.get(userId)

            const {success, message, data} = await this.wagerService.join(opponent, wagerId)

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }
}