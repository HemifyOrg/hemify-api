import { CustomRequest } from "../interfaces/custom-request";
import { NextFunction, Response } from "express";
import { HealthService } from "./health.service";
import { errorResponse, successResponse } from "../utils/responses";

export class HealthController{
    private healthService = new HealthService()

    health = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const {success, message, data} = await this.healthService.getHealth()

            if (!success) return errorResponse(res, 500, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }
}