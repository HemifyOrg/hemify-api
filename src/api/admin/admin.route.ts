import { Router } from "express";
import { AdminController } from "./admin.controller";
import { verifyAdminAccessToken } from "../utils/common";

export class AdminRoute{
    public router = Router()
    private adminController = new AdminController()

    constructor(){
        this.initRoutes()
    }

    initRoutes(){
        this.router.post("/admin/create", this.adminController.create)
        this.router.post("/admin/login", this.adminController.login)
        this.router.post("/admin/suspend-user", verifyAdminAccessToken, this.adminController.suspendUserAccount)
        this.router.post("/admin/terminate-user", verifyAdminAccessToken, this.adminController.terminateUserAccount)
        this.router.get("/admin/stats", verifyAdminAccessToken, this.adminController.getHemifyStats)
    }
}