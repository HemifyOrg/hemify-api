export enum Genders{
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}

export enum AccountStatus{
    ACTIVE = "active",
    SUSPENDED = "suspended",
    TERMINATED = "terminated"
}

export interface AuthInterface{
    username: string
    email: string
    password: string
    gender?: Genders
}

export interface AuthCreateInterface extends AuthInterface{
    account_create_token: string
    account_create_token_expires: Date
}


export interface AuthLoginInterface{
    username: string
    password: string
}

export interface AuthChangePasswordInterface{
    userId: string
    existingPassword: string
    newPassword: string
}

export interface AuthResetPasswordInterface{
    new_password: string
    reset_token: string
}




export interface AuthResponseData{
    user: IBasicUser
    jwt: IJWToken
}

interface IJWToken{
    accessToken: string
    refreshToken: string
}

interface IBasicUser{
    username: string
    email: string
    gender?: string
    created_at: Date
    updated_at: Date
}


export const getBasicUser = (user: IBasicUser) => {
    return {
        username: user.username,
        email: user.email,
        gender: user.gender,
        created_at: user.created_at,
        updated_at: user.updated_at
    }
}