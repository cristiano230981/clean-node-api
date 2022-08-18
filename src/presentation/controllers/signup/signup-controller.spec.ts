import { MissingParamError, ServerError } from "../../errors"
import {  AddAccount, AddAccountModel, AccountModel, HttpRequest, Validation, Authentication, AuthenticationModel } from "./signup-controller-protocols"
import { SignupController } from "./signup-controller"
import { badRequest, ok, serverError } from "../../helpers/http/http-helper"

interface SubTypes {
    sut: SignupController,
    addAccountStub: AddAccount,
    validationStub: Validation,
    authenticationStub: Authentication
}

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add (account: AddAccountModel): Promise<AccountModel> {
            return  new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountStub()
}

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(authentication: AuthenticationModel): Promise<string> {
            return new Promise(resolve => resolve('any_token'))
        }
    }
    return new AuthenticationStub()
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate (input: any): Error {
            return null
        }
    }
    return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => (
    {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
    }
)

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
})

const makeSut = (): SubTypes => {
    const addAccountStub = makeAddAccount()
    const validationStub = makeValidation()
    const authenticationStub = makeAuthentication()
    const sut = new SignupController(addAccountStub, validationStub, authenticationStub)
    return {
        sut,
        addAccountStub,
        validationStub,
        authenticationStub
    }
}

describe('Signup Controller', () => {
    test('Should call AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        sut.handle(makeFakeRequest())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password'
        })
    })

    test('Should return 500 if AddAccount throws', async () => {
        const { sut , addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            throw new Promise((resolve, reject) => reject(new Error()))
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError()))
    })

    test('Should return 200 if valid data is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    })

    test('Should call Validation with correct values', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()
        sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('Should return 400 if Validation returns an error', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })

    test('Should call Authentication with correct values', async () => {
        const { sut , authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')
        await sut.handle(makeFakeRequest())
        expect(authSpy).toHaveBeenCalledWith({
            email: 'any_email@email.com',
            password: 'any_password'
        })
    })
})