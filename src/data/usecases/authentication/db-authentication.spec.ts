import { AccountModel } from "../../../domain/models/account"
import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repositopry"
import { DbAuthentication } from "./db-authentication"

describe('DbAuthentication UseCase', () => {
    test('Should call LoadAccoiuntByEmailRepository with correct email', () => {
        class LoadAccoiuntByEmailRepositoryStub implements LoadAccountByEmailRepository {
            async load(email: string): Promise<AccountModel> {
                const account: AccountModel = {
                    id: 'any_id',
                    name: 'any_name',
                    email: 'any_email@mail.com',
                    password: 'any_password'
                }
                return new Promise(resolve => resolve(account))
            }
        }
        const loadAccoiuntByEmailRepositoryStub = new LoadAccoiuntByEmailRepositoryStub()
        const sut = new DbAuthentication(loadAccoiuntByEmailRepositoryStub)
        const loadSpy = jest.spyOn(loadAccoiuntByEmailRepositoryStub, 'load')
        sut.auth({
            email: 'any_email@mail.com',
            password: 'any_password'
        })
        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
})