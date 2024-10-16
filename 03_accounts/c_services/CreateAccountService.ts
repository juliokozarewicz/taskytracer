import { AccountUserEntity } from "../a_entities/AccountUserEntity"
import { CreateAccountValidationType } from "../b_validations/CreateAccountValidation"
import { StandardResponse } from "../f_utils/StandardResponse"
import { AppDataSource } from "../server"
import { createCustomError } from '../e_middlewares/errorHandler'
import bcrypt from 'bcrypt'
import { AccountProfileEntity } from "../a_entities/AccountProfileEntity"

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

        // account banned
        if (
            existingUser &&
            existingUser.isBanned
        ) {
            existingUser.isActive = true
            await userRepository.save(existingUser)

            return {
                status: 'error',
                code: 401,
                message: `account disabled, please contact support`,
                links: {
                    self: '/accounts/signup',
                    next: '/accounts/signup',
                    prev: '/accounts/login',
                }
            }
        }

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
            })
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

        // existing email verification
        if (existingUser) {
            return {
                status: 'error',
                code: 409,
                message: `email already registered`,
                links: {
                    self: '/accounts/signup',
                    next: '/accounts/login',
                    prev: '/accounts/login',
                }
            }
        }

        // create user object to commit db
        const newUser = new AccountUserEntity()
        newUser.isActive = true
        newUser.level = false
        newUser.isBanned = false
        newUser.name = validatedData.name
        newUser.email = validatedData.email.toLocaleLowerCase()
        newUser.isEmailConfirmed = false
        newUser.password = await this.hashPassword(validatedData.password)

        // transaction commit db, profile and email code
        await userRepository.manager.transaction(async commitUserTransaction => {
            
            // user
            const savedUser = await commitUserTransaction.save(newUser)

            //profile
            const newProfile = new AccountProfileEntity()
            newProfile.user = savedUser
            await commitUserTransaction.save(newProfile)
        })
        











        return {
            status: 'success',
            code: 201,
            message:
                `account created successfully, please activate your ` +
                `account through the link sent to your email`,
            links: {
                self: '/accounts/signup',
                next: '/accounts/login',
                prev: '/accounts/login',
            }
        }
    }

    // password hash
    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 12
        return bcrypt.hash(password, saltRounds)
    }

}