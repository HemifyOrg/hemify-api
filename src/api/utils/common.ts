import {hash} from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../../../env'
import { CustomRequest } from '../interfaces/custom-request'
import { Response, NextFunction } from 'express'
import { errorResponse } from './responses'

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