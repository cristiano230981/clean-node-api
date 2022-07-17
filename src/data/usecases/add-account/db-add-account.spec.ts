import { Encrypter } from "../../protocols/encrypter"
import { DbAddAccount } from "./db-add-account"

interface sutTypes {
    sut: DbAddAccount,
    encrypterStub: Encrypter
}

const makeSut = (): sutTypes => {
    const encrypterStub = makeEncrypter()
    const sut = new DbAddAccount(encrypterStub)
    return {
        sut,
        encrypterStub
    }
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt (value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncrypterStub()
}


describe('DbAddAccount Usecase', () => {
    test('Should call encrypter wuth correct password', async () => {
        const {sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }
        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })
})