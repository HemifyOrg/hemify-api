import { CustomRequest } from "../interfaces/custom-request";
import { Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../utils/responses";
import { FootballEventService } from "./football.service";


export class FootballEventController{
    private footballService = new FootballEventService()

    get = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const eventId = req.params.id

            const {success, message, data} = await this.footballService.get(eventId)

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }

    }
}