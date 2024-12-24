import { CustomError } from "./error";
import { Response, Request, NextFunction, ErrorRequestHandler } from "express";
import {JsonWebTokenError} from "jsonwebtoken"
import { QueryFailedError } from "typeorm";


export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    next(CustomError.NotFound())
}



export const errorHandler = (
    error: ErrorRequestHandler,
    req: Request, 
    res: Response,
    next: NextFunction
): void => {
    // Default response details
    let message = "Request failed. Try again later";
    let code = 500;

    // Check for known error types and set response details
    if (error instanceof CustomError) {
        message = error.message;
        code = error.code;
    } else if (error instanceof JsonWebTokenError) {
        message = "Invalid or expired token";
        code = 403;
    } else if (error instanceof QueryFailedError) {
        message = "Database query error";
        code = 400;
    } else if (error instanceof SyntaxError || 
               error instanceof ReferenceError || 
               error instanceof TypeError || 
               error instanceof RangeError || 
               error instanceof URIError || 
               error instanceof EvalError) {
        message = error.message;
        code = 400;
    } else if ((error as any).code) {
        switch ((error as any).code) {
            case '23505': // Unique violation
                message = "Duplicate key error";
                code = 409;
                break;
            // Add more specific error codes here as needed
            default:
                message = "Database error";
                code = 400;
                break;
        }
    } else if (error instanceof Error) {
        message = error.message;
        code = 422;
    }

    // Send formatted error response
    res.status(code).json({ success: false, message });
};