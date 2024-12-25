import { AdminRepository } from "./admin.repository";
import { ServiceResponse } from "../utils/responses";
import { AdminAuthInterface, AdminAuthResponseData, AdminCreateInterface, getBasicAdmin } from "./admin.interface";
import { compare } from "bcrypt";
import { formatToUserFriendlyDate, generateAccessToken, generateRefreshToken } from "../utils/common";
import { AuthRepository } from "../authentication/auth.repository";
import { AccountStatus } from "../authentication/auth.interface";

export class AdminService{
    private adminRepository = new AdminRepository()
    private authRepository = new AuthRepository()

    public async create(payload: AdminCreateInterface){
        try{
            await this.adminRepository.create(payload)

            return ServiceResponse.success(`Successfully created account`, {})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }

    public async login(payload: AdminAuthInterface){
        try{
            const {email_address, password} = payload

            const existingAdmin = await this.adminRepository.getByEmail(email_address)

            if (!existingAdmin) return ServiceResponse.error(`This account does not exist`)

            const validatePassword = await compare(password, existingAdmin.password)

            if (!validatePassword) return ServiceResponse.error(`The password provided is incorrect`)

            const accessToken = await generateAccessToken(existingAdmin.id)
            const refreshToken = await generateRefreshToken(existingAdmin.id)

            const tokens = {accessToken, refreshToken}

            return ServiceResponse.success<AdminAuthResponseData>(`Successfully logged in Admin`, {admin: getBasicAdmin(existingAdmin), jwt: tokens})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }

    public async suspendUserAccount(username: string){
        try{
            const user = await this.authRepository.getByUsername(username)

            if (!user) return ServiceResponse.error(`User with that username does not exist`)

            if (user.account_status === AccountStatus.SUSPENDED) {
                return ServiceResponse.error(`This account is already suspended and cannot be suspended again. The current suspension lasts until ${formatToUserFriendlyDate(user.suspended_until)}.`)
            }

            if (user.account_status === AccountStatus.TERMINATED) return ServiceResponse.error(`This account has been permanently terminated and is no longer accessible.`)

            await this.authRepository.suspendAccount(username)

            return ServiceResponse.success(`Successfully suspended user account`, {})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }

    public async terminateUserAccount(username: string){
        try{

            const user = await this.authRepository.getByUsername(username)

            if (!user) return ServiceResponse.error(`User with that username does not exist`)

            if (user.account_status === AccountStatus.TERMINATED) return ServiceResponse.error(`This account has been permanently terminated and is no longer accessible.`)

            await this.authRepository.terminateAccount(username)

            return ServiceResponse.success(`Successfully terminated user account`, {})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }



    
}