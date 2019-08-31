import { Request, Response, NextFunction } from "express"
import { validate } from "class-validator"

export const validateQuery = (SchemaClass: any) => async (req: Request, res: Response, next: NextFunction) => {
    const validateObj = new SchemaClass()
    Object.assign(validateObj, req.query)
    const errors = await validate(validateObj, {
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: {
            target: false
        }
    })
    req.query = validateObj
    if(errors.length == 0)
        next()
    else
        res.status(400).json(errors)
}