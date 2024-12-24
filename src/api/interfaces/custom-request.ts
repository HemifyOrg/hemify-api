import { Request } from "express";

export interface User{
    id: string
}

export interface CustomRequest extends Request{
    user: User
}