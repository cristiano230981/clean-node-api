import request from "supertest"
import { MongoHelper } from "../../infra/criptography/db/mongodb/helpers/mongo-helper"
import app from "../config/app"

describe('signup Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        const accountCollection = MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    test('Should return an account on success', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: 'Cristiano',
                email: 'cristiano.moura@vbsolutions.com.br',
                password: '123',
                passwordConfirmation: '123',
            })
            .expect(200)
    })
})