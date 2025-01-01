import { CustomRequest } from "../interfaces/custom-request";
import { NextFunction, Response } from "express";
import { FootballTruthService } from "./football.truth";
import { FootballEventRepository } from "../football/football.repository";
import { errorResponse, successResponse } from "../utils/responses";


export class TruthController{
    private footballtruthService = new FootballTruthService()
    private footballRepository = new FootballEventRepository()


    footballWinner = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const eventId = req.body.event_id

            const footballEvent = await this.footballRepository.get(eventId)

            const {success, message, data} = await this.footballtruthService.decideWinner(footballEvent)

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }

    footballDraw = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const eventId = req.body.event_id

            const footballEvent = await this.footballRepository.get(eventId)

            const {success, message, data} = await this.footballtruthService.decideFullTimeDraw(footballEvent)

            if (!success) return errorResponse(res, 400, message)
            
            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }
}