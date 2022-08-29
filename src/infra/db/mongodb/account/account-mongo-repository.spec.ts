import { Collection } from "mongodb"
import { MongoHelper } from "../helpers/mongo-helper"
import { AccountMongoRepository } from "./account-mongo-repository"

let accountCollection: Collection

describe('Account Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    const makeSut = (): AccountMongoRepository => {
        return new AccountMongoRepository()
    }

    describe('add()', () => {
        test('Should return account on add success', async () => {
            const sut = makeSut()
            const account = await sut.add({
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password'
            })
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('any_name')
            expect(account.email).toBe('any_email@email.com')
            expect(account.password).toBe('any_password')
        })
    })

    describe('loadByEmail()', () => {
        test('Should return account on loadByEmail success', async () => {
            const sut = makeSut()
            await sut.add({
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password'
            })
            const account = await sut.loadByEmail('any_email@email.com')
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('any_name')
            expect(account.email).toBe('any_email@email.com')
            expect(account.password).toBe('any_password')
        })

        test('Should return null if loadByEmail fails', async () => {
            const sut = makeSut()
            const account = await sut.loadByEmail('any_email@email.com')
            expect(account).toBeFalsy()
        })
    })

    describe('update()', () => {
        test('Should update the account accessToken on updateAccessToken success', async () => {
            const sut = makeSut()
            const res = await accountCollection.insertOne({
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password'
            })

            let account = await accountCollection.findOne( { _id: res.insertedId })
            expect(account?.accessToken).toBeFalsy()
            await sut.updateAccessToken(res.insertedId.toHexString(), 'any_token')
            account = await accountCollection.findOne( { _id: res.insertedId })
            expect(account).toBeTruthy()
            expect(account?.accessToken).toBe('any_token')
        })
    })

    describe('loadByToken()', () => {
        test('Should return account on loadByToken without role', async () => {
            const sut = makeSut()
            await accountCollection.insertOne({
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                accessToken: 'any_token'
            })
            const account = await sut.loadByToken('any_token')
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('any_name')
            expect(account.email).toBe('any_email@email.com')
            expect(account.password).toBe('any_password')
        })

        test('Should return account on loadByToken with role', async () => {
            const sut = makeSut()
            await accountCollection.insertOne({
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                accessToken: 'any_token',
                role: 'any_role'
            })
            const account = await sut.loadByToken('any_token', 'any_role')
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('any_name')
            expect(account.email).toBe('any_email@email.com')
            expect(account.password).toBe('any_password')
        })
    })
})