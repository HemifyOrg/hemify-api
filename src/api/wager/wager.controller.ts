import { CustomRequest } from "../interfaces/custom-request";
import { Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../utils/responses";
import { WagerService } from "./wager.service";
import { AuthRepository } from "../authentication/auth.repository";
import { FootballEventRepository } from "../football/football.repository";
import { EVENT_TYPE } from "./wager.interface";
import { FootballEventStatus } from "../football/football.interface";



export class WagerController{
    private wagerService = new WagerService()
    private authRepostitory = new AuthRepository()
    private footballRepository = new FootballEventRepository()

    create = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const userId = req.user?.id!
            const amount_staked = req.body.amount_staked
            const conditions = req.body.conditions
            const event_type = req.body.event_type
            const event_id = req.body.event_id

            if (event_type === EVENT_TYPE.FOOTBALL){
                const event = await this.footballRepository.get(event_id)

                if (!event) return errorResponse(res, 400, `Cannot create a wager on an event that doesn't exist`)

                if (event.event_status === FootballEventStatus.RUNNING || event.event_status === FootballEventStatus.CONCLUDED){
                    return errorResponse(res, 400, `Cannot create wager on event that has began or concluded`)
                }
            }

            const initiator = await this.authRepostitory.get(userId)
            const public_id = await this.wagerService._ensureUniquePublicId()

            const wager_terms = {
                amount_staked,
                potential_win: 2*amount_staked,
                conditions
            }

            
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

    getWagerDetails = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const wagerId = req.params.id

            const {success, message, data} = await this.wagerService.get(wagerId)

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)
        }catch(error){
            next(error)
        }
    }

    getOpenWagers = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{

            const {success, message, data} = await this.wagerService.getOpenWagers()

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }


    wagerHistory = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const userId = req.user?.id!
            const user = await this.authRepostitory.get(userId)

            const {success, message, data} = await this.wagerService.wagerHistory(user)

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }
}