import { AdminRoute } from "./admin/admin.route"
import { AuthRoute } from "./authentication/auth.route"
import { FootballRoute } from "./football/football.route"
import { HealthRoute } from "./health/health.route"
import { WagerRoute } from "./wager/wager.route"

export const routes = [
    new AuthRoute(),
    new AdminRoute(),
    new FootballRoute(),
    new WagerRoute(),
    new HealthRoute()
]