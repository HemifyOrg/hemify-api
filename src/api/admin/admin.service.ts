import { AdminRepository } from "./admin.repository";
import { ServiceResponse } from "../utils/responses";
import { AdminCreateInterface } from "./admin.interface";

export class AdminService{
    private adminRepository = new AdminRepository()

    public async create(payload: AdminCreateInterface){
        try{
            await this.adminRepository.create(payload)

            return ServiceResponse.success(`Successfully created account`, {})

        }catch(error: any){
            return ServiceResponse.error(error.message)
        }
    }

    
}