import { Request, Response, NextFunction } from 'express'
import { createCustomError } from './ErrorHandler'
import crypto from 'crypto'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { z } from 'zod'

export const AuthGuardian = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        // get token
        const token = req.headers['authorization']?.split(' ')[1]

        // validation
        const schema = z.object({
            email: z.string()
                .email(req.t("login_credentials_failed"))
                .max(255, req.t("login_credentials_failed")),
            id: z.string()
                .uuid(req.t("login_credentials_failed"))
        })

        // token not found
        if (!token) {

            throw createCustomError({
                "message": `${req.t('login_credentials_failed')}`,
                "code": 401,
                "next": "/accounts/login",
                "prev": "/accounts/login",
            })

        }

        // token exists
        if (token) {

            // decrypt RSA
            const publicEncription = process.env.CRYPTO_PUBLIC?.trim() as string
            const decryptedJWT = crypto.publicDecrypt(
                publicEncription,
                Buffer.from(token, 'hex')
            ).toString('utf-8')

            // validate token
            const decodedJWT = jwt.verify(
                decryptedJWT,
                process.env.SECURITY_CODE?.trim() as string
            ) as JwtPayload

            // validate data
            schema.parse({
                email: decodedJWT.email,
                id: decodedJWT.id,
            })

        }

        next()

    } catch (error) {

        // JWT errors
        if (error instanceof jwt.JsonWebTokenError) {

            throw createCustomError({
                "message": `${req.t('login_credentials_failed')}`,
                "code": 401,
                "next": "/accounts/login",
                "prev": "/accounts/login",
            })

        }

        next(error)

    }

}