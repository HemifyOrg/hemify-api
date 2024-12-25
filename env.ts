import * as dotenv from 'dotenv'

dotenv.config()

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!
export const ACCOUNT_CREATE_TOKEN_EXPIRY = Number(process.env.ACCOUNT_CREATE_TOKEN_EXPIRY!) || 0
export const API_VERSION = process.env.API_VERSION!
export const HEMIFY_DB = process.env.HEMIFY_DB!
export const HEMIFY_DB_STAGING = process.env.HEMIFY_DB_STAGING!
export const PORT = process.env.PORT!
export const NODE_ENV = process.env.NODE_ENV!
export const RAPID_API_KEY = process.env.RAPID_API_KEY!
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!