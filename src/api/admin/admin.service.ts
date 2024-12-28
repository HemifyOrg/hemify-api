import { AdminRepository } from "./admin.repository";
import { ServiceResponse } from "../utils/responses";
import { AdminAuthInterface, AdminAuthResponseData, AdminCreateInterface, getBasicAdmin } from "./admin.interface";
import { compare } from "bcrypt";
import { formatToUserFriendlyDate, generateAccessToken, generateRefreshToken } from "../utils/common";
import { AuthRepository } from "../authentication/auth.repository";
import { AccountStatus, getBasicUser } from "../authentication/auth.interface";
import { WagerRepository } from "../wager/wager.repository";
import { FootballEventService } from "../football/football.service";


export class AdminService{
    private adminRepository = new AdminRepository()
    private authRepository = new AuthRepository()
    private wagerRepository = new WagerRepository()
    private footballService = new FootballEventService()

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

    public async getUserInfo(username: string){
        try{
            const user = await this.authRepository.getByUsername(username)

            if (!user) return ServiceResponse.error(`User with that username does not exist`)

            return ServiceResponse.success(`Successfully fetched user details`, {user: getBasicUser(user)})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }

    public async getFootballInfo(eventId: string){
        try{
            const {data:event} = await this.footballService.get(eventId)
            const {data: latest} = await this.footballService.getFixtureInfo(event?.football_event.fixture_id!)

            return ServiceResponse.success(`Successfully fetched football event`, {event, latest})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }

    public async hemifyStats(){
        try{
            const userCount = await this.authRepository.getUsersCount()
            const wagerCount = await this.wagerRepository.getWagersCount()

            const auth_data = {
                all_users_count: userCount.allUsersCount,
                active_users_count: userCount.activeUsersCount,
                suspended_users_count: userCount.suspendedUsersCount,
                terminated_users_count: userCount.terminatedUsersCount
            }

            const wager_data = {
                all_wagers_count: wagerCount.allWagersCount,
                open_wagers_count: wagerCount.openWagersCount,
                voided_wagers_count: wagerCount.voidedWagersCount,
                matched_wagers_count: wagerCount.matchedWagersCount,
                completed_wagers_count: wagerCount.completedWagersCount
            }

            

            return ServiceResponse.success(`Successfully returned Hemify Stats`, {auth_data, wager_data})
        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }

    



    
}