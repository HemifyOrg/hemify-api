import { AuthService } from "./auth.service";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { errorResponse, successResponse } from "../utils/responses";


export class AuthController{
    private authService = new AuthService()

    signup = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const {username, email, password, gender} = req.body
            
            const payload = {username, email, password, gender}
            
            const {success, message, data} = await this.authService.create(payload)
            
            if (!success) return errorResponse(res, StatusCodes.BAD_REQUEST, message)
                
            return successResponse(res, StatusCodes.CREATED, message, data) 

        }catch(error){
            next(error)
        }
    }
}