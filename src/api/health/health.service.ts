import { ServiceResponse } from "../utils/responses";

export class HealthService{
    async getHealth(): Promise<ServiceResponse<{}>>{
        
        return ServiceResponse.success(`Health check passed`, {})
    }
}