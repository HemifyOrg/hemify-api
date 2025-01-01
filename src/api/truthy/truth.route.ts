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
        this.router.post("/truth/football/draw", verifyAdminAccessToken, this.truthController.footballDraw)
        this.router.post("/truth/football/both-scores", verifyAdminAccessToken, this.truthController.footballBothScores)
    }
}