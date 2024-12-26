import {hash} from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../../../env'
import { CustomRequest } from '../interfaces/custom-request'
import { Response, NextFunction } from 'express'
import { errorResponse } from './responses'
import { AdminRepository } from '../admin/admin.repository'

export const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = hash(password, 10)

    return hashedPassword
}

export const generateAccessToken = async (id: string): Promise<string> => {
    const token = jwt.sign({id}, ACCESS_TOKEN_SECRET, {
        expiresIn: "30m"
    })

    return token
}

export const generateRefreshToken = async (id: string): Promise<string> => {
   const token = jwt.sign({id}, REFRESH_TOKEN_SECRET, {
    expiresIn: "1d"
   }) 

   return token

}


export const verifyUserAccessToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeaders = req.headers['authorization']
    const token = authHeaders && authHeaders.split(" ")[1]

    if (!token) return errorResponse(res, 401, `Unauthorized`)

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, token) => {
        if (err) return errorResponse(res, 403, `Forbidden`)

        const {id} = token as JwtPayload

        req.user = {id}

        next()
    })
}

export const verifyAdminAccessToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const adminRepository = new AdminRepository()

    const authHeaders = req.headers['authorization']
    const token = authHeaders && authHeaders.split(" ")[1]

    if (!token) return errorResponse(res, 401,'Unauthorized')

    try{
            const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
            const { id } = decoded;
    
            const admin = await adminRepository.get(id);
    
            if (!admin) return errorResponse(res, 401, `You do not have access to this resource`);
    
            req.user = { id };
    
            next();
        } catch (err) {
            return errorResponse(res, 403, `Forbidden`);
        } 
}



export const generateOTP = (): string => {
    let otp = `${Math.floor(100000 + Math.random() * 900000)}`
    return otp
}

export const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate
}

export const formatToUserFriendlyDate = (date: Date) => {
    const response = new Date(date).toLocaleString('en-US', {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
    })

    return response
}

export const generatePublicWagerId = () => {
    const numbers = '0123456789'
    const letters = 'abcdefghijklmnopqrstuvwxyz'

    let code = ''
    
    for (let i = 0; i < 4; i++){
        code += numbers[Math.floor(Math.random() * numbers.length)]
    }

    for (let i = 0; i < 5; i++){
        code += letters[Math.floor(Math.random() * letters.length)]
    }

    return code
}