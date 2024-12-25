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
}