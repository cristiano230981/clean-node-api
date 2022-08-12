import { AccountModel } from "./db-add-account-protocols"
import { DbAddAccount } from "./db-add-account"
import { Hasher } from "../../protocols/criptography/hasher"
import { AddAccountRepository } from "../../protocols/db/add-account-repository"
import { AddAccountModel } from "../../../domain/usecases/add-account"

interface sutTypes {
    sut: DbAddAccount,
    hasherStub: Hasher,
    addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): sutTypes => {
    const hasherStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
    return {
        sut,
        hasherStub,
        addAccountRepositoryStub
    }
}

const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
        async hash (value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        add (accountData: AddAccountModel): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => (
    {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
    }
)

const makeFakeAccountData = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
})

describe('DbAddAccount Usecase', () => {
    test('Should call hasher with correct password', async () => {
        const {sut, hasherStub } = makeSut()
        const encryptSpy = jest.spyOn(hasherStub, 'hash')
        await sut.add(makeFakeAccountData())
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })

    test('Should throw if hasher throws', async () => {
        const {sut, hasherStub } = makeSut()
        jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.add(makeFakeAccountData())
        await expect(promise).rejects.toThrow()
    })

    test('Should call AddAccountRepository with correct values', async () => {
        const {sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(makeFakeAccountData())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_password'
        })
    })

    test('Should throw if AddAccount throws', async () => {
        const {sut, addAccountRepositoryStub } = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.add(makeFakeAccountData())
        await expect(promise).rejects.toThrow()
    })

    test('Should return an accopunt on success', async () => {
        const {sut } = makeSut()
        const account = await sut.add(makeFakeAccountData())
        expect(account).toEqual(makeFakeAccount())
    })
})