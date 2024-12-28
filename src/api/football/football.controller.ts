import { CustomRequest } from "../interfaces/custom-request";
import { Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../utils/responses";
import { FootballEventService } from "./football.service";
import { FootballAPIService } from "./football.api";
import { formatDate } from "../utils/common";



export class FootballEventController{
    private footballService = new FootballEventService()
    private footballapiService = new FootballAPIService()

    autoCreate = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const {success, message, data} = await this.footballService.autoCreateFootballEvents()

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            console.log(error)
            next(error)
        }
    }

    manualCreate = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const today = formatDate(new Date(Date.now()))
            const nextWeek = formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 ))

            const league = req.body.league
            const season = req.body.season

            const payload = {today, nextWeek, league, season}

            const {success, message, data} = await this.footballService.manualCreateFootballEvents(payload)

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            console.log(error)
            next(error)
        }
    }

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

    getUpcoming = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const {success, message, data} = await this.footballService.getUpcoming()

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }

    getRecent = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const {success, message, data} = await this.footballService.getRecent()

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }




    headtohead = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const home_team_id = req.body.home_team_id
            const away_team_id = req.body.away_team_id

            const {success, message, data} = await this.footballapiService.fetchHeadtoHead(home_team_id, away_team_id)

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)
        }catch(error){
            next(error)
        }
    }

    getTimezones = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const {success, message, data} = await this.footballapiService.fetchTimezones()

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }

    
}