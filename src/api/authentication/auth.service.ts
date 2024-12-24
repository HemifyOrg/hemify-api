import { AuthRepository } from "./auth.repository";
import { ServiceResponse } from "../utils/responses";
import { Auth } from "./auth.model";
import { AuthInterface, AuthLoginInterface, AuthResponseData, getBasicUser } from "./auth.interface";
import { compare } from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/common";



export class AuthService{
    authRepository = new AuthRepository()

    public async create(payload: AuthInterface): Promise<ServiceResponse<Auth | null>>{
        try{
            const {email, username} = payload

            const existingEmail = await this.authRepository.getByEmail(email)
            if (existingEmail) return ServiceResponse.error(`Account already exists. Please log-in instead`)

            const existingUsername = await this.authRepository.getByUsername(username)
            if (existingUsername) return ServiceResponse.error(`This username is not available. Try another`)

            const user = await this.authRepository.create(payload)

            return ServiceResponse.success<Auth>(`Successfully created account`, user)

        }catch(error:any){
            return ServiceResponse.error(error.message)
        }
    }

    public async login(payload: AuthLoginInterface){
        try{
            const {username, password} = payload

            const existingUser = await this.authRepository.getByUsername(username)

            if (!existingUser) return ServiceResponse.error(`This account does not exist.`)

            const validatePassword = await compare(password, existingUser.password)

            if (!validatePassword) return ServiceResponse.error(`The username/password provided is incorrect.`)

            const accessToken = await generateAccessToken(existingUser.id)
            const refreshToken = await generateRefreshToken(existingUser.id)

            const tokens = {accessToken, refreshToken}

            return ServiceResponse.success<AuthResponseData>(`Successfully logged in`, {user: getBasicUser(existingUser), jwt: tokens})

            

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }
}