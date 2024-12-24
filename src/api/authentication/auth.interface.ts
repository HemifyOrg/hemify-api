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