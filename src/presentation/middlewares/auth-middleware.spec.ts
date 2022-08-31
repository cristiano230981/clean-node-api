import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken, AccountModel, HttpRequest } from './auth-middleware-protocols'

const makeFakeAccount = (): AccountModel => (
    {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'hashed_password'
    }
)

const makeFakeRequest = (): HttpRequest => ({
        headers: {
            'x-access-token': 'any-token'
        }
    }
)

interface SutTypes {
    sut: AuthMiddleware,
    loadAccountByTokenStub: LoadAccountByToken,
}

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
        async load(accessToken: string, role?: string | undefined): Promise<AccountModel | null> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }

    }
    return new LoadAccountByTokenStub()
}

const makeSut = (role?: string): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub, role)
    return {
        sut,
        loadAccountByTokenStub
    }
}

describe('Auth Middleware', () => {
    test('Should return 403 if no x-access-token exists in headers', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    test('Should call LoadAccountByToken with correct accessToken', async () => {
        const role = 'any_role'
        const { sut, loadAccountByTokenStub } = makeSut(role)
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
        await sut.handle(makeFakeRequest())
        expect(loadSpy).toHaveBeenCalledWith('any-token', role)
    })

    test('Should return 403 if LoadAccountByToken returns null', async () => {
        const { sut , loadAccountByTokenStub} = makeSut()
        jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    test('Should return 200 if LoadAccountByToken returns account', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }))
    })

    test('Should return 500 if LoadAccountByToken throws', async () => {
        const { sut , loadAccountByTokenStub} = makeSut()
        jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise((resolve, rejects) => rejects(new Error())))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})