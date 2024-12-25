import { appDataSource } from "../datasource";
import { Auth } from "./auth.model";
import { AccountStatus, AuthChangePasswordInterface, AuthCreateInterface, AuthInterface } from "./auth.interface";
import { hashPassword } from "../utils/common";

export class AuthRepository{
    authRepository = appDataSource.getRepository(Auth)

    public async create(payload: AuthCreateInterface): Promise<Auth>{
        const user = this.authRepository.create(payload)

        const newUser = await this.authRepository.save(user)

        return newUser
    }

    public async get(id: string): Promise<Auth>{
        const user = await this.authRepository.findOne({
            where: {id}
        })

        if (!user) throw new Error(`User with ID ${id} not found`)

        return user
    }

    public async getByEmail(email: string): Promise<Auth|null>{
        const user = await this.authRepository.findOne({
            where: {email}
        })

        return user
    }

    public async getByUsername(username: string): Promise<Auth|null>{
        const user = await this.authRepository.findOne({
            where: {username}
        })

        return user
    }

    public async getByResetToken(resetToken: string): Promise<Auth|null>{
        const user = await this.authRepository.findOne({
            where: {password_reset_token: resetToken}
        })

        return user
    }

    public async changePassword(payload: AuthChangePasswordInterface): Promise<void> {
        const {userId, newPassword} = payload

        const user = await this.authRepository.findOne({
            where: {id: userId}
        })

        if (!user) throw new Error(`User with ID ${userId} not found`)

        user.password = await hashPassword(newPassword)

        await this.authRepository.save(user)
    }

    public async suspendAccount(username: string): Promise<void>{
        const user = await this.getByUsername(username)

        if (!user) throw new Error(`User with that username does not exist`)

        user.account_status = AccountStatus.SUSPENDED
        const currentDate = new Date()
        user.suspended_at = currentDate
        user.suspended_until = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)

        await this.authRepository.save(user)
    }

    public async terminateAccount(username: string): Promise<void>{
        const user = await this.getByUsername(username)

        if (!user) throw new Error(`User with that username does not exist`)

        user.account_status = AccountStatus.TERMINATED
        user.terminated_at = new Date()

        await this.authRepository.save(user)
    }
}