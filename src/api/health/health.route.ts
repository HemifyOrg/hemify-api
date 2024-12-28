import { HealthController } from "./health.controller";
import { Router } from "express";

export class HealthRoute{
    public router = Router()
    private healthController = new HealthController()

    constructor(){
        this.initRoutes()
    }


    initRoutes(){
        this.router.get("/health", this.healthController.health)
    }
}