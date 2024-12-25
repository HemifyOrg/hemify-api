import { appDataSource } from "../datasource";
import { AdminCreateInterface } from "./admin.interface";
import { Admin } from "./admin.model";

export class AdminRepository{
    private adminRepository = appDataSource.getRepository(Admin)

    public async create(payload: AdminCreateInterface){
        const admin = this.adminRepository.create(payload)

        await this.adminRepository.save(admin)
    }

    public async getAdmins(){
        const admins = await this.adminRepository.find({})

        return admins
    }

    public async get(id: string){
        const admin = await this.adminRepository.findOne({
            where: {id}
        })

        return admin
    }
}