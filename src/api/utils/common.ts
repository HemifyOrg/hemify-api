import {hash} from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../../../env'

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