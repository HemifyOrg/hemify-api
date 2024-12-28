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
        this.router.post("/wagers/create", verifyUserAccessToken, this.wagerController.create)
        this.router.post("/wagers/join/:id", verifyUserAccessToken, this.wagerController.join)
        this.router.get("/wagers", verifyUserAccessToken, this.wagerController.wagerHistory)
        this.router.get("/wagers/open", verifyUserAccessToken, this.wagerController.getOpenWagers)
        this.router.get("/wagers/:id", verifyUserAccessToken, this.wagerController.getWagerDetails)
    }
}