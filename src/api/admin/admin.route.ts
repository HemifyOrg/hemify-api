import { Router } from "express";
import { AdminController } from "./admin.controller";

export class AdminRoute{
    public router = Router()
    private adminController = new AdminController()

    constructor(){
        this.initRoutes()
    }

    initRoutes(){
        this.router.post("/admin/create", this.adminController.create)
    }
}