import { Response } from "express"


export class ServiceResponse<T>{
    constructor(
        public success: boolean,
        public message: string,
        public data?: T
    ){}

    static success<T>(message: string, data: T): ServiceResponse<T>{
        return new ServiceResponse(true, message, data)
    }

    static error(message: string): ServiceResponse<null>{
        return new ServiceResponse(false, message)
    }
}

export const errorResponse = (
    res: Response,
    code: number,
    message: string
) => {
    res.status(code).send({success: false, message})
}

export const successResponse= <T>(
    res: Response,
    code: number,
    message: string,
    data: T
) => {
    res.status(code).send({success: true, message, data})
}