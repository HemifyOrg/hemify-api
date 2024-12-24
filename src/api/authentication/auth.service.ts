import { AuthRepository } from "./auth.repository";
import { ServiceResponse } from "../utils/responses";
import { Auth } from "./auth.model";
import { AuthInterface } from "./auth.interface";



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
}