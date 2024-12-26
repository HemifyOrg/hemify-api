import { Router } from "express";
import { AuthController } from "./auth.controller";
import { verifyUserAccessToken } from "../utils/common";

export class AuthRoute{
    public router = Router()
    private authController = new AuthController()

    constructor(){
        this.initRoutes()
    }


    initRoutes(){
        this.router.post('/auth/register', this.authController.signup)
        this.router.post('/auth/login', this.authController.login)
        this.router.get('/auth', verifyUserAccessToken, this.authController.getDetails)
        this.router.post('/auth/change-password', verifyUserAccessToken, this.authController.changePassword)
        this.router.post('/auth/forgot-password', this.authController.forgotPassword)
        this.router.get('/', this.authController.ok)
    }
}