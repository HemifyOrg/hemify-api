import  express, {Express, Request, Response, NextFunction} from 'express'
import cors from 'cors'
import { errorHandler } from './errorhandlers/error.handler'
import { notFoundHandler } from './errorhandlers/error.handler'
import { Routes } from './routes.interface'
import { API_VERSION } from '../../env'
import { appDataSource } from './datasource'

class App{
    public app: Express

    constructor(routes: Routes){
        this.app = express()
        this.initMiddlewares()
        this.initRoutes(routes)
        this.initErrorHandlers()
        this.initDB()

    }

    private initMiddlewares(){
        this.app.use(cors())
        this.app.use((req: Request, res: Response, next: NextFunction) => {
			res.header("Access-Control-Allow-Origin", "*");
			res.header(
				"Access-Control-Allow-Methods",
				"GET, POST, PUT, DELETE, OPTIONS",
			);
			res.header(
				"Access-Control-Allow-Headers",
				"Origin, X-Requested-With, Content-Type, Accept, Authorization",
			);
			res.setHeader("Access-Control-Allow-Credentials", "true");
			next();
		})

        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json({limit: "25mb"}))

    }

    private initRoutes(routes: Routes){
        routes.forEach((route) => {
            this.app.use(`/api/v${API_VERSION}`, route.router)
        })
    }

    private initErrorHandlers(){
        this.app.use(notFoundHandler)
        this.app.use(errorHandler)
    }

    private async initDB(){
        try{
            await appDataSource.initialize().then(() => {
                console.log(`Database connection established`)
            })

        }catch(error: any){
            console.log(`Database connection failed`)
            console.error(error)
        }
    }

    getApp(){
        return this.app
    }

}

export default App