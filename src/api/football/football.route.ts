import { Router } from "express";
import { FootballEventController } from "./football.controller";
import { verifyUserAccessToken } from "../utils/common";

export class FootballRoute{
    public router = Router()
    private footballController = new FootballEventController()


    constructor(){
        this.initRoutes()
    }

    initRoutes(){
        this.router.post('/events/football/auto-create', this.footballController.autoCreate) // reserved for the cron-job
        this.router.get('/events/football/headtohead', verifyUserAccessToken, this.footballController.headtohead)
        this.router.get('/events/football/timezones', verifyUserAccessToken, this.footballController.getTimezones)
        this.router.get('/events/football/:id', verifyUserAccessToken, this.footballController.get)
        
        
    }

}