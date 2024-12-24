import { AuthService } from "./auth.service";
import { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../utils/responses";
import { hashPassword } from "../utils/common";
import { CustomRequest } from "../interfaces/custom-request";


export class AuthController{
    private authService = new AuthService()

    signup = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const {username, email, password, gender} = req.body
            
            const payload = {
                username, 
                email, 
                password: await hashPassword(password), 
                gender
            }
            
            const {success, message, data} = await this.authService.create(payload)
            
            if (!success) return errorResponse(res, 400, message)
                
            return successResponse(res, 201, message, data) 

        }catch(error){
            next(error)
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const {username, password} = req.body

            if (!username || !password){
                return errorResponse(res, 400, `Please enter your email and password to sign in`)
            }

            const payload = {username, password}

            const {success, message, data} = await this.authService.login(payload)

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }

    getDetails = async (req:CustomRequest, res: Response, next: NextFunction) => {
        try{
            const userId = req.user?.id!

            const {success, message, data} = await this.authService.getUserDetails(userId)

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data )

        }catch(error){
            next(error)
        }
    }

    changePassword = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const userId = req.user?.id!
            const existingPassword = req.body.previous_password
            const newPassword = req.body.new_password

            const payload = {userId, existingPassword, newPassword}

            const {success, message, data} = await this.authService.changePassword(payload)

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }

    forgotPassword = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const {email} = req.body

            const {success, message, data} = await this.authService.forgotPassword(email)

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }


    resetPassword = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{

            const new_password = req.body.new_password
            const reset_token = req.query.token as string

            const payload = {new_password, reset_token}

            const {success, message, data} = await this.authService.resetPassword(payload)

            if (!success) return errorResponse(res, 400, message)
            
            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }

    
}