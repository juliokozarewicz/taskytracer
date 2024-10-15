import { AccountUserEntity } from "../a_entities/AccountUserEntity";
import { CreateAccountValidationType } from "../b_validations/CreateAccountValidation";
import { StandardResponse } from "../f_utils/StandardResponse";
import { AppDataSource } from "../server";
import { createCustomError } from '../e_middlewares/errorHandler'
import bcrypt from 'bcrypt'

export class CreateAccountService {

    async execute(
        validatedData: CreateAccountValidationType
    ): Promise<StandardResponse> {

        // database operations
        //-------------------------------------------------------------------------
        const userRepository = AppDataSource.getRepository(AccountUserEntity)

        // existing user
        const existingUser = await userRepository.findOne({
            where: {
                email: validatedData.email.toLocaleLowerCase()
            }
        })

        // reactivate account invalid credentials
        if (
            existingUser &&
            !existingUser.isActive &&
            !await bcrypt.compare(validatedData.password, existingUser.password)
        ) {

            throw createCustomError({
                message: `if you want to reactivate your account, ` +
                          `enter your details correctly! If you forgot your password, ` +
                          `change it and try again`,
                code: 401,
                next: '/accounts/signup',
                prev: '/accounts/login'
            });
        }

        // reactivate account
        if (
            existingUser &&
            !existingUser.isActive &&
            await bcrypt.compare(validatedData.password, existingUser.password)
        ) {
            existingUser.isActive = true
            await userRepository.save(existingUser)

            return {
                status: 'success',
                code: 201,
                message: `user successfully reactivated`,
                links: {
                    self: '/accounts/signup',
                    next: '/accounts/login',
                    prev: '/accounts/login',
                }
            }
        }

        return {
            status: 'success',
            code: 201,
            message: `account created successfully, please activate your account through the link sent to your email`,
            links: {
                self: '/accounts/signup',
                next: '/accounts/login',
                prev: '/accounts/login',
            }
        }
    }

}