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
        this.router.get('/events/football/:id', verifyUserAccessToken, this.footballController.get)
    }

}