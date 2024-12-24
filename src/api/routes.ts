import { AuthRoute } from "./authentication/auth.route"
import { FootballRoute } from "./football/football.route"

export const routes = [
    new AuthRoute(),
    new FootballRoute()
]