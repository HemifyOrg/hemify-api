import { Router } from "express";
import { WagerController } from "./wager.controller";
import { verifyUserAccessToken } from "../utils/common";

export class WagerRoute{
    public router = Router()
    private wagerController = new WagerController()

    constructor(){
        this.initRoutes()
    }


    initRoutes(){
        this.router.post("/wager/create", verifyUserAccessToken, this.wagerController.create)
    }
}