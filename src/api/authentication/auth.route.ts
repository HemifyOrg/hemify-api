import { Router } from "express";
import { AuthController } from "./auth.controller";

export class AuthRoute{
    public router = Router()
    private authController = new AuthController()

    constructor(){
        this.initRoutes()
    }


    initRoutes(){
        this.router.post('/auth/register', this.authController.signup)
    }
}