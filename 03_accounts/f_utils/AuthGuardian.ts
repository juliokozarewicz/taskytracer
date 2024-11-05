import { Request, Response, NextFunction } from 'express'

export const AuthGuardian = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('*** auth guardian ***')
    next()
}