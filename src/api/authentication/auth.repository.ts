import { appDataSource } from "../datasource";
import { Auth } from "./auth.model";
import { AuthInterface } from "./auth.interface";

export class AuthRepository{
    authRepository = appDataSource.getRepository(Auth)

    public async create(payload: AuthInterface): Promise<Auth>{
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
}