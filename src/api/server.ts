import App from ".";
import http from 'http'
import { PORT, NODE_ENV } from "../../env";
import { routes } from "./routes";


class Server{
    private app = new App(routes)
    private port = PORT
    private server = http.createServer(this.app.getApp())

    public start(){
        this.server.listen(this.port, async () => {
            console.log(`⚡${NODE_ENV} server started on ${this.port}⚡`)
        })
    }

}

new Server().start()