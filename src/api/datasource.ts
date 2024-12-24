import { DataSource } from "typeorm";
import { HEMIFY_DB, HEMIFY_DB_STAGING } from "../../env";

const DATABASE_URL = process.env.NODE_ENV === 'production' 
  ? HEMIFY_DB 
  : HEMIFY_DB_STAGING;



export const appDataSource = new DataSource({
    type: "postgres",
    url: DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [
		__dirname + '/../**/*.model.js',
		__dirname + '/../**/*.model.ts',
	],

    extra: {
        "ssl": true
    }
})