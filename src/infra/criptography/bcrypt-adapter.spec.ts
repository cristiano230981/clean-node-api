import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
    async hash (): Promise<string> {
        return new Promise(resolve => resolve('hash'))
    }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
    return  new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
    test('Should call bcrypt with correct value', async () => {
        const sut = makeSut()
        const haskSpy = jest.spyOn(bcrypt,'hash')
        await sut.hash('any_value')
        expect(haskSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a hash on sucess', async () => {
        const sut = makeSut()
        const hash = await sut.hash('any_value')
        expect(hash).toBe('hash')
    })

    // test('Should throw if bcrypt throws', async () => {
    //     const sut = makeSut()
    //     jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise<string>((resolve, reject) => rejects(new Error())))
    //     const promise = sut.encrypt('any_value')
    //     await expect(promise).rejects.toThrow()
    // })


    test('Should throw if bcrypt throws', async () => {
        const sut = makeSut()
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error()})
        const promise = sut.hash('any_value')
        await expect(promise).rejects.toThrow()
    })

})