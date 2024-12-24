import { AuthService } from "./auth.service";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { errorResponse, successResponse } from "../utils/responses";
import { hashPassword } from "../utils/common";


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
            
            if (!success) return errorResponse(res, StatusCodes.BAD_REQUEST, message)
                
            return successResponse(res, StatusCodes.CREATED, message, data) 

        }catch(error){
            next(error)
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const {username, password} = req.body

            if (!username || !password){
                return errorResponse(res, StatusCodes.BAD_REQUEST, `Please enter your email and password to sign in`)
            }

            const payload = {username, password}

            const {success, message, data} = await this.authService.login(payload)

            if (!success) return errorResponse(res, StatusCodes.BAD_REQUEST, message)

            return successResponse(res, StatusCodes.OK, message, data)

        }catch(error){
            next(error)
        }
    }
}