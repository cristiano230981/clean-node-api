import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/criptography/db/mongodb/account-repository/account";
import { SignupController } from "../../presentation/controllers/signup/signup";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { LogControllerDecorator } from "../decorators/log";

export const  makeSignUpController = (): SignupController => {
    const salt = 12
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
    const signUpController = new SignupController(emailValidatorAdapter, dbAddAccount)
    return new LogControllerDecorator(signUpController)
}