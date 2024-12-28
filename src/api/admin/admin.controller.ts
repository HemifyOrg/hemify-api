import { AdminService } from "./admin.service";
import { successResponse, errorResponse } from "../utils/responses";
import { CustomRequest } from "../interfaces/custom-request";
import { NextFunction, Response } from "express";
import { hashPassword } from "../utils/common";


export class AdminController{
    private adminService = new AdminService()

    create = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const {first_name, last_name, email_address, password} = req.body

            const payload = {
                first_name,
                last_name,
                email_address,
                password: await hashPassword(password)
            }

            const {success, message, data} = await this.adminService.create(payload)

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 201, message, data)

        }catch(error){
            next(error)
        }
    }


    login = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const {email_address, password} = req.body

            const payload ={email_address, password}

            const {success, message, data} = await this.adminService.login(payload)

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }

    getFootballInfo = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const eventId = req.params.eventId
            const {success, message, data} = await this.adminService.getFootballInfo(eventId)

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }

    getUserInfo = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const {username} = req.body
            const {success, message, data} = await this.adminService.getUserInfo(username)

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }

    suspendUserAccount = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{

            const {username} = req.body
            const {success, message, data} = await this.adminService.suspendUserAccount(username)

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }

    terminateUserAccount = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            const {username} = req.body
            const {success, message, data} = await this.adminService.terminateUserAccount(username)

            if (!success) return errorResponse(res, 400, message)
            
            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }

    getHemifyStats = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{

            const {success, message, data} = await this.adminService.hemifyStats()

            if (!success) return errorResponse(res, 400, message)

            return successResponse(res, 200, message, data)

        }catch(error){
            next(error)
        }
    }
}