export interface AdminCreateInterface{
    first_name: string
    last_name: string
    email_address: string
    password: string
}

export interface AdminAuthInterface{
    email_address: string
    password: string
}

export interface AdminAuthResponseData{
    admin: IBasicAdmin
    jwt: IJWToken
}

interface IBasicAdmin{
    first_name: string
    last_name: string
    email_address: string
}

interface IJWToken{
    accessToken: string
    refreshToken: string
}


export const getBasicAdmin = (admin: IBasicAdmin) => {
    return {
        first_name: admin.first_name,
        last_name: admin.last_name,
        email_address: admin.email_address
    }

}