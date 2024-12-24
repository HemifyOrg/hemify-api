import * as dotenv from 'dotenv'

dotenv.config()

export const API_VERSION = process.env.API_VERSION!
export const HEMIFY_DB = process.env.HEMIFY_DB!
export const HEMIFY_DB_STAGING = process.env.HEMIFY_DB_STAGING!
export const PORT = process.env.PORT!
export const NODE_ENV = process.env.NODE_ENV!