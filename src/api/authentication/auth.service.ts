import { AuthRepository } from "./auth.repository";
import { ServiceResponse } from "../utils/responses";
import { AccountStatus, AuthChangePasswordInterface, AuthInterface, AuthLoginInterface, AuthResetPasswordInterface, AuthResponseData, getBasicUser } from "./auth.interface";
import { compare } from "bcrypt";
import { generateAccessToken, generateOTP, generateRefreshToken } from "../utils/common";
import { ACCOUNT_CREATE_TOKEN_EXPIRY } from "../../../env";
import { formatToUserFriendlyDate } from "../utils/common";



export class AuthService{
    authRepository = new AuthRepository()

    public async create(payload: AuthInterface){
        try{
            const {email, username} = payload

            const existingEmail = await this.authRepository.getByEmail(email)
            if (existingEmail) return ServiceResponse.error(`Account already exists. Please log-in instead`)

            const existingUsername = await this.authRepository.getByUsername(username)
            if (existingUsername) return ServiceResponse.error(`This username is not available. Try another`)

            const accountCreatePayload = {
                ...payload,
                account_create_token: generateOTP(),
                account_create_token_expires: new Date(Date.now() + (ACCOUNT_CREATE_TOKEN_EXPIRY))
            }

            const user = await this.authRepository.create(accountCreatePayload)

            return ServiceResponse.success(`Successfully created account`, {})

        }catch(error:any){
            return ServiceResponse.error(error.message)
        }
    }

    public async login(payload: AuthLoginInterface){
        try{
            const {username, password} = payload

            const existingUser = await this.authRepository.getByUsername(username)

            if (!existingUser) return ServiceResponse.error(`This account does not exist.`)


            if (existingUser.account_status === AccountStatus.SUSPENDED){
                return ServiceResponse.error(`This account has been suspended until ${formatToUserFriendlyDate(existingUser.suspended_until)}`)
            } 

            if (existingUser.account_status === AccountStatus.TERMINATED){
                return ServiceResponse.error(`This account has been permanently terminated and is no longer accessible.`)
            }

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

    public async getUserDetails(id: string){
        try{
            const user = await this.authRepository.get(id)

            return ServiceResponse.success(`Successfully returned user info`, {user: getBasicUser(user)})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }

    public async changePassword(payload: AuthChangePasswordInterface){
        try{
            const user = await this.authRepository.get(payload.userId)
            const dbPassword = user.password

            const validatePassword = await compare(payload.existingPassword, dbPassword)

            if (!validatePassword) return ServiceResponse.error(`The password you entered is incorrect`)
            
            await this.authRepository.changePassword(payload)

            return ServiceResponse.success(`Successfully changed password`, {})
        }catch(error: any){
            console.error(error)
            return ServiceResponse.error(error.message)
        }
    }

    public async forgotPassword(email: string){
        try{
            const user = await this.authRepository.getByEmail(email)

            if (!user) return ServiceResponse.error(`This account does not exist`)

            // todo: Complete flow by sending otp to email

            return ServiceResponse.success(`Please check your email to reset your password.`, {})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }

    public async resetPassword(payload: AuthResetPasswordInterface){
        try{
            const user = await this.authRepository.getByResetToken(payload.reset_token)

            if (!user) return ServiceResponse.error(`Account not found. Could not reset password`)

            const expiry = user.password_reset_token_expires_at
            const currentTime = new Date(Date.now())

            if (currentTime > expiry!) return ServiceResponse.error(`The reset token has expired. Please try again.`)

            const resetPayload = {userId: user.id, existingPassword: user.password, newPassword: payload.new_password}

            await this.authRepository.changePassword(resetPayload)

            return ServiceResponse.success(`Password has been reset successfully. Log in with the new password`, {})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }
}