export class CustomError{
    code: number
    message: string

    constructor(code: number, message: string){
        this.code = code
        this.message = message
    }

    static NotFound(): CustomError{
        return new CustomError(404, `Requested resource not found`)
    }

    static BadRequest(message: string){
        return new CustomError(400, message)
    }

    static InternalServerError(){
        return new CustomError(500, `Internal Server Error`)
    }
}