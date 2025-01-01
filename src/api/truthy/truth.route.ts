import { Router } from "express";
import { TruthController } from "./truth.controller";
import { verifyAdminAccessToken } from "../utils/common";

export class TruthRoute{
    public router = Router()
    public truthController = new TruthController()

    constructor(){
        this.initRoutes()
    }


    initRoutes(){
        this.router.post("/truth/football/winner", verifyAdminAccessToken, this.truthController.footballWinner)
    }
}